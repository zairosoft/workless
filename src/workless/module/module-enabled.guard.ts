import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_ENABLED_METADATA } from '@/workless/module/module-enabled.decorator';
import {
  MODULE_REGISTRY_PORT,
  ModuleRegistryPort,
} from '@/workless/registry/module-registry.interface';

@Injectable()
export class ModuleEnabledGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MODULE_REGISTRY_PORT)
    private readonly moduleRegistry: ModuleRegistryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const moduleName = this.reflector.getAllAndOverride<string | undefined>(
      MODULE_ENABLED_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!moduleName) {
      return true;
    }

    const enabled = await this.moduleRegistry.isEnabled(moduleName);
    if (!enabled) {
      throw new ServiceUnavailableException(
        `Module "${moduleName}" is installed but disabled or not installed yet.`,
      );
    }

    return true;
  }
}
