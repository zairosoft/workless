import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { SYSTEM_MODULE_METADATA, SystemModuleMetadata } from '@/workless/module/module.decorator';
import { DiscoveredSystemModule, SystemModuleLifecycle } from '@/workless/module/module.interface';

@Injectable()
export class SystemModuleExplorer {
  private discoveredModules?: DiscoveredSystemModule[];
  private readonly controllerModules = new Map<Function, string>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  getModules(): DiscoveredSystemModule[] {
    if (!this.discoveredModules) {
      this.discoveredModules = this.scanModules();
    }

    return this.discoveredModules;
  }

  getModule(name: string): DiscoveredSystemModule | undefined {
    return this.getModules().find((definition) => definition.metadata.name === name);
  }

  getControllerModuleName(controller: Function): string | undefined {
    this.getModules();
    return this.controllerModules.get(controller);
  }

  private scanModules(): DiscoveredSystemModule[] {
    const modules: DiscoveredSystemModule[] = [];

    for (const wrapper of this.discoveryService.getProviders()) {
      const instance = wrapper.instance as SystemModuleLifecycle | undefined;
      if (!instance) {
        continue;
      }

      const metadata = this.reflector.get<SystemModuleMetadata>(
        SYSTEM_MODULE_METADATA,
        instance.constructor,
      );

      if (!metadata) {
        continue;
      }

      // The lifecycle provider and controllers belong to the same Nest module.
      for (const controller of wrapper.host?.controllers.values() ?? []) {
        if (!controller.metatype) continue;

        const existingOwner = this.controllerModules.get(controller.metatype);
        if (existingOwner && existingOwner !== metadata.name) {
          throw new Error(`Controller "${controller.name}" belongs to multiple system modules.`);
        }

        this.controllerModules.set(controller.metatype, metadata.name);
      }

      modules.push({
        metadata: {
          ...metadata,
          dependencies: metadata.dependencies ?? [],
          migrations: metadata.migrations ?? [],
          seeders: metadata.seeders ?? [],
        },
        instance,
      });
    }

    return modules;
  }
}

