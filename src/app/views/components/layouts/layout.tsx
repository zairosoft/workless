import type { ReactNode } from 'react';
import { render } from '@/app/views/components/main';
import { Footer } from '@/app/views/components/layouts/common/footer';
import {
  sidebarMenuGroups,
  sidebarRailItems,
  type SidebarIcon,
} from '@/app/views/components/layouts/common/sidebar';

type MainLayoutOptions = {
  title?: string;
  content?: ReactNode;
  includeSidebar?: boolean;
};

function SidebarIconView({ icon }: { icon: SidebarIcon }) {
  if (icon === 'dashboard') {
    return (
      <svg className="size-7" viewBox="0 0 24 24" fill="none">
        <path fill="currentColor" fillOpacity=".3" d="M5 14.06c0-1.01 0-1.52.22-1.95.22-.43.63-.72 1.46-1.31l4.16-2.97c.56-.4.84-.6 1.16-.6s.6.2 1.16.6l4.17 2.97c.82.59 1.23.88 1.45 1.31.22.43.22.94.22 1.95V19c0 .94 0 1.41-.29 1.71S17.94 21 17 21H7c-.94 0-1.41 0-1.71-.29S5 19.94 5 19v-4.94Z" />
        <path fill="currentColor" d="M3 12.39c0 .27 0 .4.08.44.09.04.19-.04.4-.2l7.29-5.68c.59-.46.89-.68 1.23-.68s.64.22 1.23.68l7.29 5.68c.21.16.31.24.4.2.08-.04.08-.17.08-.44v-.41c0-.48 0-.72-.1-.93-.1-.21-.29-.36-.67-.65l-7-5.45c-.59-.46-.89-.68-1.23-.68s-.64.22-1.23.68l-7 5.45c-.38.29-.57.44-.67.65-.1.21-.1.45-.1.93v.41Z" />
      </svg>
    );
  }

  if (icon === 'apps') {
    return (
      <svg className="size-7" viewBox="0 0 24 24" fill="none">
        <path fill="currentColor" fillOpacity=".3" d="M5 8h14v8c0 1.89 0 2.83-.59 3.41C17.83 20 16.89 20 15 20H9c-1.89 0-2.83 0-3.41-.59C5 18.83 5 17.89 5 16V8Z" />
        <rect x="4" y="8" width="16" height="3" rx="1" fill="currentColor" />
        <path d="M12 8 11.76 5.85A2.66 2.66 0 0 0 9.12 3.5 2.62 2.62 0 0 0 7.66 8.27L9.5 9.5M12 8l.24-2.15a2.66 2.66 0 0 1 2.64-2.35 2.62 2.62 0 0 1 1.46 4.77L14.5 9.5M12 11v4" stroke="currentColor" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === 'pages') {
    return (
      <svg className="size-7" viewBox="0 0 24 24" fill="none">
        <path fill="currentColor" d="M9.86 3H4.14A1.14 1.14 0 0 0 3 4.14v5.72A1.14 1.14 0 0 0 4.14 11h5.72A1.14 1.14 0 0 0 11 9.86V4.14A1.14 1.14 0 0 0 9.86 3Z" />
        <path fill="currentColor" fillOpacity=".3" d="M9.86 12.9H4.14A1.14 1.14 0 0 0 3 14.04v5.72a1.14 1.14 0 0 0 1.14 1.14h5.72A1.14 1.14 0 0 0 11 19.76v-5.72a1.14 1.14 0 0 0-1.14-1.14ZM19.76 3h-5.72a1.14 1.14 0 0 0-1.14 1.14v5.72A1.14 1.14 0 0 0 14.04 11h5.72a1.14 1.14 0 0 0 1.14-1.14V4.14A1.14 1.14 0 0 0 19.76 3Zm0 9.9h-5.72a1.14 1.14 0 0 0-1.14 1.14v5.72a1.14 1.14 0 0 0 1.14 1.14h5.72a1.14 1.14 0 0 0 1.14-1.14v-5.72a1.14 1.14 0 0 0-1.14-1.14Z" />
      </svg>
    );
  }

  if (icon === 'forms') {
    return (
      <svg className="size-7" viewBox="0 0 24 24" fill="none">
        <path fill="currentColor" d="M4 4h16v4H4zM4 10h7v10H4z" />
        <path fill="currentColor" fillOpacity=".3" d="M13 10h7v4h-7zM13 16h7v4h-7z" />
      </svg>
    );
  }

  if (icon === 'components') {
    return (
      <svg className="size-7" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="5.25" fill="currentColor" />
        <circle cx="9" cy="16" r="5.25" fill="currentColor" fillOpacity=".5" />
        <circle cx="16" cy="16" r="5.25" fill="currentColor" fillOpacity=".3" />
      </svg>
    );
  }

  return (
    <svg className="size-7" viewBox="0 0 24 24" fill="none">
      <path fill="currentColor" d="M12 3 3 8v8l9 5 9-5V8l-9-5Zm0 2.3L17.7 8 12 10.7 6.3 8 12 5.3Z" />
      <path fill="currentColor" fillOpacity=".3" d="m5 9.6 6 2.9v5.7l-6-3.3V9.6Zm14 0v5.3l-6 3.3v-5.7l6-2.9Z" />
    </svg>
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
                  : 'text-slate-500 hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary'}`}
              >
                <SidebarIconView icon={item.icon} />
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3 py-3">
            <a href="/auth/login" className="flex size-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary" title="Settings" aria-label="Settings">
              <svg className="size-7" viewBox="0 0 24 24" fill="none">
                <path fill="currentColor" fillOpacity=".3" d="M2 12.95v-1.77c0-1.05.85-1.92 1.9-1.92 1.81 0 2.55-1.29 1.64-2.87a1.92 1.92 0 0 1 .7-2.6l1.73-1c.79-.47 1.81-.19 2.28.61l.11.19c.9 1.58 2.38 1.58 3.29 0l.11-.19c.47-.8 1.49-1.08 2.28-.61l1.73 1a1.92 1.92 0 0 1 .7 2.6c-.91 1.58-.17 2.87 1.64 2.87 1.04 0 1.9.86 1.9 1.92v1.77c0 1.05-.85 1.91-1.9 1.91-1.81 0-2.55 1.29-1.64 2.87.52.92.21 2.08-.7 2.61l-1.73 1c-.79.47-1.81.19-2.28-.61l-.11-.19c-.9-1.58-2.38-1.58-3.29 0l-.11.19c-.47.8-1.49 1.08-2.28.61l-1.73-1a1.92 1.92 0 0 1-.7-2.61c.91-1.58.17-2.87-1.64-2.87A1.91 1.91 0 0 1 2 12.95Z" />
                <circle cx="12" cy="12.06" r="3.27" fill="currentColor" />
              </svg>
            </a>
            <a
              href="/auth/login"
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
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
              </svg>
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
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 outline-hidden transition-colors hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary dark:text-navy-200 dark:hover:bg-primary/15 dark:hover:text-primary"
              aria-label="Sign in"
            >
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3M10 12h11m0 0-3-3m3 3-3 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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

          <button type="button" className="hidden size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 hover:text-slate-700 dark:text-navy-200 dark:hover:bg-navy-600 dark:hover:text-navy-50 sm:flex" aria-label="Enter full screen">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3m13 5h3a2 2 0 0 0 2-2v-3" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <button type="button" className="flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 dark:text-navy-200 dark:hover:bg-navy-600" aria-label="Toggle theme">
            <svg className="size-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4m0-13.4-1.4 1.4M6.7 17.3l-1.4 1.4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <button type="button" className="relative flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 dark:text-navy-200 dark:hover:bg-navy-600" aria-label="Work items">
            <svg className="size-5.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillOpacity=".35" d="M4 8h16v10.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5V8Z" />
              <path d="M8.5 7V5.75A2.75 2.75 0 0 1 11.25 3h1.5a2.75 2.75 0 0 1 2.75 2.75V7H19a2 2 0 0 1 2 2v3.4a20.7 20.7 0 0 1-18 0V9a2 2 0 0 1 2-2h3.5Zm2 0h3V5.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V7Z" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white ring-2 ring-white dark:ring-navy-800">1</span>
          </button>

          <button type="button" className="relative flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-150 dark:text-navy-200 dark:hover:bg-navy-600" aria-label="Notifications">
            <svg className="size-5.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0v3.35c0 1.4-.49 2.75-1.38 3.83A1.1 1.1 0 0 0 5.47 18h13.06a1.1 1.1 0 0 0 .85-1.82A5.98 5.98 0 0 1 18 12.35V9Zm-8.25 11a2.25 2.25 0 0 0 4.5 0h-4.5Z" />
            </svg>
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
