import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleRegistryEntity } from '@/workless/infrastructure/persistence/module-registry.entity';
import { TypeOrmModuleRegistryService } from '@/workless/infrastructure/persistence/typeorm-module-registry.service';
import { MODULE_REGISTRY_PORT } from '@/workless/registry/module-registry.interface';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleRegistryEntity])],
  providers: [
    TypeOrmModuleRegistryService,
    {
      provide: MODULE_REGISTRY_PORT,
      useExisting: TypeOrmModuleRegistryService,
    },
  ],
  exports: [MODULE_REGISTRY_PORT],
})
export class ModuleRegistryPersistenceModule {}
