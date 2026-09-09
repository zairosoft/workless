import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  EVENT_BUS_PORT,
  EventBusPort,
} from '@/workless/interfaces/event-bus.interface';
import { HOOK_PORT, HookPort } from '@/workless/interfaces/hook.interface';
import {
  CACHE_PORT,
  CachePort,
} from '@/workless/infrastructure/cache/cache.interface';
import { SystemModuleExplorer } from '@/workless/module/module.explorer';
import { ModuleLifecycleContext } from '@/workless/module/module.interface';
import { ModuleSeedingService } from '@/workless/lifecycle/module-seeding.service';
import {
  MIGRATION_PORT,
  MigrationPort,
} from '@/workless/interfaces/migration.interface';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
} from '@/workless/registry/module-registry.interface';

@Injectable()
export class ModuleLifecycleService {
  private readonly logger = new Logger(ModuleLifecycleService.name);

  constructor(
    private readonly moduleExplorer: SystemModuleExplorer,
    @Inject(MODULE_REGISTRY_PORT)
    private readonly moduleRegistry: ModuleRegistryPort,
    @Inject(CACHE_PORT) private readonly cacheService: CachePort,
    @Inject(HOOK_PORT)
    private readonly hookService: HookPort,
    @Inject(EVENT_BUS_PORT)
    private readonly eventBus: EventBusPort,
    @Inject(MIGRATION_PORT)
    private readonly migrationService: MigrationPort,
    private readonly moduleSeedingService: ModuleSeedingService,
  ) {}

  async install(name: string) {
    const definition = this.getDefinitionOrFail(name);
    const currentState = await this.moduleRegistry.getOrFail(name);
    const context = this.createContext();

    if (currentState.enabled) {
      return currentState;
    }

    await this.ensureDependenciesEnabled(definition.metadata.dependencies);
    this.logger.log(`Installing module "${name}"`);
    await this.migrationService.migrateModule(name, definition.metadata.migrations);
    await definition.instance.install(context);
    const result = await this.moduleRegistry.markInstalled(name, definition.metadata.version);
    await this.eventBus.emit('system.module.installed', {
      name,
      version: definition.metadata.version,
    });
    await this.eventBus.emit('notification.send', {
      name: 'system.module.installed',
      payload: {
        name,
        version: definition.metadata.version,
      },
      receivedAt: new Date().toISOString(),
    });
    return result;
  }

  async uninstall(name: string) {
    const definition = this.getDefinitionOrFail(name);
    const currentState = await this.moduleRegistry.getOrFail(name);
    const context = this.createContext();

    if (currentState.status === 'uninstalled') {
      return currentState;
    }

    await this.ensureNoEnabledDependents(name);
    this.logger.log(`Uninstalling module "${name}"`);
    await definition.instance.uninstall(context);
    await this.moduleRegistry.markDisabled(name);
    const result = await this.moduleRegistry.markUninstalled(name);
    await this.eventBus.emit('system.module.uninstalled', { name });
    await this.eventBus.emit('notification.send', {
      name: 'system.module.uninstalled',
      payload: { name },
      receivedAt: new Date().toISOString(),
    });
    return result;
  }

  async upgrade(name: string) {
    const definition = this.getDefinitionOrFail(name);
    const currentState = await this.moduleRegistry.getOrFail(name);
    const context = this.createContext();
    const fromVersion = currentState.version;

    this.logger.log(
      `Upgrading module "${name}" from "${fromVersion}" to "${definition.metadata.version}"`,
    );
    await this.migrationService.migrateModule(name, definition.metadata.migrations);
    await definition.instance.upgrade(context, fromVersion);
    const result = await this.moduleRegistry.markInstalled(name, definition.metadata.version);
    await this.eventBus.emit('system.module.upgraded', {
      name,
      fromVersion,
      toVersion: definition.metadata.version,
    });
    await this.eventBus.emit('notification.send', {
      name: 'system.module.upgraded',
      payload: {
        name,
        fromVersion,
        toVersion: definition.metadata.version,
      },
      receivedAt: new Date().toISOString(),
    });
    return result;
  }

  async migrate(name: string): Promise<string[]> {
    const definition = this.getDefinitionOrFail(name);
    await this.ensureDependenciesEnabled(definition.metadata.dependencies);
    return this.migrationService.migrateModule(name, definition.metadata.migrations);
  }

  async migrationStatus(name: string) {
    const definition = this.getDefinitionOrFail(name);
    return this.migrationService.status('module', name, definition.metadata.migrations);
  }

  async revertMigration(name: string): Promise<string | null> {
    const definition = this.getDefinitionOrFail(name);
    return this.migrationService.revertLast('module', name, definition.metadata.migrations);
  }

  async seed(name: string) {
    const definition = this.getDefinitionOrFail(name);
    await this.ensureDependenciesEnabled(definition.metadata.dependencies);
    await this.migrationService.migrateModule(name, definition.metadata.migrations);
    const results = await this.moduleSeedingService.seed(name, definition.metadata.seeders);
    await this.eventBus.emit('system.module.seeded', {
      name,
      seeders: results.map((result) => result.seeder),
    });
    return results;
  }

  private getDefinitionOrFail(name: string) {
    const definition = this.moduleExplorer.getModule(name);
    if (!definition) {
      throw new NotFoundException(`System module "${name}" has no lifecycle provider.`);
    }

    return definition;
  }

  private createContext(): ModuleLifecycleContext {
    return {
      cacheService: this.cacheService,
      hookService: this.hookService,
    };
  }

  private async ensureDependenciesEnabled(dependencies: string[]): Promise<void> {
    for (const dependencyName of dependencies) {
      const enabled = await this.moduleRegistry.isEnabled(dependencyName);
      if (!enabled) {
        throw new ConflictException(
          `Module dependency "${dependencyName}" must be installed and enabled first.`,
        );
      }
    }
  }

  private async ensureNoEnabledDependents(name: string): Promise<void> {
    const registeredModules = await this.moduleRegistry.list();
    const enabledDependents = registeredModules.filter(
      (record) =>
        record.enabled &&
        record.status === 'installed' &&
        (record.dependencies ?? []).includes(name),
    );

    if (enabledDependents.length > 0) {
      throw new ConflictException(
        `Module "${name}" cannot be uninstalled while dependents are enabled: ${enabledDependents
          .map((record) => record.name)
          .join(', ')}`,
      );
    }
  }
}
