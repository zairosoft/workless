import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Button } from '@/app/views/components/buttons/button';
import { renderMainLayoutView } from '@/app/views/components/layouts/layout';

type SolarIconProps = {
  color?: string;
  size?: number | string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'height' | 'size' | 'width'>;

type SolarIconComponent = ComponentType<SolarIconProps>;

const {
  BellBoldDuotone,
  GlobalBoldDuotone,
  PaletteRoundBoldDuotone,
  ShieldCheckBoldDuotone,
} = require('solar-icon-set') as Record<string, SolarIconComponent>;

const inputClass =
  'form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-hidden transition-colors focus:border-primary dark:border-navy-450 dark:text-navy-100 dark:focus:border-primary';

type SettingsSectionProps = {
  id: string;
  title: string;
  description: string;
  icon: SolarIconComponent;
  children: ReactNode;
};

function SettingsSection({ id, title, description, icon: Icon, children }: SettingsSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-navy-500 dark:bg-navy-700">
      <div className="flex gap-3 border-b border-slate-200 p-5 dark:border-navy-500 sm:p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/15">
          <Icon className="size-6" color="var(--primary)" size={24} style={{ display: 'block' }} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-navy-50">{title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">{description}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ToggleSetting({ name, title, description, defaultChecked = false }: { name: string; title: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 py-3 first:pt-0 last:pb-0">
      <span>
        <span className="block font-medium text-slate-700 dark:text-navy-100">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-navy-300">{description}</span>
      </span>
      <span className="relative inline-flex shrink-0">
        <input name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 dark:bg-navy-500" />
        <span className="pointer-events-none absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

const settingsScript = `
  (() => {
    const storageKey = 'workless_settings';

    const initializeSettings = () => {
      const form = document.querySelector('[data-settings-form]');
      if (!(form instanceof HTMLFormElement) || form.dataset.initialized === 'true') return;
      form.dataset.initialized = 'true';

      const message = document.querySelector('[data-settings-message]');
      let saved = {};

      try {
        saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      } catch {
        saved = {};
      }

      ['language', 'timezone', 'dateFormat'].forEach((name) => {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLSelectElement && typeof saved[name] === 'string') {
          field.value = saved[name];
        }
      });

      ['emailNotifications', 'browserNotifications', 'moduleUpdates'].forEach((name) => {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement && typeof saved[name] === 'boolean') {
          field.checked = saved[name];
        }
      });

      const showMessage = (text) => {
        if (!(message instanceof HTMLElement)) return;
        message.textContent = text;
        message.hidden = false;
        window.setTimeout(() => { message.hidden = true; }, 3000);
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = {
          language: form.elements.namedItem('language').value,
          timezone: form.elements.namedItem('timezone').value,
          dateFormat: form.elements.namedItem('dateFormat').value,
          emailNotifications: form.elements.namedItem('emailNotifications').checked,
          browserNotifications: form.elements.namedItem('browserNotifications').checked,
          moduleUpdates: form.elements.namedItem('moduleUpdates').checked,
        };

        try {
          localStorage.setItem(storageKey, JSON.stringify(value));
          showMessage('Settings saved successfully.');
        } catch {
          showMessage('Settings could not be saved in this browser.');
        }
      });

      form.querySelector('[data-settings-reset]')?.addEventListener('click', () => {
        form.reset();
        try { localStorage.removeItem(storageKey); } catch {}
        showMessage('Settings restored to defaults.');
      });
    };

    document.addEventListener('DOMContentLoaded', initializeSettings);
    document.addEventListener('turbo:load', initializeSettings);
    initializeSettings();
  })();
`;

export function renderSettingsPage(): string {
  return renderMainLayoutView({
    title: 'Settings',
    activePath: '/settings',
    content: (
      <form data-settings-form className="mx-auto w-full max-w-6xl">
        <div data-settings-message hidden className="mb-5 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status" />

        <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-6">
          <aside className="self-start rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-navy-500 dark:bg-navy-700 lg:sticky lg:top-20">
            <nav aria-label="Settings sections" className="space-y-1">
              {[
                ['General', '#general'],
                ['Appearance', '#appearance'],
                ['Notifications', '#notifications'],
                ['Security', '#security'],
              ].map(([label, href], index) => (
                <a key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${index === 0 ? 'bg-primary/10 text-primary dark:bg-primary/15' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-navy-200 dark:hover:bg-navy-600 dark:hover:text-navy-50'}`}>
                  <span className="size-1.5 rounded-full border border-current" />
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-5">
            <SettingsSection id="general" title="General" description="Set the language, timezone, and date format used in Workless." icon={GlobalBoldDuotone}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-medium text-slate-700 dark:text-navy-100">Language</span>
                  <select name="language" defaultValue="en" className={inputClass}>
                    <option value="en">English</option>
                    <option value="th">ไทย</option>
                  </select>
                </label>
                <label className="block">
                  <span className="font-medium text-slate-700 dark:text-navy-100">Timezone</span>
                  <select name="timezone" defaultValue="Asia/Bangkok" className={inputClass}>
                    <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-medium text-slate-700 dark:text-navy-100">Date format</span>
                  <select name="dateFormat" defaultValue="dd/MM/yyyy" className={inputClass}>
                    <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                    <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                  </select>
                </label>
              </div>
            </SettingsSection>

            <SettingsSection id="appearance" title="Appearance" description="Choose how the interface looks on this device." icon={PaletteRoundBoldDuotone}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-700 dark:text-navy-100">Color mode</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-navy-300">Switch between the light and dark theme.</p>
                </div>
                <button type="button" data-theme-toggle className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600" aria-label="Switch to dark mode" aria-pressed="false">
                  Toggle color mode
                </button>
              </div>
            </SettingsSection>

            <SettingsSection id="notifications" title="Notifications" description="Control which updates you want to receive." icon={BellBoldDuotone}>
              <div className="divide-y divide-slate-200 dark:divide-navy-500">
                <ToggleSetting name="emailNotifications" title="Email notifications" description="Receive important activity summaries by email." defaultChecked />
                <ToggleSetting name="browserNotifications" title="Browser notifications" description="Show real-time alerts while Workless is open." defaultChecked />
                <ToggleSetting name="moduleUpdates" title="Module updates" description="Notify me when installed modules have updates." defaultChecked />
              </div>
            </SettingsSection>

            <SettingsSection id="security" title="Security" description="Review password and active session controls." icon={ShieldCheckBoldDuotone}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-700 dark:text-navy-100">Password</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-navy-300">Use a strong, unique password for your account.</p>
                </div>
                <a href="/auth/forgot/password" className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600">Change password</a>
              </div>
            </SettingsSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button data-settings-reset variant="outline">Restore defaults</Button>
              <Button type="submit" variant="primary">Save settings</Button>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: settingsScript }} />
      </form>
    ),
  });
}
