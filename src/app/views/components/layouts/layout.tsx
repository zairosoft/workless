import type { ComponentType, ReactNode, SVGProps } from 'react';
import { render } from '@/app/views/components/main';
import { Footer } from '@/app/views/components/layouts/common/footer';
import {
  sidebarMenuGroups,
  sidebarRailItems,
  type SidebarIcon,
} from '@/app/views/components/layouts/common/sidebar';

type SolarIconProps = {
  color?: string;
  size?: number | string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'height' | 'size' | 'width'>;

type SolarIconComponent = ComponentType<SolarIconProps>;

const {
  AltArrowLeftBoldDuotone,
  BellBoldDuotone,
  BoxMinimalisticBoldDuotone,
  ClipboardTextBoldDuotone,
  FullScreenBoldDuotone,
  HomeBoldDuotone,
  LayersBoldDuotone,
  LetterBoldDuotone,
  Login2BoldDuotone,
  MoonBoldDuotone,
  PaletteRoundBoldDuotone,
  QuitFullScreenBoldDuotone,
  SettingsBoldDuotone,
  SunBoldDuotone,
  WidgetBoldDuotone,
  Widget5BoldDuotone,
} = require('solar-icon-set') as Record<string, SolarIconComponent>;

type MainLayoutOptions = {
  title?: string;
  content?: ReactNode;
  includeSidebar?: boolean;
};

const sidebarIcons = {
  dashboard: HomeBoldDuotone,
  apps: Widget5BoldDuotone,
  pages: LayersBoldDuotone,
  forms: ClipboardTextBoldDuotone,
  components: PaletteRoundBoldDuotone,
  elements: BoxMinimalisticBoldDuotone,
} satisfies Record<SidebarIcon, typeof HomeBoldDuotone>;

function SidebarIconView({ active, icon }: { active: boolean; icon: SidebarIcon }) {
  const Icon = sidebarIcons[icon];

  return (
    <Icon
      className="size-7"
      color={active ? 'var(--primary)' : 'var(--default-500)'}
      size={28}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
}

function Sidebar() {
  return (
    <>
      <label
        htmlFor="lineone-sidebar-toggle"
        aria-label="Close sidebar"
        className="pointer-events-none fixed inset-0 z-20 bg-slate-900/50 opacity-0 transition-opacity peer-checked/sidebar:pointer-events-auto peer-checked/sidebar:opacity-100 md:hidden"
      />
      <aside className="workless-main-sidebar fixed inset-y-0 left-0 z-40 w-[var(--layout-sidebar-rail-width)]">
        <div className="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800">
          <a href="/" className="flex pt-4" aria-label="Workless home">
            <img className="size-11 object-contain transition-transform duration-500 ease-in-out hover:rotate-[360deg]" src="/assets/images/app-logo.svg" alt="Workless" />
          </a>

          <nav className="is-scrollbar-hidden flex grow flex-col gap-4 overflow-y-auto pt-6" aria-label="Main navigation">
            {sidebarRailItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={`flex size-11 items-center justify-center rounded-lg outline-hidden transition-colors duration-200 ${item.active
                  ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/15 dark:text-primary'
                  : 'hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary'}`}
              >
                <SidebarIconView active={item.active} icon={item.icon} />
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3 py-3">
            <a href="/apps" className="flex size-11 items-center justify-center rounded-lg text-[var(--default-500)] transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary" title="Settings" aria-label="Settings">
              <WidgetBoldDuotone className="size-7" color="var(--default-500)" size={28} style={{ display: 'block' }} aria-hidden="true" />
            </a>
            <a href="/settings" className="flex size-11 items-center justify-center rounded-lg text-[var(--default-500)] transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary" title="Settings" aria-label="Settings">
              <SettingsBoldDuotone className="size-7" color="var(--default-500)" size={28} style={{ display: 'block' }} aria-hidden="true" />
            </a>
            <a
              href="/profile"
              className="relative flex size-11 shrink-0 rounded-full outline-hidden transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open profile"
            >
              <span className="flex size-full items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/20 dark:bg-primary/15 dark:text-primary dark:ring-primary/30">
                ZS
              </span>
            </a>
          </div>
        </div>
      </aside>

      <aside className="workless-sidebar-panel fixed inset-y-0 left-0 z-30 w-[calc(var(--layout-sidebar-rail-width)+var(--layout-sidebar-panel-width))]">
        <div id="layouts" className="flex h-full w-full flex-col bg-white pl-[var(--layout-sidebar-rail-width)] dark:bg-navy-800">
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between pl-4 pr-1">
            <p className="text-xl font-medium tracking-wide text-slate-800 dark:text-navy-100">Dashboards</p>
            <label htmlFor="lineone-sidebar-toggle" className="flex size-7 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 xl:hidden" aria-label="Close navigation panel">
              <AltArrowLeftBoldDuotone className="size-6" color="var(--default-500)" size={24} style={{ display: 'block' }} aria-hidden="true" />
            </label>
          </div>

          <nav className="is-scrollbar-hidden grow overflow-y-auto px-4 pb-6 font-inter" aria-label="Dashboard navigation">
            {sidebarMenuGroups.map((group, index) => (
              <section key={group.label} className={index ? 'mt-3 border-t border-slate-200 pt-3 dark:border-navy-500' : ''}>
                <h2 className="sr-only">{group.label}</h2>
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const spacingClass = item.dividerBefore
                      ? 'mt-3 border-t border-slate-200 pt-3 dark:border-navy-500'
                      : '';

                    if (item.children) {
                      return (
                        <li key={item.label} className={spacingClass}>
                          <details className="group/menu" open={item.expanded}>
                            <summary className={`flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-1.5 text-sm tracking-wide outline-hidden transition-colors hover:text-slate-900 dark:hover:text-navy-50 [&::-webkit-details-marker]:hidden ${item.expanded
                              ? 'font-semibold text-slate-800 dark:text-navy-100'
                              : 'text-slate-600 dark:text-navy-200'}`}>
                              <span>{item.label}</span>
                              <svg className="size-4.5 text-slate-400 transition-transform duration-200 group-open/menu:rotate-90 dark:text-navy-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="m9 5 7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </summary>
                            <ul className="mt-0.5 flex flex-col gap-0.5">
                              {item.children.map((child) => (
                                <li key={child.label}>
                                  <a href={child.href} className="flex items-center gap-3 rounded-md py-1.5 pr-2 pl-4 text-sm tracking-wide text-slate-600 outline-hidden transition-colors hover:text-slate-900 dark:text-navy-200 dark:hover:text-navy-50">
                                    <span className="size-1.5 rounded-full border border-slate-400 dark:border-navy-300" aria-hidden="true" />
                                    {child.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </details>
                        </li>
                      );
                    }

                    return (
                      <li key={item.label} className={spacingClass}>
                        <a href={item.href} className={`flex items-center rounded-md px-2 py-1.5 text-sm tracking-wide outline-hidden transition-colors ${item.active
                          ? 'font-medium text-primary dark:text-primary'
                          : 'text-slate-600 hover:text-slate-900 dark:text-navy-200 dark:hover:text-navy-50'}`}>
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>

          <div className="flex h-[65px] shrink-0 items-center gap-3 border-t border-slate-150 bg-slate-50/70 px-4 dark:border-navy-700 dark:bg-navy-900/30">
            <div className="min-w-0 grow leading-tight">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-navy-50">Zairosoft</p>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-navy-300">info@zairosoft.com</p>
            </div>
            <a
              href="/auth/login"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--default-500)] outline-hidden transition-colors hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary"
              aria-label="Sign in"
            >
              <Login2BoldDuotone className="size-6" color="var(--default-500)" size={24} style={{ display: 'block' }} aria-hidden="true" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

const profileMenuItemClass =
  'flex items-center gap-3 py-1.5 pr-2 pl-4 text-sm tracking-wide text-slate-600 outline-hidden transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200';

function Header() {
  return (
    <header className="workless-header fixed right-0 top-0 z-20 h-[61px] border-b border-slate-150 bg-white/80 backdrop-blur-sm dark:border-navy-700 dark:bg-navy-800/80">
      <div className="workless-header-container flex h-full items-center justify-between px-[var(--layout-page-gutter)]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center">
            <label htmlFor="lineone-sidebar-toggle" className="workless-menu-toggle ml-0.5 flex size-7 cursor-pointer flex-col justify-center gap-1.5 text-primary outline-hidden" aria-label="Toggle sidebar">
              <span />
              <span />
              <span />
            </label>
          </div>

          <label className="relative hidden h-9 min-w-0 sm:block">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-slate-500 dark:text-navy-200">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
            </span>
            <input aria-label="Search" placeholder="Search..." className="h-full w-52 border-0 bg-transparent py-0 pr-3 pl-7 text-sm font-medium text-slate-700 outline-hidden placeholder:text-slate-500 focus:ring-0 dark:text-navy-100 dark:placeholder:text-navy-200 lg:w-72" />
          </label>
        </div>

        <div className="flex h-full shrink-0 items-center gap-1 self-center sm:gap-2">
          <button type="button" className="mr-1 hidden h-9 items-center gap-2 rounded-full px-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-150 dark:text-navy-100 dark:hover:bg-navy-600 sm:flex" aria-label="Change language">
            <span className="size-7 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-navy-500">
              <img src="/assets/images/flags/US.svg" alt="" className="size-full object-cover" />
            </span>
            <span>En</span>
          </button>

          <button
            type="button"
            data-fullscreen-toggle
            className="hidden size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 hover:text-slate-700 dark:text-navy-200 dark:hover:bg-navy-600 dark:hover:text-navy-50 sm:flex"
            aria-label="Enter full screen"
            aria-pressed="false"
            title="Enter full screen"
          >
            <span data-fullscreen-enter-icon>
              <FullScreenBoldDuotone className="size-5" color="var(--default-500)" size={20} style={{ display: 'block' }} aria-hidden="true" />
            </span>
            <span data-fullscreen-exit-icon className="hidden">
              <QuitFullScreenBoldDuotone className="size-5" color="var(--default-500)" size={20} style={{ display: 'block' }} aria-hidden="true" />
            </span>
          </button>

          <button type="button" data-theme-toggle className="flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 dark:text-navy-200 dark:hover:bg-navy-600" aria-label="Switch to dark mode" aria-pressed="false">
            <span className="dark:hidden">
              <SunBoldDuotone className="size-5.5" color="var(--default-500)" size={22} style={{ display: 'block' }} aria-hidden="true" />
            </span>
            <span className="hidden dark:block">
              <MoonBoldDuotone className="size-5.5" color="var(--default-500)" size={22} style={{ display: 'block' }} aria-hidden="true" />
            </span>
          </button>

          <button type="button" className="relative flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 dark:text-navy-200 dark:hover:bg-navy-600" aria-label="Work items">
            <LetterBoldDuotone className="size-5.5" color="var(--default-500)" size={22} style={{ display: 'block' }} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white ring-2 ring-white dark:ring-navy-800">1</span>
          </button>

          <button type="button" className="relative flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 dark:text-navy-200 dark:hover:bg-navy-600" aria-label="Notifications">
            <BellBoldDuotone className="size-5.5" color="var(--default-500)" size={22} style={{ display: 'block' }} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white ring-2 ring-white dark:ring-navy-800">5</span>
          </button>

          <details data-dropdown="profile" className="group/profile relative ml-1 flex h-full self-center items-center">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center overflow-hidden rounded-full bg-primary text-white ring-2 ring-primary/20 outline-hidden transition-transform hover:scale-105 focus-visible:ring-primary/50 dark:ring-primary/30 [&::-webkit-details-marker]:hidden" aria-label="Open profile menu">
              <svg className="mt-1 size-8" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="13" r="7" fill="currentColor" fillOpacity=".9" />
                <path d="M7 38c.8-10 5.1-15 13-15s12.2 5 13 15H7Z" fill="currentColor" fillOpacity=".9" />
                <path d="M13 11c1-5 4-8 8-8 4.8 0 7.6 3.8 7.8 9.4-2.6-1.2-4.7-3.2-6.2-6-1.7 2.8-4.9 4.4-9.6 4.6Z" fill="#1e293b" />
              </svg>
            </summary>

            <div data-dropdown-menu className="absolute top-full right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 text-slate-600 shadow-xl shadow-slate-200/60 dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100 dark:shadow-none">
              <div className="flex items-center gap-3 px-4 py-2">
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-white ring-2 ring-primary/20 dark:ring-primary/30">
                  <svg className="mt-1 size-10" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                    <circle cx="20" cy="13" r="7" fill="currentColor" fillOpacity=".9" />
                    <path d="M7 38c.8-10 5.1-15 13-15s12.2 5 13 15H7Z" fill="currentColor" fillOpacity=".9" />
                    <path d="M13 11c1-5 4-8 8-8 4.8 0 7.6 3.8 7.8 9.4-2.6-1.2-4.7-3.2-6.2-6-1.7 2.8-4.9 4.4-9.6 4.6Z" fill="#1e293b" />
                  </svg>
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-base font-semibold text-slate-800 dark:text-navy-50">Dashtail</p>
                  <p className="mt-1 truncate text-sm font-medium text-slate-500 dark:text-navy-200">@uxuidesigner</p>
                </div>
              </div>

              <nav className="mt-1" aria-label="Profile menu">
                <a href="/auth/login" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="12" cy="7.5" r="3.5" strokeWidth="1.6" />
                    <path d="M5 20a7 7 0 0 1 14 0c-3.7 1.6-10.3 1.6-14 0Z" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  <span>Profile</span>
                </a>
                <a href="#billing" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="m4 13 2.2-6.2L18 3l-1.5 13-6.3-1.8L7 20l-2-1 1.2-5.2L4 13Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Billing</span>
                </a>
                <a href="#settings" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="m3 4 18 7-8 2-2 8L3 4Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Settings</span>
                </a>
                <a href="#keyboard-shortcuts" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M4 5h7M7.5 3v4m-2 9 4-8 4 8m-7-3h6m4-8v16m-3-3 6-6m-6 1 6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Keyboard Shortcuts</span>
                </a>

                <div className="my-2 border-t border-slate-200 dark:border-navy-500" />

                <a href="#team" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="12" cy="8" r="3" strokeWidth="1.5" />
                    <circle cx="5.5" cy="10" r="2" strokeWidth="1.5" />
                    <circle cx="18.5" cy="10" r="2" strokeWidth="1.5" />
                    <path d="M7 20v-1a5 5 0 0 1 10 0v1M2.5 19v-.5A3.5 3.5 0 0 1 6 15m15.5 4v-.5A3.5 3.5 0 0 0 18 15" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>Team</span>
                </a>
                <a href="#invite-user" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="9" cy="7" r="3" strokeWidth="1.5" />
                    <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h1m7-4v6m-3-3h6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="grow">Invite User</span>
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m9 5 7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
                <a href="#github" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M8 5C5 6 4 9 4 12s1 6 4 7m8-14c3 1 4 4 4 7s-1 6-4 7M10 8l-2 4 2 4m4-8 2 4-2 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Github</span>
                </a>
                <a href="#support" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M6.5 3H4.8A1.8 1.8 0 0 0 3 4.8C3 13.75 10.25 21 19.2 21a1.8 1.8 0 0 0 1.8-1.8v-1.7l-4-1-1 2c-4.5-1.15-8.85-5.5-10-10l2-1-1-4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="grow">Support</span>
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m9 5 7 7-7 7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>

                <div className="my-2 border-t border-slate-200 dark:border-navy-500" />

                <a href="/auth/login" className={profileMenuItemClass}>
                  <svg className="size-5.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M12 3v9m-5.7-6.3a8 8 0 1 0 11.4 0" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  <span>Log Out</span>
                </a>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function renderMainLayoutView(options: MainLayoutOptions = {}): string {
  const title = options.title ?? 'Workless';
  const includeSidebar = options.includeSidebar !== false;

  return render({
    title,
    bodyClassName: 'min-h-100vh bg-slate-50 text-slate-500 antialiased dark:bg-navy-900 dark:text-navy-200',
    head: (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </>
    ),
    children: (
      <div className="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900">
        {includeSidebar && (
          <>
            <input id="lineone-sidebar-toggle" type="checkbox" className="peer/sidebar sr-only" />
            <Sidebar />
            <Header />
          </>
        )}
        <div className={includeSidebar
          ? 'workless-main-content mt-[60px] flex min-h-[calc(100vh-60px)] min-w-0 flex-1 flex-col'
          : 'flex min-h-100vh w-full min-w-0 flex-col'}>
          <main className="grid w-full min-w-0 flex-1 place-content-start pb-8">
            <div className={`${includeSidebar ? 'workless-main-container' : ''} w-full px-[var(--layout-page-gutter)]`}>
              <div className="flex items-center gap-4 py-5 lg:py-6">
                <h1 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">{title}</h1>
              </div>
              {options.content}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    ),
  });
}
