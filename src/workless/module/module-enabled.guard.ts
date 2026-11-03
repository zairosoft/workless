import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_ENABLED_METADATA } from '@/workless/module/module-enabled.decorator';
import { SystemModuleExplorer } from '@/workless/module/module.explorer';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
  ModuleStatus,
} from '@/workless/registry/module-registry.interface';

@Injectable()
export class ModuleEnabledGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleExplorer: SystemModuleExplorer,
    @Inject(MODULE_REGISTRY_PORT)
    private readonly moduleRegistry: ModuleRegistryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Refresh before rendering any page, including platform pages with a sidebar.
    // Route access and navigation use the same persisted lifecycle state.
    const modules = await this.moduleRegistry.list();
    const enabledModules = new Set(
      modules
        .filter((record) => record.enabled && record.status === ModuleStatus.INSTALLED)
        .map((record) => record.name),
    );
    const owner = this.moduleExplorer.getControllerModuleName(context.getClass());
    const explicitRequirement = this.reflector.getAllAndOverride<string | undefined>(
      MODULE_ENABLED_METADATA,
      [context.getHandler(), context.getClass()],
    );

    const requiredModules = new Set([owner, explicitRequirement].filter(Boolean));

    for (const moduleName of requiredModules) {
      if (!enabledModules.has(moduleName)) {
        throw new ServiceUnavailableException(
          `Module "${moduleName}" is not installed or is disabled.`,
        );
      }
    }

    return true;
  }
}
