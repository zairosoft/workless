import '@/app/views/components/main';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '@/workless/jwt/jwt-auth.guard';
import { resolveJwtSecret } from '@/config/jwt.config';
import { JwtStrategy } from '@/app/providers/jwt.strategy';
import { AuthController } from '@/app/controllers/auth.controller';
import { CompaniesController } from '@/app/controllers/companies.controller';
import { ComponentsController } from '@/app/controllers/components.controller';
import { HomeController } from '@/app/controllers/home.controller';
import { LanguageController } from '@/app/controllers/language.controller';
import { ModuleLifecycleController } from '@/app/controllers/module-lifecycle.controller';
import { UsersController } from '@/app/controllers/users.controller';
import { CompanyEntity } from '@/app/entities/company.entity';
import { PlatformUserEntity } from '@/app/entities/user.entity';
import { CompanyContextMiddleware } from '@/app/middleware/company-context.middleware';
import { CompaniesPolicy } from '@/app/providers/companies.policy';
import { CompanyContextGuard } from '@/app/providers/company-context.guard';
import { HtmlCacheInterceptor } from '@/app/providers/html-cache.interceptor';
import { NotificationsListener } from '@/app/providers/notifications.listener';
import { PermissionGuard } from '@/app/providers/permission.guard';
import { PermissionsService } from '@/app/providers/permissions.service';
import { UsersEventsListener } from '@/app/providers/users-events.listener';
import { UsersPolicy } from '@/app/providers/users.policy';
import {
  platformServiceExports,
  platformServiceProviders,
} from '@/app/interfaces/interfaces.service';
import { CompaniesService } from '@/app/services/companies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, PlatformUserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: resolveJwtSecret(configService),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h') as any,
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    CompaniesController,
    ComponentsController,
    HomeController,
    LanguageController,
    ModuleLifecycleController,
    UsersController,
  ],
  providers: [
    JwtStrategy,
    CompaniesPolicy,
    CompaniesService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CompanyContextGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HtmlCacheInterceptor,
    },
    NotificationsListener,
    PermissionGuard,
    UsersPolicy,
    UsersEventsListener,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    ...platformServiceProviders,
  ],
  exports: platformServiceExports,
})
export class PlatformModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CompanyContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
