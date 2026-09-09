import { createHash } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CacheBackendUnavailableError } from '@/workless/infrastructure/cache/cache.error';
import { CACHE_PORT, CachePort } from '@/workless/infrastructure/cache/cache.interface';

export type CacheQuery =
  | null
  | boolean
  | number
  | string
  | CacheQuery[]
  | { [key: string]: CacheQuery };

export type CacheScope = {
  type: string;
  id: string;
};

type CacheEnvelope<T> = {
  value: T;
};

function canonical(value: CacheQuery, ancestors = new Set<object>()): string {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (typeof value !== 'object' || !value) {
    throw new TypeError('Cache query must contain only JSON values.');
  }
  if (ancestors.has(value)) throw new TypeError('Cache query cannot be circular.');
  ancestors.add(value);

  try {
    if (Array.isArray(value)) {
      return `[${Array.from(value, (item) => canonical(item, ancestors)).join(',')}]`;
    }
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      throw new TypeError('Cache query objects must be plain objects.');
    }
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key], ancestors)}`)
      .join(',')}}`;
  } finally {
    ancestors.delete(value);
  }
}

@Injectable()
export class ScopedCacheService {
  private readonly logger = new Logger(ScopedCacheService.name);
  private readonly reportedFailures = new Set<string>();
  private readonly pendingResolvers = new Map<string, Promise<unknown>>();
  private readonly dirtyNamespaces = new Set<string>();

  constructor(@Inject(CACHE_PORT) private readonly cache: CachePort) {}

  async get<T>(
    scope: CacheScope,
    table: string,
    query: CacheQuery,
    dependencies: string[] = [],
  ): Promise<T | null> {
    const key = await this.availableKey(scope, table, query, dependencies);
    if (!key) return null;

    try {
      const cached = await this.cache.get<CacheEnvelope<T>>(key, { fallback: false });
      return cached === null ? null : cached.value;
    } catch (error) {
      if (!this.isBackendFailure(error)) throw error;
      this.reportFailure(error);
      return null;
    }
  }

  async set<T>(
    scope: CacheScope,
    table: string,
    query: CacheQuery,
    value: T,
    ttlSeconds = 300,
    dependencies: string[] = [],
  ): Promise<void> {
    const key = await this.availableKey(scope, table, query, dependencies);
    if (!key) return;

    try {
      await this.cache.set(key, { value }, ttlSeconds, { fallback: false });
    } catch (error) {
      if (!this.isBackendFailure(error)) throw error;
      this.reportFailure(error);
    }
  }

  async remember<T>(
    scope: CacheScope,
    table: string,
    query: CacheQuery,
    ttlSeconds: number,
    resolver: () => Promise<T>,
    dependencies: string[] = [],
  ): Promise<T> {
    const key = await this.availableKey(scope, table, query, dependencies);
    if (!key) return resolver();

    try {
      const cached = await this.cache.get<CacheEnvelope<T>>(key, { fallback: false });
      if (cached !== null) return cached.value;
    } catch (error) {
      if (!this.isBackendFailure(error)) throw error;
      this.reportFailure(error);
      return resolver();
    }

    const pending = this.pendingResolvers.get(key) as Promise<T> | undefined;
    if (pending) return pending;

    const resolution = (async () => {
      const value = await resolver();
      try {
        await this.cache.set(key, { value }, ttlSeconds, { fallback: false });
      } catch (error) {
        if (!this.isBackendFailure(error)) throw error;
        this.reportFailure(error);
      }
      return value;
    })();
    this.pendingResolvers.set(key, resolution);

    try {
      return await resolution;
    } finally {
      this.pendingResolvers.delete(key);
    }
  }

  async del(
    scope: CacheScope,
    table: string,
    query: CacheQuery,
    dependencies: string[] = [],
  ): Promise<void> {
    const key = await this.availableKey(scope, table, query, dependencies);
    if (!key) return;

    try {
      await this.cache.del(key, { fallback: false });
    } catch (error) {
      if (!this.isBackendFailure(error)) throw error;
      this.reportFailure(error);
    }
  }

  async invalidateTable(scope: CacheScope, table: string): Promise<void> {
    await this.invalidateTables(scope, table);
  }

  async invalidateTables(scope: CacheScope, ...tables: string[]): Promise<void> {
    const namespaces = [...new Set(tables)].map((table) => this.namespace(scope, table));
    if (namespaces.length === 0) throw new Error('At least one cache table is required.');

    await Promise.all(
      namespaces.map(async (namespace) => {
        try {
          await this.cache.namespaceVersion(namespace, true, { fallback: false });
          this.dirtyNamespaces.delete(namespace);
        } catch (error) {
          if (!this.isBackendFailure(error)) throw error;
          this.dirtyNamespaces.add(namespace);
          this.reportFailure(error);
        }
      }),
    );
  }

  private async availableKey(
    scope: CacheScope,
    table: string,
    query: CacheQuery,
    dependencies: string[],
  ): Promise<string | null> {
    try {
      return await this.key(scope, table, query, dependencies);
    } catch (error) {
      if (!this.isBackendFailure(error)) throw error;
      this.reportFailure(error);
      return null;
    }
  }

  private namespace(scope: CacheScope, table: string): string {
    const scopeType = this.identifier(scope.type, 'Cache scope type');
    const scopeId = scope.id.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9._-]{0,127}$/.test(scopeId)) {
      throw new Error('Cache scope id must be a lowercase-safe identifier (up to 128 characters).');
    }
    const tableName = this.identifier(table, 'Cache table');
    return `scope:${scopeType}:${scopeId}:table:${tableName}`;
  }

  private identifier(value: string, label: string): string {
    const normalized = value.trim().toLowerCase();
    if (!/^[a-z][a-z0-9_]{0,62}$/.test(normalized)) {
      throw new Error(`${label} must be a lowercase identifier (up to 63 characters).`);
    }
    return normalized;
  }

  private async key(
    scope: CacheScope,
    table: string,
    query: CacheQuery,
    dependencies: string[],
  ): Promise<string> {
    const namespace = this.namespace(scope, table);
    const digest = createHash('sha256').update(canonical(query)).digest('hex');
    const tables = [...new Set([table, ...dependencies])].map((name) =>
      this.identifier(name, 'Cache table'),
    );
    tables.sort();
    const namespaces = tables.map((name) => this.namespace(scope, name));
    for (const name of namespaces) {
      if (!this.dirtyNamespaces.has(name)) continue;
      await this.cache.namespaceVersion(name, true, { fallback: false });
      this.dirtyNamespaces.delete(name);
    }
    const versions = await Promise.all(
      namespaces.map((name) =>
        this.cache.namespaceVersion(name, false, { fallback: false }),
      ),
    );
    const generation = createHash('sha256')
      .update(JSON.stringify([tables, versions]))
      .digest('hex');
    return `${namespace}:v:${generation}:${digest}`;
  }

  private isBackendFailure(error: unknown): error is CacheBackendUnavailableError {
    return error instanceof CacheBackendUnavailableError;
  }

  private reportFailure(error: CacheBackendUnavailableError): void {
    if (this.reportedFailures.has(error.operation)) return;
    this.reportedFailures.add(error.operation);
    this.logger.warn(`${error.message}; bypassing scoped cache.`);
  }
}
