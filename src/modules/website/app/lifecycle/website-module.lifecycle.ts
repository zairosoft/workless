import { Injectable } from '@nestjs/common';
import appConfig from '@modules/website/module.manifest.json';
import { SystemModule } from '@/workless/module/module.decorator';
import {
  ModuleLifecycleContext,
  SystemModuleLifecycle,
} from '@/workless/module/module.interface';

@SystemModule({
  name: 'website',
  version: appConfig.version,
  installable: appConfig.installable,
  description: appConfig.description,
})
@Injectable()
export class WebsiteModuleLifecycleService implements SystemModuleLifecycle {
  async install(_context: ModuleLifecycleContext): Promise<void> {}

  async uninstall(_context: ModuleLifecycleContext): Promise<void> {}

  async upgrade(
    _context: ModuleLifecycleContext,
    _fromVersion?: string,
  ): Promise<void> {}
}
