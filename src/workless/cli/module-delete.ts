// CLI entrypoint for removing runtime module source files.
import { access, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, resolve } from 'node:path';

async function bootstrap(): Promise<void> {
  const [name, ...extraArguments] = process.argv.slice(2);

  if (!name || extraArguments.length > 0) {
    throw new Error('Usage: npm run module:delete -- <module-name>');
  }

  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(
      'Module name must use lowercase kebab-case, for example "customer-support".',
    );
  }

  const modulesRoot = resolve(process.cwd(), 'src/modules');
  const moduleRoot = resolve(modulesRoot, name);
  const runtimeModulesPath = join(modulesRoot, 'modules.ts');
  const stagedModuleRoot = resolve(
    modulesRoot,
    `.${name}.delete-${process.pid}-${Date.now()}`,
  );

  await ensureModuleExists(moduleRoot, name);

  const runtimeSource = await readFile(runtimeModulesPath, 'utf8');
  const updatedRuntimeSource = removeRuntimeModule(runtimeSource, name);

  await rename(moduleRoot, stagedModuleRoot);

  try {
    await writeFile(runtimeModulesPath, updatedRuntimeSource, 'utf8');
  } catch (error) {
    await rename(stagedModuleRoot, moduleRoot);
    throw error;
  }

  await rm(stagedModuleRoot, { recursive: true, force: true });

  // eslint-disable-next-line no-console
  console.log(`Deleted and unregistered module "${name}".`);
  // eslint-disable-next-line no-console
  console.log('Database tables and module registry records were not removed.');
}

async function ensureModuleExists(moduleRoot: string, name: string): Promise<void> {
  try {
    await access(moduleRoot, constants.F_OK);
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Module "${name}" does not exist at src/modules/${name}.`);
    }

    throw error;
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

function removeRuntimeModule(source: string, name: string): string {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const runtimeSpec = new RegExp(
    `^  \\{ name: '${escapedName}', exportName: '[^']+', requirePath: '\\./${escapedName}/module' \\},\\r?\\n`,
    'm',
  );

  if (!runtimeSpec.test(source)) {
    throw new Error(`Runtime module "${name}" is not registered.`);
  }

  return source.replace(runtimeSpec, '');
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
