import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformModule } from '@app/app';
import appConfig from '@modules/org/module.manifest.json';
import { OrgAuthController } from '@modules/org/app/controllers/org-auth.controller';
import { OrgRegistrationController } from '@modules/org/app/controllers/org-registration.controller';
import { OrgUserEntity } from '@modules/org/app/entities/user.entity';
import { OrgModuleLifecycleService } from '@modules/org/app/lifecycle/org-module.lifecycle';

export const orgConfig = registerAs('org', () => appConfig);

@Module({
  imports: [
    ConfigModule.forFeature(orgConfig),
    TypeOrmModule.forFeature([OrgUserEntity]),
    PlatformModule,
  ],
  controllers: [OrgAuthController, OrgRegistrationController],
  providers: [OrgModuleLifecycleService],
  exports: [OrgModuleLifecycleService],
})
export class OrgModule {}
