import { createHash } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import {
  MigrationScope,
  MigrationStatus,
  MigrationPort,
  WorklessMigration,
  WorklessMigrationConstructor,
} from '@/workless/interfaces/migration.interface';

type AppliedMigration = {
  id: string;
  scope: MigrationScope;
  moduleName: string | null;
  migrationName: string;
  timestamp: string | number;
  checksum: string;
  batch: number;
  executedAt: Date;
};

@Injectable()
export class MigrationService implements MigrationPort {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly dataSource: DataSource) {}

  async migratePlatform(migrations: WorklessMigrationConstructor[]): Promise<string[]> {
    return this.migrate('platform', null, migrations);
  }

  async migrateModule(
    moduleName: string,
    migrations: WorklessMigrationConstructor[],
  ): Promise<string[]> {
    return this.migrate('module', moduleName, migrations);
  }

  async status(
    scope: MigrationScope,
    moduleName: string | null,
    constructors: WorklessMigrationConstructor[],
  ): Promise<MigrationStatus[]> {
    const migrations = this.prepare(constructors);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await this.ensureHistoryTable(queryRunner);
      const applied = await this.getApplied(queryRunner, scope, moduleName);
      const byName = new Map(applied.map((entry) => [entry.migrationName, entry]));
      return migrations.map((migration) => ({
        name: migration.name,
        timestamp: migration.timestamp,
        applied: byName.has(migration.name),
        executedAt: byName.get(migration.name)?.executedAt,
      }));
    } finally {
      await queryRunner.release();
    }
  }

  async revertLast(
    scope: MigrationScope,
    moduleName: string | null,
    constructors: WorklessMigrationConstructor[],
  ): Promise<string | null> {
    const migrations = this.prepare(constructors);
    const byName = new Map(migrations.map((migration) => [migration.name, migration]));
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await this.ensureHistoryTable(queryRunner);
      await this.lock(queryRunner, scope, moduleName);
      const applied = await this.getApplied(queryRunner, scope, moduleName);
      const last = applied.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0];
      if (!last) return null;
      const migration = byName.get(last.migrationName);
      if (!migration?.down) {
        throw new Error(`Migration "${last.migrationName}" does not support rollback.`);
      }
      await this.withOptionalTransaction(queryRunner, migration, async () => {
        await migration.down!(queryRunner);
        await queryRunner.query('DELETE FROM "migrations" WHERE "id" = $1', [last.id]);
      });
      return last.migrationName;
    } finally {
      await this.unlock(queryRunner, scope, moduleName);
      await queryRunner.release();
    }
  }

  private async migrate(
    scope: MigrationScope,
    moduleName: string | null,
    constructors: WorklessMigrationConstructor[],
  ): Promise<string[]> {
    const migrations = this.prepare(constructors);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await this.ensureHistoryTable(queryRunner);
      await this.lock(queryRunner, scope, moduleName);
      const applied = await this.getApplied(queryRunner, scope, moduleName);
      const appliedByName = new Map(applied.map((entry) => [entry.migrationName, entry]));
      const batch = Math.max(0, ...applied.map((entry) => entry.batch)) + 1;
      const completed: string[] = [];

      for (const migration of migrations) {
        const checksum = this.checksum(migration);
        const existing = appliedByName.get(migration.name);
        if (existing) {
          if (existing.checksum !== checksum) {
            throw new Error(`Applied migration "${migration.name}" was modified (checksum mismatch).`);
          }
          continue;
        }

        const startedAt = Date.now();
        await this.withOptionalTransaction(queryRunner, migration, async () => {
          await migration.up(queryRunner);
          await queryRunner.query(
            `INSERT INTO "migrations"
              ("scope", "moduleName", "migrationName", "timestamp", "checksum", "batch", "executionMs")
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [scope, moduleName, migration.name, migration.timestamp, checksum, batch, Date.now() - startedAt],
          );
        });
        completed.push(migration.name);
        this.logger.log(`Applied ${scope} migration "${migration.name}"${moduleName ? ` for "${moduleName}"` : ''}`);
      }
      return completed;
    } finally {
      await this.unlock(queryRunner, scope, moduleName);
      await queryRunner.release();
    }
  }

  private prepare(constructors: WorklessMigrationConstructor[]): WorklessMigration[] {
    const migrations = constructors.map((Migration) => new Migration());
    const names = new Set<string>();
    for (const migration of migrations) {
      if (!migration.name || !migration.checksum || !Number.isSafeInteger(migration.timestamp)) {
        throw new Error('Every migration requires a name, checksum, and integer timestamp.');
      }
      if (names.has(migration.name)) throw new Error(`Duplicate migration name "${migration.name}".`);
      names.add(migration.name);
    }
    return migrations.sort((left, right) => left.timestamp - right.timestamp);
  }

  private checksum(migration: WorklessMigration): string {
    return createHash('sha256')
      .update(`${migration.name}:${migration.timestamp}:${migration.checksum}`)
      .digest('hex');
  }

  private async withOptionalTransaction(
    queryRunner: QueryRunner,
    migration: WorklessMigration,
    action: () => Promise<void>,
  ): Promise<void> {
    if (migration.transaction === false) return action();
    await queryRunner.startTransaction();
    try {
      await action();
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  private async ensureHistoryTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "scope" varchar(20) NOT NULL,
        "moduleName" varchar(80),
        "migrationName" varchar(180) NOT NULL,
        "timestamp" bigint NOT NULL,
        "checksum" varchar(64) NOT NULL,
        "batch" integer NOT NULL,
        "executionMs" integer NOT NULL DEFAULT 0,
        "executedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_migrations_scope_module_name"
      ON "migrations" ("scope", COALESCE("moduleName", ''), "migrationName")
    `);
  }

  private async getApplied(
    queryRunner: QueryRunner,
    scope: MigrationScope,
    moduleName: string | null,
  ): Promise<AppliedMigration[]> {
    return queryRunner.query(
      `SELECT * FROM "migrations"
       WHERE "scope" = $1 AND "moduleName" IS NOT DISTINCT FROM $2
       ORDER BY "timestamp" ASC`,
      [scope, moduleName],
    );
  }

  private lockKey(scope: MigrationScope, moduleName: string | null): string {
    return `workless:migrations:${scope}:${moduleName ?? 'platform'}`;
  }

  private async lock(queryRunner: QueryRunner, scope: MigrationScope, moduleName: string | null) {
    await queryRunner.query('SELECT pg_advisory_lock(hashtext($1))', [this.lockKey(scope, moduleName)]);
  }

  private async unlock(queryRunner: QueryRunner, scope: MigrationScope, moduleName: string | null) {
    if (!queryRunner.isReleased) {
      await queryRunner.query('SELECT pg_advisory_unlock(hashtext($1))', [this.lockKey(scope, moduleName)]);
    }
  }
}
