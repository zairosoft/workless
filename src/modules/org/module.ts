import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '@modules/org/module.manifest.json';
import { OrgAuthController } from '@modules/org/app/controllers/org-auth.controller';
import { OrgUserEntity } from '@modules/org/app/entities/user.entity';
import { OrgModuleLifecycleService } from '@modules/org/app/lifecycle/org-module.lifecycle';

export const orgConfig = registerAs('org', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(orgConfig), TypeOrmModule.forFeature([OrgUserEntity])],
  controllers: [OrgAuthController],
  providers: [OrgModuleLifecycleService],
  exports: [OrgModuleLifecycleService],
})
export class OrgModule {}
