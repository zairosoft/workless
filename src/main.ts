import 'reflect-metadata';
import { join } from 'node:path';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from '@/app.module';
import { HttpErrorViewFilter } from '@/app/providers/http-error-view.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Caddy is the only proxy in the production Compose topology. Trust one hop
  // so request IPs and throttling use the original client address.
  if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
  }

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for server-rendered HTML pages
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    }),
  );

  const corsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (corsOrigins.includes('*')) {
    throw new Error('CORS_ORIGIN cannot contain "*" when credentialed CORS is enabled.');
  }

  // Same-origin server-rendered pages do not need CORS. Enable it only for an
  // explicit allow-list so cookies and authorization headers are never shared
  // with arbitrary origins.
  if (corsOrigins.length > 0) {
    app.enableCors({
      origin: corsOrigins,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Lang'],
      credentials: true,
    });
  }

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'language/:locale', method: RequestMethod.GET },
      { path: 'auth/login', method: RequestMethod.GET },
      { path: 'auth/register', method: RequestMethod.GET },
      { path: 'auth/forgot/password', method: RequestMethod.GET },
      { path: 'components', method: RequestMethod.GET },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpErrorViewFilter());

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
