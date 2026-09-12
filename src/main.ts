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

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for server-rendered HTML pages
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'language/:locale', method: RequestMethod.GET },
      { path: 'auth/login', method: RequestMethod.GET },
      { path: 'auth/register', method: RequestMethod.GET },
      { path: 'auth/forgot/password', method: RequestMethod.GET },
      { path: 'components', method: RequestMethod.GET },
      { path: 'profile', method: RequestMethod.GET },
      { path: 'settings', method: RequestMethod.GET },
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
