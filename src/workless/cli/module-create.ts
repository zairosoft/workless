// CLI entrypoint for scaffolding runtime modules.
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, resolve } from 'node:path';

const MODULE_DIRECTORIES = [
  'app/controllers',
  'app/dto',
  'app/entities',
  'app/hooks',
  'app/interfaces',
  'app/lifecycle',
  'app/locales/en',
  'app/locales/th',
  'app/policies',
  'app/repositories',
  'app/services',
  'app/views',
  'database/migrations',
  'database/seeders',
];

async function bootstrap(): Promise<void> {
  const [name, ...extraArguments] = process.argv.slice(2);

  if (!name || extraArguments.length > 0) {
    throw new Error('Usage: npm run module:create -- <module-name>');
  }

  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(
      'Module name must use lowercase kebab-case, for example "customer-support".',
    );
  }

  const projectRoot = process.cwd();
  const modulesRoot = resolve(projectRoot, 'src/modules');
  const moduleRoot = resolve(modulesRoot, name);
  const runtimeModulesPath = join(modulesRoot, 'modules.ts');

  await ensurePathDoesNotExist(moduleRoot, name);

  const runtimeSource = await readFile(runtimeModulesPath, 'utf8');
  const className = `${toPascalCase(name)}Module`;
  const lifecycleClassName = `${toPascalCase(name)}ModuleLifecycleService`;
  const runtimeSpec =
    `  { name: '${name}', exportName: '${className}', requirePath: './${name}/module' },`;

  if (runtimeSource.includes(`name: '${name}'`)) {
    throw new Error(`Runtime module "${name}" is already registered.`);
  }

  const updatedRuntimeSource = addRuntimeModule(runtimeSource, runtimeSpec);

  for (const directory of MODULE_DIRECTORIES) {
    const directoryPath = join(moduleRoot, directory);
    await mkdir(directoryPath, { recursive: true });

    if (
      !['app/lifecycle', 'app/locales/en', 'app/locales/th'].includes(directory)
    ) {
      await writeFile(join(directoryPath, '.gitkeep'), '', { flag: 'wx' });
    }
  }

  await Promise.all([
    writeFile(join(moduleRoot, 'app/locales/en/common.json'), '{}\n', {
      flag: 'wx',
    }),
    writeFile(join(moduleRoot, 'app/locales/th/common.json'), '{}\n', {
      flag: 'wx',
    }),
  ]);
  await writeFile(
    join(moduleRoot, 'app.config.json'),
    createAppConfigSource(name),
    { flag: 'wx' },
  );
  await writeFile(join(moduleRoot, 'README.md'), createReadmeSource(name), {
    flag: 'wx',
  });
  await writeFile(
    join(moduleRoot, 'module.ts'),
    createModuleSource(className, lifecycleClassName, name),
    { flag: 'wx' },
  );
  await writeFile(
    join(moduleRoot, 'app/lifecycle', `${name}-module.lifecycle.ts`),
    createLifecycleSource(lifecycleClassName, name),
    { flag: 'wx' },
  );
  await writeFile(runtimeModulesPath, updatedRuntimeSource, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Created and registered module "${name}" at src/modules/${name}.`);
  // eslint-disable-next-line no-console
  console.log(`Next: npm run build && npm run module:install -- ${name}`);
}

async function ensurePathDoesNotExist(moduleRoot: string, name: string): Promise<void> {
  try {
    await access(moduleRoot, constants.F_OK);
  } catch (error) {
    if (isMissingPathError(error)) {
      return;
    }

    throw error;
  }

  const entries = await readdir(moduleRoot, {
    recursive: true,
    withFileTypes: true,
  });

  if (entries.some((entry) => entry.isFile())) {
    throw new Error(`Module "${name}" already exists at src/modules/${name}.`);
  }
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string' &&
    error.code === 'ENOENT'
  );
}

function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join('');
}

function toCamelCase(name: string): string {
  const pascalCaseName = toPascalCase(name);
  return `${pascalCaseName[0].toLowerCase()}${pascalCaseName.slice(1)}`;
}

function toDisplayName(name: string): string {
  return name
    .split('-')
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function addRuntimeModule(source: string, runtimeSpec: string): string {
  const marker = /const RUNTIME_MODULE_SPECS: RuntimeModuleSpec\[\] = \[\r?\n/;

  if (!marker.test(source)) {
    throw new Error('Could not find RUNTIME_MODULE_SPECS in src/modules/modules.ts.');
  }

  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  return source.replace(marker, (match) => `${match}${runtimeSpec}${newline}`);
}

function createModuleSource(
  className: string,
  lifecycleClassName: string,
  name: string,
): string {
  return `import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import appConfig from '@modules/${name}/app.config.json';
import { ${lifecycleClassName} } from '@modules/${name}/app/lifecycle/${name}-module.lifecycle';

export const ${toCamelCase(name)}Config = registerAs('${name}', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(${toCamelCase(name)}Config)],
  providers: [${lifecycleClassName}],
  exports: [${lifecycleClassName}],
})
export class ${className} {}
`;
}

function createAppConfigSource(name: string): string {
  const displayName = toDisplayName(name);

  return `${JSON.stringify(
    {
      name: displayName,
      icon: 'fa fa-cube',
      version: '1.0.0',
      license: '',
      author: '',
      category: 'Other',
      website: 'https://www.example.com',
      description: `${displayName} module`,
      subMenu: [],
      installable: true,
      application: false,
    },
    null,
    2,
  )}\n`;
}

function createReadmeSource(name: string): string {
  return `# ${toDisplayName(name)}\n\nGenerated Workless module.\n`;
}

function createLifecycleSource(lifecycleClassName: string, name: string): string {
  return `import { Injectable } from '@nestjs/common';
import { SystemModule } from '@/workless/module/module.decorator';
import {
  ModuleLifecycleContext,
  SystemModuleLifecycle,
} from '@/workless/module/module.interface';

@SystemModule({
  name: '${name}',
  version: '1.0.0',
  description: '${toDisplayName(name)} module registry placeholder',
})
@Injectable()
export class ${lifecycleClassName} implements SystemModuleLifecycle {
  async install(_context: ModuleLifecycleContext): Promise<void> {}

  async uninstall(_context: ModuleLifecycleContext): Promise<void> {}

  async upgrade(
    _context: ModuleLifecycleContext,
    _fromVersion?: string,
  ): Promise<void> {}
}
`;
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
