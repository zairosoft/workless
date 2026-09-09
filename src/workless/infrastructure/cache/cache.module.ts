import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/workless/infrastructure/cache/cache.constants';
import { CACHE_PORT } from '@/workless/infrastructure/cache/cache.interface';
import { CacheService } from '@/workless/infrastructure/cache/cache.service';
import { createRedisClient } from '@/workless/infrastructure/cache/redis.provider';
import { ScopedCacheService } from '@/workless/infrastructure/cache/scoped-cache.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: createRedisClient,
    },
    CacheService,
    ScopedCacheService,
    {
      provide: CACHE_PORT,
      useExisting: CacheService,
    },
  ],
  exports: [CACHE_PORT, ScopedCacheService],
})
export class CacheModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis | null) {}

  async onModuleDestroy(): Promise<void> {
    if (!this.redisClient) {
      return;
    }

    if (this.redisClient.status === 'end') {
      return;
    }

    try {
      await this.redisClient.quit();
    } catch {
      this.redisClient.disconnect(false);
    }
  }
}
