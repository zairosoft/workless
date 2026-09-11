import { WorklessMigrationConstructor } from '@/workless/interfaces/migration.interface';
import { CreateModuleRegistryMigration } from '@/database/migrations/202607120001-create-module-registry.migration';
import { CreateUsersMigration } from '@/database/migrations/202607120002-create-users.migration';
import { CreateCompaniesMigration } from '@/database/migrations/202607120003-create-companies.migration';

export const migrations: WorklessMigrationConstructor[] = [
  CreateModuleRegistryMigration,
  CreateUsersMigration,
  CreateCompaniesMigration,
];
