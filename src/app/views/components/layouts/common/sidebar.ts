import { loadRuntimeModuleConfigs } from '@modules/modules';
import type { ModuleAppConfig } from '@/workless/module/module-app-config.interface';

export type SidebarIcon = string;

export type SidebarRailItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
  active?: boolean;
  moduleConfig?: ModuleAppConfig;
};

export type SidebarMenuGroup = {
  label: string;
  items: SidebarMenuItem[];
};

export type SidebarMenuItem = {
  label: string;
  href?: string;
  active?: boolean;
  dividerBefore?: boolean;
  expanded?: boolean;
  description?: string;
  icon?: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

/**
 * Workless application navigation.
 * The demo's .html links are mapped to routes that exist in Workless.
 */
const applicationModuleItems: SidebarRailItem[] = loadRuntimeModuleConfigs()
  .filter((config) => config.application && config.url)
  .map((config) => ({
    label: config.title || config.name,
    href: config.url!,
    icon: config.icon,
    moduleConfig: config,
  }));

export const sidebarRailItems: SidebarRailItem[] = [
  {
    label: 'Dashboard',
    href: '/api/v1/crm/dashboard/page',
    icon: 'dashboard',
    active: true,
  },
  { label: 'Applications', href: '/', icon: 'apps' },
  { label: 'Pages & Layouts', href: '#layouts', icon: 'pages' },
  { label: 'Forms', href: '/auth/register', icon: 'forms' },
  { label: 'Components', href: '/components', icon: 'components' },
  { label: 'Elements', href: '#elements', icon: 'elements' },
  ...applicationModuleItems,
];

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    label: 'Dashboards',
    items: [
      { label: 'Sales', href: '#sales' },
      { label: 'CRM Analytics', href: '/api/v1/crm/dashboard/page' },
      { label: 'Orders', href: '#orders' },
      {
        label: 'Cryptocurrency',
        dividerBefore: true,
        children: [
          { label: 'Exchange', href: '#crypto-exchange' },
          { label: 'Market', href: '#crypto-market' },
        ],
      },
      {
        label: 'Banking',
        expanded: true,
        children: [
          { label: 'Banking V1', href: '#banking-v1' },
          { label: 'Banking V2', href: '#banking-v2' },
        ],
      },
      { label: 'Personal', href: '#personal' },
      { label: 'CMS Analytics', href: '#cms-analytics', active: true },
      { label: 'Influencer', href: '#influencer' },
      { label: 'Travel', href: '#travel' },
      { label: 'Teacher', href: '#teacher' },
      { label: 'Education', href: '#education' },
      { label: 'Authors', href: '#authors' },
      { label: 'Doctor', href: '#doctor' },
      { label: 'Companies', href: '/api/v1/platform/companies/page' },
      { label: 'Employees', href: '#employees' },
      { label: 'Workspaces', href: '#workspaces' },
      { label: 'Meetings', href: '#meetings' },
      { label: 'Projects Board', href: '#projects-board' },
      { label: 'Widget UI', href: '#widget-ui', dividerBefore: true },
      { label: 'Widget Contact', href: '#widget-contact' },
    ],
  },
];

export function resolveModuleMenu(activePath?: string): {
  title: string;
  groups: SidebarMenuGroup[];
} | null {
  if (!activePath) return null;

  const activeModule = applicationModuleItems.find(
    (item) => activePath === item.href || activePath.startsWith(`${item.href}/`),
  )?.moduleConfig;

  if (!activeModule) return null;

  return {
    title: activeModule.title || activeModule.name,
    groups: [
      {
        label: activeModule.title || activeModule.name,
        items: activeModule.subMenu.map((item) => ({
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
