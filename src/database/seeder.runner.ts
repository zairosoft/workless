import 'reflect-metadata';
import { randomBytes } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '@/app.module';
import { ModuleLifecycleService } from '@/workless/lifecycle/module.lifecycle';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
} from '@/workless/registry/module-registry.interface';
import { databaseSeeders } from '@/database/seeders/seeders';

async function runSeeders() {
  if (!process.env.JWT_SECRET?.trim()) {
    process.env.JWT_SECRET = randomBytes(32).toString('hex');
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const dataSource = app.get(DataSource);
    for (const seeder of databaseSeeders) {
      await seeder.seed(dataSource);
    }

    const moduleLifecycle = app.get(ModuleLifecycleService);
    const moduleRegistry = app.get<ModuleRegistryPort>(MODULE_REGISTRY_PORT);
    const modules = await moduleRegistry.list();
    for (const moduleState of modules) {
      await moduleLifecycle.seed(moduleState.name);
    }
  } finally {
    await app.close();
  }
}

runSeeders()
  .then(() => {
    console.log('Seeders completed');
  })
  .catch((error) => {
    console.error('Seeder failed', error);
    process.exit(1);
  });
