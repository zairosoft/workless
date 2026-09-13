import { Logger, Type } from '@nestjs/common';
import type { ModuleAppConfig } from '@/workless/module/module-app-config.interface';

type RuntimeModuleSpec = {
  name: string;
  exportName: string;
  requirePath: string;
};

const logger = new Logger('RuntimeModules');

const RUNTIME_MODULE_SPECS: RuntimeModuleSpec[] = [
  { name: 'apps', exportName: 'AppsModule', requirePath: './apps/module' },
  { name: 'dashboard', exportName: 'DashboardModule', requirePath: './dashboard/module' },
  { name: 'website', exportName: 'WebsiteModule', requirePath: './website/module' },
];

export function loadRuntimeModules(): Type<unknown>[] {
  const runtimeModules: Type<unknown>[] = [];

  for (const spec of RUNTIME_MODULE_SPECS) {
    const moduleRef = tryLoadRuntimeModule(spec);
    if (moduleRef) {
      runtimeModules.push(moduleRef);
    }
  }

  return runtimeModules;
}

export function loadRuntimeModuleConfigs(): ModuleAppConfig[] {
  const configs: ModuleAppConfig[] = [];

  for (const spec of RUNTIME_MODULE_SPECS) {
    try {
      const config = require(`./${spec.name}/app.config.json`) as unknown;

      if (!isModuleAppConfig(config)) {
        logger.warn(`Runtime module "${spec.name}" has an invalid app.config.json and will be skipped.`);
        continue;
      }

      configs.push(config);
    } catch (error) {
      if (isMissingModuleError(error, `./${spec.name}/app.config.json`)) {
        logger.warn(`Runtime module "${spec.name}" does not provide app.config.json.`);
        continue;
      }

      throw error;
    }
  }

  return configs;
}

function tryLoadRuntimeModule(spec: RuntimeModuleSpec): Type<unknown> | null {
  try {
    const loadedModule = require(spec.requirePath) as Record<string, Type<unknown> | undefined>;
    const moduleRef = loadedModule[spec.exportName];

    if (!moduleRef) {
      logger.warn(
        `Runtime module "${spec.name}" was found at "${spec.requirePath}" but export "${spec.exportName}" is missing.`,
      );
      return null;
    }

    return moduleRef;
  } catch (error) {
    if (isMissingModuleError(error, spec.requirePath)) {
      logger.warn(`Runtime module "${spec.name}" is not present and will be skipped.`);
      return null;
    }

    throw error;
  }
}

function isMissingModuleError(error: unknown, requirePath: string): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const moduleNotFound =
    'code' in error &&
    typeof error.code === 'string' &&
    error.code === 'MODULE_NOT_FOUND';

  return moduleNotFound && error.message.includes(requirePath);
}

function isModuleAppConfig(value: unknown): value is ModuleAppConfig {
  if (!value || typeof value !== 'object') return false;

  const config = value as Record<string, unknown>;
  const requiredStrings = [
    'name',
    'icon',
    'version',
    'license',
    'author',
    'category',
    'website',
    'description',
  ];

  if (!requiredStrings.every((key) => typeof config[key] === 'string')) return false;
  if (typeof config.installable !== 'boolean' || typeof config.application !== 'boolean') return false;
  if (!Array.isArray(config.subMenu)) return false;
  if (config.application && (typeof config.title !== 'string' || typeof config.url !== 'string')) {
    return false;
  }

  return config.subMenu.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const menu = item as Record<string, unknown>;
    return (
      typeof menu.title === 'string' &&
      typeof menu.name === 'string' &&
      typeof menu.url === 'string' &&
      (menu.description === undefined || typeof menu.description === 'string') &&
      (menu.icon === undefined || typeof menu.icon === 'string')
    );
  });
}
