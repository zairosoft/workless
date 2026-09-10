export const render403Page = createView<{}>(({ t }) => ({
  title: t('errors.403.pageTitle'),
  head: (
    <>
      <meta name="turbo-visit-control" content="reload" />
      <meta name="turbo-cache-control" content="no-cache" />
    </>
  ),
  bodyClassName: 'min-h-100vh flex grow bg-slate-50 text-slate-500 antialiased dark:bg-navy-900 dark:text-navy-200',
  children: (
    <main className="grid min-h-100vh w-full grow grid-cols-1 place-items-center">
      <div className="w-full max-w-md p-6 text-center">
        <div className="w-full">
          <img className="w-full dark:hidden" src="/assets/images/error/light-403.webp" alt="" />
          <img className="hidden w-full dark:block" src="/assets/images/error/dark-403.webp" alt="" />
        </div>
        <p className="pt-4 text-7xl font-bold text-primary dark:text-accent">403</p>
        <h1 className="pt-4 text-xl font-semibold text-slate-800 dark:text-navy-50">{t('errors.403.heading')}</h1>
        <p className="pt-2 text-slate-500 dark:text-navy-200">{t('errors.403.description')}</p>
        <a className="btn mt-8 inline-flex h-11 items-center bg-primary text-base font-medium text-white transition-shadow hover:bg-primary-focus hover:shadow-lg hover:shadow-primary/50 focus:bg-primary-focus focus:shadow-lg focus:shadow-primary/50 active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:hover:shadow-accent/50 dark:focus:bg-accent-focus dark:focus:shadow-accent/50 dark:active:bg-accent/90" href="/">
          {t('errors.actions.backToHome')}
        </a>
      </div>
    </main>
  ),
}));
