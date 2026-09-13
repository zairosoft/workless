import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import appConfig from '@modules/apps/app.config.json';
import { AppsModuleLifecycleService } from '@modules/apps/app/lifecycle/apps-module.lifecycle';

export const appsConfig = registerAs('apps', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(appsConfig)],
  providers: [AppsModuleLifecycleService],
  exports: [AppsModuleLifecycleService],
})
export class AppsModule {}
