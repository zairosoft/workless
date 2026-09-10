import { Logger, Type } from '@nestjs/common';

type RuntimeModuleSpec = {
  name: string;
  exportName: string;
  requirePath: string;
};

const logger = new Logger('RuntimeModules');

const RUNTIME_MODULE_SPECS: RuntimeModuleSpec[] = [
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
