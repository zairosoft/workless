import appConfig from '@modules/website/module.manifest.json';
import type { ModuleSubMenuConfig } from '@/workless/module/module-app-config.interface';
import { renderMainLayoutView } from '@/app/views/components/layouts/layout';

export function renderWebsitePage(activeItem: ModuleSubMenuConfig): string {
  return renderMainLayoutView({
    title: activeItem.name,
    activePath: activeItem.url,
    content: (
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-700 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{appConfig.title}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-800 dark:text-navy-50">{activeItem.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-navy-300">{activeItem.description}</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
              Module ready
            </span>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appConfig.subMenu.map((item) => {
            const isActive = item.url === activeItem.url;

            return (
              <a
                key={item.url}
                href={item.url}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-xl border p-5 shadow-sm transition-colors ${isActive
                  ? 'border-primary bg-primary/10 dark:bg-primary/15'
                  : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50 dark:border-navy-500 dark:bg-navy-700 dark:hover:border-primary/40 dark:hover:bg-navy-600'}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-primary' : 'text-slate-400 dark:text-navy-300'}`}>{item.title}</p>
                <h3 className="mt-2 font-semibold text-slate-800 dark:text-navy-50">{item.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-navy-300">{item.description}</p>
              </a>
            );
          })}
        </section>
      </div>
    ),
  });
}
