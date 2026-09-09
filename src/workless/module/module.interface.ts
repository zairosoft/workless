import { WorklessMigrationConstructor } from '@/workless/interfaces/migration.interface';
import { HookPort } from '@/workless/interfaces/hook.interface';
import { CachePort } from '@/workless/infrastructure/cache/cache.interface';
import { ModuleSeederConstructor } from '@/workless/lifecycle/module-seeder.interface';

export type ModuleLifecycleContext = {
  cacheService: CachePort;
  hookService: HookPort;
};

export interface SystemModuleLifecycle {
  install(context: ModuleLifecycleContext): Promise<void>;
  uninstall(context: ModuleLifecycleContext): Promise<void>;
  upgrade(context: ModuleLifecycleContext, fromVersion?: string): Promise<void>;
}

export interface DiscoveredSystemModule {
  metadata: {
    name: string;
    version: string;
    description?: string;
    dependencies: string[];
    migrations: WorklessMigrationConstructor[];
    seeders: ModuleSeederConstructor[];
  };
  instance: SystemModuleLifecycle;
}
