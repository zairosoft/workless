import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import appConfig from '@modules/website/module.manifest.json';
import { WebsiteController } from '@modules/website/app/controllers/website.controller';
import { WebsiteModuleLifecycleService } from '@modules/website/app/lifecycle/website-module.lifecycle';

export const websiteConfig = registerAs('website', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(websiteConfig)],
  controllers: [WebsiteController],
  providers: [WebsiteModuleLifecycleService],
  exports: [WebsiteModuleLifecycleService],
})
export class WebsiteModule {}
