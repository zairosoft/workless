import {
  ModuleRegistryRecord,
  ModuleStatus,
} from '@/workless/registry/module-registry.interface';

const enabledModules = new Set<string>();

export function updateRuntimeModuleState(record: ModuleRegistryRecord): void {
  if (record.enabled && record.status === ModuleStatus.INSTALLED) {
    enabledModules.add(record.name);
    return;
  }

  enabledModules.delete(record.name);
}

export function removeRuntimeModuleState(name: string): void {
  enabledModules.delete(name);
}

export function isRuntimeModuleEnabled(name: string): boolean {
  return enabledModules.has(name);
}
