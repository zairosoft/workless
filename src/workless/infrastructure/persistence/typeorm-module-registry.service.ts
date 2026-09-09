import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SystemModuleExplorer } from '@/workless/module/module.explorer';
import { ModuleRegistryEntity } from '@/workless/infrastructure/persistence/module-registry.entity';
import {
  ModuleRegistryPort,
  ModuleStatus,
} from '@/workless/registry/module-registry.interface';

@Injectable()
export class TypeOrmModuleRegistryService implements ModuleRegistryPort, OnApplicationBootstrap {
  private readonly logger = new Logger(TypeOrmModuleRegistryService.name);
  private readonly runtimeRegistry = new Map<string, ModuleRegistryEntity>();
  private isCodebaseSynced = false;

  constructor(
    @InjectRepository(ModuleRegistryEntity)
    private readonly moduleRegistryRepository: Repository<ModuleRegistryEntity>,
    private readonly moduleExplorer: SystemModuleExplorer,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.syncWithCodebase();
  }

  async syncWithCodebase(): Promise<ModuleRegistryEntity[]> {
    if (this.isCodebaseSynced) {
      return [...this.runtimeRegistry.values()];
    }

    const discoveredModules = this.moduleExplorer.getModules();
    const discoveredNames = new Set(discoveredModules.map((definition) => definition.metadata.name));
    const syncedRecords: ModuleRegistryEntity[] = [];

    for (const definition of discoveredModules) {
      const existing = await this.moduleRegistryRepository.findOne({
        where: { name: definition.metadata.name },
      });

      if (existing) {
        const nextDescription = definition.metadata.description ?? null;
        const nextDependencies = definition.metadata.dependencies ?? [];
        const needsUpdate =
          existing.availableVersion !== definition.metadata.version ||
          existing.description !== nextDescription ||
          JSON.stringify(existing.dependencies ?? []) !== JSON.stringify(nextDependencies);

        if (needsUpdate) {
          existing.availableVersion = definition.metadata.version;
          existing.description = nextDescription;
          existing.dependencies = nextDependencies;
          syncedRecords.push(this.remember(await this.moduleRegistryRepository.save(existing)));
        } else {
          syncedRecords.push(this.remember(existing));
        }

        continue;
      }

      const created = this.moduleRegistryRepository.create({
        name: definition.metadata.name,
        version: '0.0.0',
        availableVersion: definition.metadata.version,
        description: definition.metadata.description ?? null,
        dependencies: definition.metadata.dependencies,
        status: ModuleStatus.UNINSTALLED,
        enabled: false,
      });

      syncedRecords.push(this.remember(await this.moduleRegistryRepository.save(created)));
      this.logger.log(`Registered System module definition "${created.name}"`);
    }

    for (const cachedName of [...this.runtimeRegistry.keys()]) {
      if (!discoveredNames.has(cachedName)) {
        this.runtimeRegistry.delete(cachedName);
      }
    }

    this.isCodebaseSynced = true;
    return syncedRecords;
  }

  async list(): Promise<ModuleRegistryEntity[]> {
    await this.syncWithCodebase();
    if (this.runtimeRegistry.size > 0) {
      return [...this.runtimeRegistry.values()].sort((left, right) =>
        left.name.localeCompare(right.name),
      );
    }

    const discoveredNames = this.moduleExplorer
      .getModules()
      .map((definition) => definition.metadata.name);

    if (discoveredNames.length === 0) {
      return [];
    }

    const records = await this.moduleRegistryRepository.find({
      where: { name: In(discoveredNames) },
      order: { name: 'ASC' },
    });

    for (const record of records) {
      this.remember(record);
    }

    return records;
  }

  async getOrFail(name: string): Promise<ModuleRegistryEntity> {
    await this.syncWithCodebase();
    if (!this.moduleExplorer.getModule(name)) {
      throw new NotFoundException(`System module "${name}" is not discoverable in the current codebase.`);
    }

    const cached = this.runtimeRegistry.get(name);
    if (cached) {
      return cached;
    }

    const record = await this.moduleRegistryRepository.findOne({
      where: { name },
    });

    if (!record) {
      throw new NotFoundException(`System module "${name}" is not registered.`);
    }

    return this.remember(record);
  }

  async isEnabled(name: string): Promise<boolean> {
    const record = this.runtimeRegistry.get(name) ?? (await this.getOrFail(name));
    return record.enabled && record.status === ModuleStatus.INSTALLED;
  }

  async markInstalled(name: string, version: string): Promise<ModuleRegistryEntity> {
    const record = await this.getOrFail(name);
    record.version = version;
    record.availableVersion = version;
    record.status = ModuleStatus.INSTALLED;
    record.enabled = true;
    record.installedAt = record.installedAt ?? new Date();
    record.upgradedAt = new Date();
    return this.remember(await this.moduleRegistryRepository.save(record));
  }

  async markDisabled(name: string): Promise<ModuleRegistryEntity> {
    const record = await this.getOrFail(name);
    record.status = ModuleStatus.DISABLED;
    record.enabled = false;
    return this.remember(await this.moduleRegistryRepository.save(record));
  }

  async markUninstalled(name: string): Promise<ModuleRegistryEntity> {
    const record = await this.getOrFail(name);
    record.status = ModuleStatus.UNINSTALLED;
    record.enabled = false;
    return this.remember(await this.moduleRegistryRepository.save(record));
  }

  private remember(record: ModuleRegistryEntity): ModuleRegistryEntity {
    this.runtimeRegistry.set(record.name, record);
    return record;
  }
}
