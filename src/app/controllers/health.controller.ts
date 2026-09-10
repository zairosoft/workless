import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import {
  CACHE_PORT,
  CachePort,
} from '@/workless/infrastructure/cache/cache.interface';
import { Public } from '@/workless/jwt/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    @Inject(CACHE_PORT) private readonly cache: CachePort,
  ) {}

  /**
   * Reports readiness only after required infrastructure can answer requests.
   * Docker uses this endpoint before allowing the reverse proxy to serve traffic.
   */
  @Public()
  @Get('ready')
  async ready(): Promise<{ status: 'ok' }> {
    try {
      await this.dataSource.query('SELECT 1');

      if (this.configService.get<string>('REDIS_ENABLED', 'false') === 'true') {
        // Disable the in-memory fallback: readiness must reflect Redis itself.
        await this.cache.get('__health__', { fallback: false });
      }

      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException('Service is not ready.');
    }
  }
}
