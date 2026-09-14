import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import appConfig from '@modules/dashboard/module.manifest.json';
import { DashboardController } from '@modules/dashboard/app/controllers/dashboard.controller';
import { DashboardModuleLifecycleService } from '@modules/dashboard/app/lifecycle/dashboard-module.lifecycle';

export const dashboardConfig = registerAs('dashboard', () => appConfig);

@Module({
  imports: [ConfigModule.forFeature(dashboardConfig)],
  controllers: [DashboardController],
  providers: [DashboardModuleLifecycleService],
  exports: [DashboardModuleLifecycleService],
})
export class DashboardModule {}
