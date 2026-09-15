# Layouts

Layouts provide the shared application shell around authenticated pages. The
main layout includes application navigation, header controls, page content, and
the standard footer.

```tsx
import { renderMainLayoutView } from '@/app/views/components/layouts/layout';
```

## Main Application Layout

Use `renderMainLayoutView` when rendering a page inside the authenticated
Workless application.

```tsx
export function renderUsersPage() {
  return renderMainLayoutView({
    title: 'Users',
    activePath: '/users',
    children: <section className="card p-5">User list</section>,
  });
}
```

`activePath` highlights the appropriate sidebar item. Keep page-specific markup
inside `children` and reuse the `card` utility for standard content surfaces.

## Footer

Use `Footer` when a page needs only the standard product footer.

```tsx
import { Footer } from '@/app/views/components/layouts/common/footer';

<Footer version="1.0.0" />
```

The footer derives the current year automatically. If no version is supplied,
it uses the package version when available.

## Document Helpers

`main.tsx` contains helpers for complete HTML documents and localized page
rendering.

```tsx
import { createView } from '@/app/views/components/main';

export const renderWelcomePage = createView(({ t }) => ({
  title: t('welcome.title'),
  children: <main className="p-6">{t('welcome.title')}</main>,
}));
```

Use `createView` for standalone server-rendered pages. Use the main layout for
pages that belong in the signed-in application shell.
