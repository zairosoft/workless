export type MigrationScope = 'platform' | 'module';

export interface MigrationExecutor {
  query<T = unknown>(statement: string, parameters?: unknown[]): Promise<T>;
}

export interface WorklessMigration {
  readonly name: string;
  readonly timestamp: number;
  readonly checksum: string;
  readonly transaction?: boolean;
  up(executor: MigrationExecutor): Promise<void>;
  down?(executor: MigrationExecutor): Promise<void>;
}

export type WorklessMigrationConstructor = new () => WorklessMigration;

export type MigrationStatus = {
  name: string;
  timestamp: number;
  applied: boolean;
  executedAt?: Date;
};

export interface MigrationPort {
  migrateModule(
    moduleName: string,
    migrations: WorklessMigrationConstructor[],
  ): Promise<string[]>;
  status(
    scope: MigrationScope,
    moduleName: string | null,
    migrations: WorklessMigrationConstructor[],
  ): Promise<MigrationStatus[]>;
  revertLast(
    scope: MigrationScope,
    moduleName: string | null,
    migrations: WorklessMigrationConstructor[],
  ): Promise<string | null>;
}

export const MIGRATION_PORT = Symbol('MIGRATION_PORT');
