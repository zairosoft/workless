/**
 * Generic JSON data cache. HTML documents are intentionally rejected.
 *
 * Use ScopedCacheService for owned records. Direct CachePort access is reserved
 * for shared system data whose namespace is managed by the caller. CacheService
 * adds the physical `workless:data:` prefix.
 */
export type CacheOperationOptions = {
  fallback?: boolean;
};

export interface CachePort {
  get<T>(key: string, options?: CacheOperationOptions): Promise<T | null>;
  set<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
    options?: CacheOperationOptions,
  ): Promise<void>;
  del(key: string, options?: CacheOperationOptions): Promise<void>;
  delByPrefix(prefix: string, options?: CacheOperationOptions): Promise<void>;
  remember<T>(
    key: string,
    ttlSeconds: number,
    resolver: () => Promise<T>,
    options?: CacheOperationOptions,
  ): Promise<T>;
  namespaceVersion(
    namespace: string,
    rotate?: boolean,
    options?: CacheOperationOptions,
  ): Promise<string>;
}

export const CACHE_PORT = Symbol('CACHE_PORT');
