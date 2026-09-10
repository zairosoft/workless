import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SystemModuleExplorer } from '@/workless/module/module.explorer';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
} from '@/workless/registry/module-registry.interface';

@Injectable()
export class ModuleRegistrySynchronizer implements OnApplicationBootstrap {
  constructor(
    private readonly moduleExplorer: SystemModuleExplorer,
    @Inject(MODULE_REGISTRY_PORT)
    private readonly moduleRegistry: ModuleRegistryPort,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const definitions = this.moduleExplorer.getModules().map(({ metadata }) => ({
      name: metadata.name,
      version: metadata.version,
      description: metadata.description ?? null,
      dependencies: metadata.dependencies,
    }));

    await this.moduleRegistry.synchronize(definitions);
  }
}
