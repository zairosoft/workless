import { loadRuntimeModuleConfigs } from '@modules/modules';
import type { ModuleAppConfig } from '@/workless/module/module-app-config.interface';

export type SidebarIcon = string;

export type SidebarRailItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
  moduleConfig?: ModuleAppConfig;
};

export type SidebarMenuGroup = {
  label: string;
  items: SidebarMenuItem[];
};

export type SidebarMenuItem = {
  label: string;
  href: string;
  active?: boolean;
  description?: string;
  icon?: string;
};

/**
 * Workless application navigation.
 * Application navigation is derived from enabled application modules in their manifests.
 */
const applicationModuleItems: SidebarRailItem[] = loadRuntimeModuleConfigs()
  .filter((config) => config.application && config.url)
  .map((config) => ({
    label: config.title || config.name,
    href: config.url!,
    icon: config.icon,
    moduleConfig: config,
  }));

export const sidebarRailItems: SidebarRailItem[] = applicationModuleItems;

export function resolveModuleMenu(activePath?: string): {
  title: string;
  groups: SidebarMenuGroup[];
} | null {
  if (!activePath) return null;

  const activeModule = applicationModuleItems.find(
    (item) => activePath === item.href || activePath.startsWith(`${item.href}/`),
  )?.moduleConfig;

  if (!activeModule) return null;

  const subMenu = activeModule.subMenu ?? [];
  if (subMenu.length === 0) return null;

  return {
    title: activeModule.title || activeModule.name,
    groups: [
      {
        label: activeModule.title || activeModule.name,
        items: subMenu.map((item) => ({
          label: item.name,
          href: item.url,
          active: activePath === item.url,
          description: item.description,
          icon: item.icon,
        })),
      },
    ],
  };
}
