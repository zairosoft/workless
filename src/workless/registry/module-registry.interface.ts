export enum ModuleStatus {
  INSTALLED = 'installed',
  UNINSTALLED = 'uninstalled',
  DISABLED = 'disabled',
}

export interface ModuleRegistryRecord {
  id: string;
  name: string;
  version: string;
  availableVersion?: string | null;
  status: ModuleStatus;
  enabled: boolean;
  description?: string | null;
  dependencies?: string[];
  metadata?: Record<string, unknown> | null;
  installedAt?: Date | null;
  upgradedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleRegistryDefinition {
  name: string;
  version: string;
  description?: string | null;
  dependencies: string[];
}

export interface ModuleRegistryPort {
  synchronize(
    definitions: readonly ModuleRegistryDefinition[],
  ): Promise<ModuleRegistryRecord[]>;
  list(): Promise<ModuleRegistryRecord[]>;
  getOrFail(name: string): Promise<ModuleRegistryRecord>;
  isEnabled(name: string): Promise<boolean>;
  markInstalled(name: string, version: string): Promise<ModuleRegistryRecord>;
  markDisabled(name: string): Promise<ModuleRegistryRecord>;
  markUninstalled(name: string): Promise<ModuleRegistryRecord>;
}

export const MODULE_REGISTRY_PORT = Symbol('MODULE_REGISTRY_PORT');
