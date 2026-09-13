import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import appConfig from '@modules/website/app.config.json';
import { WebsiteModuleLifecycleService } from '@modules/website/app/lifecycle/website-module.lifecycle';

export const websiteConfig = registerAs('website', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(websiteConfig)],
  providers: [WebsiteModuleLifecycleService],
  exports: [WebsiteModuleLifecycleService],
})
export class WebsiteModule {}
