import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import appConfig from '@modules/org/module.manifest.json';
import { OrgModuleLifecycleService } from '@modules/org/app/lifecycle/org-module.lifecycle';

export const orgConfig = registerAs('org', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(orgConfig)],
  providers: [OrgModuleLifecycleService],
  exports: [OrgModuleLifecycleService],
})
export class OrgModule {}
