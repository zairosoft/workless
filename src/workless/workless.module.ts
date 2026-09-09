import { Global, Module } from '@nestjs/common';
import { APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { EVENT_BUS_PORT } from '@/workless/interfaces/event-bus.interface';
import { HOOK_PORT } from '@/workless/interfaces/hook.interface';
import { EventBusService } from '@/workless/events/event-bus.service';
import { HookService } from '@/workless/events/hook.service';
import { ModuleRegistryPersistenceModule } from '@/workless/infrastructure/persistence/module-registry-persistence.module';
import { ModuleLifecycleService } from '@/workless/lifecycle/module.lifecycle';
import { ModuleSeedingService } from '@/workless/lifecycle/module-seeding.service';
import { SystemModuleExplorer } from '@/workless/module/module.explorer';
import { ModuleEnabledGuard } from '@/workless/module/module-enabled.guard';

@Global()
@Module({
  imports: [DiscoveryModule, ModuleRegistryPersistenceModule],
  providers: [
    EventBusService,
    HookService,
    {
      provide: EVENT_BUS_PORT,
      useExisting: EventBusService,
    },
    {
      provide: HOOK_PORT,
      useExisting: HookService,
    },
    SystemModuleExplorer,
    ModuleLifecycleService,
    ModuleSeedingService,
    {
      provide: APP_GUARD,
      useClass: ModuleEnabledGuard,
    },
  ],
  exports: [
    EventBusService,
    HookService,
    EVENT_BUS_PORT,
    HOOK_PORT,
    SystemModuleExplorer,
    ModuleRegistryPersistenceModule,
    ModuleLifecycleService,
    ModuleSeedingService,
  ],
})
export class WorklessModule {}
