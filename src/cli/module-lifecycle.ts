// CLI entrypoint for module lifecycle operations.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ModuleLifecycleService } from '@/workless/lifecycle/module.lifecycle';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
} from '@/workless/registry/module-registry.interface';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const [command, target] = process.argv.slice(2);
    const lifecycle = app.get(ModuleLifecycleService);
    const registry = app.get<ModuleRegistryPort>(MODULE_REGISTRY_PORT);

    if (!command || command === 'list') {
      const modules = await registry.list();
      // eslint-disable-next-line no-console
      console.table(
        modules.map((moduleState) => ({
          name: moduleState.name,
          version: moduleState.version,
          status: moduleState.status,
          enabled: moduleState.enabled,
        })),
      );
      return;
    }

    if (target === '--all') {
      const modules = await registry.list();
      for (const moduleState of modules) {
        if (command === 'install') {
          await lifecycle.install(moduleState.name);
        }

        if (command === 'upgrade') {
          await lifecycle.upgrade(moduleState.name);
        }

        if (command === 'migrate') {
          await lifecycle.migrate(moduleState.name);
        }

        if (command === 'seed') {
          await lifecycle.seed(moduleState.name);
        }
      }

      return;
    }

    if (!target) {
      throw new Error(`Missing module name for "${command}" command.`);
    }

    await ensureManagedModuleExists(registry, target);

    if (command === 'install') {
      await lifecycle.install(target);
      return;
    }

    if (command === 'upgrade') {
      await lifecycle.upgrade(target);
      return;
    }

    if (command === 'uninstall') {
      await lifecycle.uninstall(target);
      return;
    }

    if (command === 'migrate') {
      await lifecycle.migrate(target);
      return;
    }

    if (command === 'migration:status') {
      console.table(await lifecycle.migrationStatus(target));
      return;
    }

    if (command === 'migration:revert') {
      const reverted = await lifecycle.revertMigration(target);
      console.log(reverted ? `Reverted migration: ${reverted}` : 'No applied migration to revert.');
      return;
    }

    if (command === 'seed') {
      console.table(await lifecycle.seed(target));
      return;
    }

    throw new Error(`Unsupported command "${command}".`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Module lifecycle command failed', error);
  process.exit(1);
});

async function ensureManagedModuleExists(
  registry: ModuleRegistryPort,
  name: string,
): Promise<void> {
  const modules = await registry.list();
  if (!modules.some((moduleState) => moduleState.name === name)) {
    throw new Error(
      `Unsupported module "${name}". Available modules: ${modules
        .map((moduleState) => moduleState.name)
        .join(', ')}`,
    );
  }
}
