import type { ComponentType, SVGProps } from 'react';
import appConfig from '@modules/dashboard/module.manifest.json';
import { renderMainLayoutView } from '@/app/views/components/layouts/layout';

type DashboardIcon = ComponentType<
  SVGProps<SVGSVGElement> & { color?: string; size?: number | string }
>;

const solarIcons = require('solar-icon-set') as Record<string, DashboardIcon>;
const ArrowUpBoldDuotone = solarIcons.ArrowUpBoldDuotone;
const Chart2BoldDuotone = solarIcons.Chart2BoldDuotone;
const CheckCircleBoldDuotone = solarIcons.CheckCircleBoldDuotone;
const ClipboardListBoldDuotone = solarIcons.ClipboardListBoldDuotone;
const UsersGroupTwoRoundedBoldDuotone = solarIcons.UsersGroupTwoRoundedBoldDuotone;
const WalletMoneyBoldDuotone = solarIcons.WalletMoneyBoldDuotone;

const metrics: Array<{
  label: string;
  value: string;
  change: string;
  description: string;
  icon: DashboardIcon;
  iconClass: string;
}> = [
  {
    label: 'Total revenue',
    value: '$24,780',
    change: '+12.8%',
    description: 'Compared with last month',
    icon: WalletMoneyBoldDuotone,
    iconClass: 'bg-primary/10 text-primary dark:bg-primary/15',
  },
  {
    label: 'Active customers',
    value: '8,249',
    change: '+8.4%',
    description: 'Across all workspaces',
    icon: UsersGroupTwoRoundedBoldDuotone,
    iconClass: 'bg-info/10 text-info dark:bg-info/15',
  },
  {
    label: 'Completed tasks',
    value: '1,426',
    change: '+18.2%',
    description: 'This month so far',
    icon: CheckCircleBoldDuotone,
    iconClass: 'bg-success/10 text-success dark:bg-success/15',
  },
  {
    label: 'Conversion rate',
    value: '14.6%',
    change: '+2.6%',
    description: 'From qualified leads',
    icon: Chart2BoldDuotone,
    iconClass: 'bg-warning/10 text-warning dark:bg-warning/15',
  },
];

const activity = [
  { label: 'Mon', value: 62 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 54 },
  { label: 'Thu', value: 88 },
  { label: 'Fri', value: 72 },
  { label: 'Sat', value: 46 },
  { label: 'Sun', value: 65 },
];

const recentTasks = [
  { title: 'Review new customer requests', owner: 'Support team', status: 'In progress', tone: 'warning' },
  { title: 'Prepare monthly performance report', owner: 'Marketing', status: 'Completed', tone: 'success' },
  { title: 'Update workspace permissions', owner: 'Administration', status: 'Pending', tone: 'info' },
];

export function renderDashboardPage(): string {
  return renderMainLayoutView({
    title: appConfig.title ?? appConfig.name,
    activePath: '/dashboard',
    content: (
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Overview</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-800 dark:text-navy-50">Good morning, welcome back</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">Here is what is happening across your workspace today.</p>
          </div>
          <a href="/api/v1/crm/dashboard/page" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600">Open analytics</a>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article key={metric.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-navy-300">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-800 dark:text-navy-50">{metric.value}</p>
                  </div>
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${metric.iconClass}`}>
                    <Icon className="size-6" color="currentColor" size={24} style={{ display: 'block' }} aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-success"><ArrowUpBoldDuotone className="size-3.5" color="currentColor" size={14} aria-hidden="true" />{metric.change}</span>
                  <span className="text-slate-400 dark:text-navy-400">{metric.description}</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-800 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-navy-50">Workspace activity</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">Weekly completion overview</p>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">+16.4%</span>
            </div>
            <div className="mt-8 flex h-48 items-end justify-between gap-3 border-b border-slate-200 px-2 dark:border-navy-600">
              {activity.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="w-full max-w-10 rounded-t-md bg-primary/75 transition-colors hover:bg-primary" style={{ height: `${item.value}%` }} title={`${item.value}%`} />
                  <span className="pb-3 text-xs text-slate-400 dark:text-navy-400">{item.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-800 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-navy-50">Quick actions</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">Common workspace shortcuts</p>
              </div>
              <ClipboardListBoldDuotone className="size-6 text-primary" color="currentColor" size={24} aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <a href="/api/v1/platform/companies/page" className="rounded-lg border border-slate-200 p-4 transition hover:border-primary/40 hover:bg-primary/5 dark:border-navy-600 dark:hover:bg-primary/10"><p className="text-sm font-medium text-slate-700 dark:text-navy-100">Manage companies</p><p className="mt-1 text-xs text-slate-400 dark:text-navy-400">View workspaces and members</p></a>
              <a href="/components" className="rounded-lg border border-slate-200 p-4 transition hover:border-primary/40 hover:bg-primary/5 dark:border-navy-600 dark:hover:bg-primary/10"><p className="text-sm font-medium text-slate-700 dark:text-navy-100">Browse components</p><p className="mt-1 text-xs text-slate-400 dark:text-navy-400">Explore the Workless UI kit</p></a>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-800 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-navy-50">Recent tasks</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">Keep track of the latest work in your workspace</p>
            </div>
            <a href="/api/v1/crm/dashboard/page" className="text-sm font-medium text-primary hover:text-primary-700">View all</a>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-navy-600 dark:text-navy-400"><tr><th className="pb-3 font-medium">Task</th><th className="pb-3 font-medium">Team</th><th className="pb-3 text-right font-medium">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
                {recentTasks.map((task) => (
                  <tr key={task.title}><td className="py-4 font-medium text-slate-700 dark:text-navy-100">{task.title}</td><td className="py-4 text-slate-500 dark:text-navy-300">{task.owner}</td><td className="py-4 text-right"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${task.tone === 'success' ? 'bg-success/10 text-success' : task.tone === 'warning' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>{task.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    ),
  });
}
