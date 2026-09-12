import type { ComponentType, SVGProps } from 'react';
import { Button } from '@/app/views/components/buttons/button';
import { renderMainLayoutView } from '@/app/views/components/layouts/layout';

type SolarIconProps = {
  color?: string;
  size?: number | string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'height' | 'size' | 'width'>;

type SolarIconComponent = ComponentType<SolarIconProps>;

const {
  CameraBoldDuotone,
  LinkCircleBoldDuotone,
  UserRoundedBoldDuotone,
} = require('solar-icon-set') as Record<string, SolarIconComponent>;

const inputClass =
  'form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-hidden transition-colors placeholder:text-slate-400 focus:border-primary dark:border-navy-450 dark:text-navy-100 dark:placeholder:text-navy-300 dark:focus:border-primary';

const profileScript = `
  (() => {
    const storageKey = 'workless_profile';

    const initializeProfile = () => {
      const form = document.querySelector('[data-profile-form]');
      if (!(form instanceof HTMLFormElement) || form.dataset.initialized === 'true') return;
      form.dataset.initialized = 'true';

      const defaults = {
        name: 'Zairosoft',
        email: 'info@zairosoft.com',
        phone: '',
        jobTitle: 'Administrator',
        bio: '',
        website: 'https://www.zairosoft.com/',
        avatar: '',
      };
      let profile = { ...defaults };

      try {
        profile = { ...profile, ...JSON.parse(localStorage.getItem(storageKey) || '{}') };
      } catch {
        profile = { ...defaults };
      }

      const field = (name) => form.elements.namedItem(name);
      const message = document.querySelector('[data-profile-message]');
      const avatarImage = document.querySelector('[data-profile-avatar-image]');
      const avatarFallback = document.querySelector('[data-profile-avatar-fallback]');
      const avatarInput = document.querySelector('[data-profile-avatar-input]');
      let avatar = typeof profile.avatar === 'string' ? profile.avatar : '';

      const initials = (name) => {
        const parts = String(name || 'Workless').trim().split(/\\s+/).filter(Boolean);
        return parts.slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'WL';
      };

      const refreshSummary = () => {
        const name = field('name')?.value || defaults.name;
        const email = field('email')?.value || defaults.email;
        document.querySelectorAll('[data-profile-display-name]').forEach((element) => { element.textContent = name; });
        document.querySelectorAll('[data-profile-display-email]').forEach((element) => { element.textContent = email; });
        document.querySelectorAll('[data-profile-initials], [data-profile-sidebar-initials]').forEach((element) => { element.textContent = initials(name); });

        if (avatarImage instanceof HTMLImageElement && avatarFallback instanceof HTMLElement) {
          avatarImage.src = avatar;
          avatarImage.hidden = !avatar;
          avatarFallback.hidden = Boolean(avatar);
        }
      };

      ['name', 'email', 'phone', 'jobTitle', 'bio', 'website'].forEach((name) => {
        const element = field(name);
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.value = typeof profile[name] === 'string' ? profile[name] : '';
        }
      });

      const showMessage = (text, isError = false) => {
        if (!(message instanceof HTMLElement)) return;
        message.textContent = text;
        message.className = isError
          ? 'mb-5 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error'
          : 'mb-5 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success';
        message.hidden = false;
        window.setTimeout(() => { message.hidden = true; }, 3000);
      };

      field('name')?.addEventListener('input', refreshSummary);
      field('email')?.addEventListener('input', refreshSummary);

      avatarInput?.addEventListener('change', () => {
        const file = avatarInput.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          showMessage('Please choose an image file.', true);
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          showMessage('Profile image must be smaller than 2 MB.', true);
          avatarInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          avatar = typeof reader.result === 'string' ? reader.result : '';
          refreshSummary();
        });
        reader.readAsDataURL(file);
      });

      form.querySelector('[data-profile-remove-avatar]')?.addEventListener('click', () => {
        avatar = '';
        if (avatarInput instanceof HTMLInputElement) avatarInput.value = '';
        refreshSummary();
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        profile = {
          name: field('name').value.trim(),
          email: field('email').value.trim(),
          phone: field('phone').value.trim(),
          jobTitle: field('jobTitle').value.trim(),
          bio: field('bio').value.trim(),
          website: field('website').value.trim(),
          avatar,
        };

        try {
          localStorage.setItem(storageKey, JSON.stringify(profile));
          refreshSummary();
          showMessage('Profile saved successfully.');
        } catch {
          showMessage('Profile could not be saved in this browser.', true);
        }
      });

      form.querySelector('[data-profile-reset]')?.addEventListener('click', () => {
        profile = { ...defaults };
        avatar = '';
        ['name', 'email', 'phone', 'jobTitle', 'bio', 'website'].forEach((name) => {
          const element = field(name);
          if (element) element.value = profile[name];
        });
        if (avatarInput instanceof HTMLInputElement) avatarInput.value = '';
        try { localStorage.removeItem(storageKey); } catch {}
        refreshSummary();
        showMessage('Profile restored to defaults.');
      });

      refreshSummary();
    };

    document.addEventListener('DOMContentLoaded', initializeProfile);
    document.addEventListener('turbo:load', initializeProfile);
    initializeProfile();
  })();
`;

export function renderProfilePage(): string {
  return renderMainLayoutView({
    title: 'Profile',
    activePath: '/profile',
    content: (
      <form data-profile-form className="mx-auto w-full max-w-6xl">
        <div data-profile-message hidden role="status" />

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-navy-500 dark:bg-navy-700">
          <div className="h-28 bg-gradient-to-r from-primary/80 to-accent dark:from-primary/60 dark:to-accent/70 sm:h-36" />
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                <div className="-mt-12 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary text-2xl font-semibold text-white shadow-md dark:border-navy-700 sm:-mt-14 sm:size-28">
                  <img data-profile-avatar-image hidden alt="Profile" className="size-full object-cover" />
                  <span data-profile-avatar-fallback data-profile-initials>ZS</span>
                </div>
                <div className="min-w-0 pb-1">
                  <h2 data-profile-display-name className="truncate text-xl font-semibold text-slate-800 dark:text-navy-50">Zairosoft</h2>
                  <p data-profile-display-email className="mt-1 truncate text-sm text-slate-500 dark:text-navy-300">info@zairosoft.com</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus">
                  <CameraBoldDuotone className="size-5" color="currentColor" size={20} style={{ display: 'block' }} aria-hidden="true" />
                  Change photo
                  <input data-profile-avatar-input type="file" accept="image/*" className="sr-only" />
                </label>
                <button data-profile-remove-avatar type="button" className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600">Remove</button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-3 lg:gap-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-navy-500 dark:bg-navy-700 lg:col-span-2">
            <div className="flex gap-3 border-b border-slate-200 p-5 dark:border-navy-500 sm:p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15">
                <UserRoundedBoldDuotone className="size-6" color="var(--primary)" size={24} style={{ display: 'block' }} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-800 dark:text-navy-50">Personal information</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-navy-300">Update your contact details and public profile.</p>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <label className="block">
                <span className="font-medium text-slate-700 dark:text-navy-100">Full name</span>
                <input name="name" required maxLength={120} autoComplete="name" className={inputClass} />
              </label>
              <label className="block">
                <span className="font-medium text-slate-700 dark:text-navy-100">Email address</span>
                <input name="email" required type="email" maxLength={160} autoComplete="email" className={inputClass} />
              </label>
              <label className="block">
                <span className="font-medium text-slate-700 dark:text-navy-100">Phone number</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+66" className={inputClass} />
              </label>
              <label className="block">
                <span className="font-medium text-slate-700 dark:text-navy-100">Job title</span>
                <input name="jobTitle" maxLength={100} autoComplete="organization-title" className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-medium text-slate-700 dark:text-navy-100">Bio</span>
                <textarea name="bio" rows={4} maxLength={500} placeholder="Tell your team a little about yourself" className={`${inputClass} resize-y`} />
              </label>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-navy-500 dark:bg-navy-700">
              <div className="flex gap-3 border-b border-slate-200 p-5 dark:border-navy-500">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/15">
                  <LinkCircleBoldDuotone className="size-6" color="var(--primary)" size={24} style={{ display: 'block' }} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-800 dark:text-navy-50">Website</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-navy-300">Add a public profile link.</p>
                </div>
              </div>
              <div className="p-5">
                <label className="block">
                  <span className="font-medium text-slate-700 dark:text-navy-100">Website URL</span>
                  <input name="website" type="url" autoComplete="url" placeholder="https://example.com" className={inputClass} />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-500 dark:bg-navy-700">
              <h2 className="font-semibold text-slate-800 dark:text-navy-50">Account security</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-navy-300">Manage your password and account preferences.</p>
              <div className="mt-4 flex flex-col gap-2">
                <a href="/auth/forgot/password" className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600">Change password</a>
                <a href="/settings#security" className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10">Security settings</a>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button data-profile-reset variant="outline">Restore defaults</Button>
          <Button type="submit" variant="primary">Save profile</Button>
        </div>

        <script dangerouslySetInnerHTML={{ __html: profileScript }} />
      </form>
    ),
  });
}
