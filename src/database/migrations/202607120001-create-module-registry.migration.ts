import {
  MigrationExecutor,
  WorklessMigration,
} from '@/workless/interfaces/migration.interface';

export class CreateModuleRegistryMigration implements WorklessMigration {
  readonly name = 'create-module-registry';
  readonly timestamp = 202607120001;
  readonly checksum = 'create-module-registry-v2-snake-case-timestamps';

  async up(executor: MigrationExecutor): Promise<void> {
    await executor.query(`
      CREATE TABLE IF NOT EXISTS "module_registries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(80) NOT NULL,
        "version" varchar(32) NOT NULL DEFAULT '0.0.0',
        "availableVersion" varchar(32),
        "status" varchar(20) NOT NULL DEFAULT 'uninstalled',
        "enabled" boolean NOT NULL DEFAULT false,
        "description" varchar(255),
        "dependencies" text,
        "metadata" text,
        "installed_at" timestamptz,
        "upgraded_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await executor.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_module_registries_name"
      ON "module_registries" ("name")
    `);
    await executor.query(`
      ALTER TABLE "module_registries"
      ADD COLUMN IF NOT EXISTS "availableVersion" varchar(32)
    `);
  }

  async down(executor: MigrationExecutor): Promise<void> {
    await executor.query('DROP TABLE IF EXISTS "module_registries"');
  }
}
