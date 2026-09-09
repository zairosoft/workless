import { SetMetadata } from '@nestjs/common';
import { WorklessMigrationConstructor } from '@/workless/interfaces/migration.interface';
import { ModuleSeederConstructor } from '@/workless/lifecycle/module-seeder.interface';

export const SYSTEM_MODULE_METADATA = Symbol('SYSTEM_MODULE_METADATA');

export type SystemModuleMetadata = {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  migrations?: WorklessMigrationConstructor[];
  seeders?: ModuleSeederConstructor[];
};

export function SystemModule(metadata: SystemModuleMetadata): ClassDecorator {
  return SetMetadata(SYSTEM_MODULE_METADATA, metadata);
}
