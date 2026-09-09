import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { COMPANY_CONTEXT, CompanyContextPort } from '@/app/interfaces/company-context.interface';
import {
  CacheQuery,
  CacheScope,
  ScopedCacheService,
} from '@/workless/infrastructure/cache/scoped-cache.service';

@Injectable()
export class CompanyCacheService {
  constructor(
    @Inject(COMPANY_CONTEXT) private readonly context: CompanyContextPort,
    private readonly scopedCache: ScopedCacheService,
  ) {}

  get<T>(table: string, query: CacheQuery, dependencies: string[] = []): Promise<T | null> {
    return this.scopedCache.get<T>(this.scope(), table, query, dependencies);
  }

  set<T>(
    table: string,
    query: CacheQuery,
    value: T,
    ttlSeconds = 300,
    dependencies: string[] = [],
  ): Promise<void> {
    return this.scopedCache.set(
      this.scope(),
      table,
      query,
      value,
      ttlSeconds,
      dependencies,
    );
  }

  remember<T>(
    table: string,
    query: CacheQuery,
    ttlSeconds: number,
    resolver: () => Promise<T>,
    dependencies: string[] = [],
  ): Promise<T> {
    return this.scopedCache.remember(
      this.scope(),
      table,
      query,
      ttlSeconds,
      resolver,
      dependencies,
    );
  }

  del(table: string, query: CacheQuery, dependencies: string[] = []): Promise<void> {
    return this.scopedCache.del(this.scope(), table, query, dependencies);
  }

  invalidateTable(table: string): Promise<void> {
    return this.scopedCache.invalidateResource(this.scope(), table);
  }

  invalidateTables(...tables: string[]): Promise<void> {
    return this.scopedCache.invalidateResources(this.scope(), ...tables);
  }

  private scope(): CacheScope {
    const companyId = this.context.requireCompanyId().trim().toLowerCase();
    if (!isUUID(companyId)) {
      throw new Error('A valid company id is required for company cache.');
    }
    return { type: 'company', id: companyId };
  }
}
