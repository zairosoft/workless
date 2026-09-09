import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { RequirePermissions } from '@/app/providers/require-permissions.decorator';
import { ModuleLifecycleService } from '@/workless/lifecycle/module.lifecycle';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
} from '@/workless/registry/module-registry.interface';

@Controller('modules')
export class ModuleLifecycleController {
  constructor(
    @Inject(MODULE_REGISTRY_PORT)
    private readonly moduleRegistry: ModuleRegistryPort,
    private readonly moduleLifecycle: ModuleLifecycleService,
  ) {}

  @Get()
  @RequirePermissions('system.module.read')
  list() {
    return this.moduleRegistry.list();
  }

  @Post(':name/install')
  @RequirePermissions('system.module.install')
  install(@Param('name') name: string) {
    return this.moduleLifecycle.install(name);
  }

  @Post(':name/uninstall')
  @RequirePermissions('system.module.uninstall')
  uninstall(@Param('name') name: string) {
    return this.moduleLifecycle.uninstall(name);
  }

  @Post(':name/upgrade')
  @RequirePermissions('system.module.upgrade')
  upgrade(@Param('name') name: string) {
    return this.moduleLifecycle.upgrade(name);
  }

  @Post(':name/seed')
  @RequirePermissions('system.module.seed')
  seed(@Param('name') name: string) {
    return this.moduleLifecycle.seed(name);
  }
}
