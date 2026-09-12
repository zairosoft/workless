export type SidebarIcon =
  | 'dashboard'
  | 'apps'
  | 'pages'
  | 'forms'
  | 'components'
  | 'elements';

export type SidebarRailItem = {
  label: string;
  href: string;
  icon: SidebarIcon;
  active?: boolean;
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
  children?: Array<{
    label: string;
    href: string;
  }>;
};

/**
 * Workless application navigation.
 * The demo's .html links are mapped to routes that exist in Workless.
 */
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
