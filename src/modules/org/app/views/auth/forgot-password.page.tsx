export const renderForgotPasswordPage = createView<{}>(({ t, isLang }) => ({
  title: t('auth.forgotPassword.pageTitle'),
  bodyClassName: 'is-header-blur',
  bodyProps: { 'x-data': '', style: { overflowY: 'hidden' } },
  head: (
    <>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com/" />
      <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <script dangerouslySetInnerHTML={{ __html: 'localStorage.getItem("_x_darkMode_on") === "true" && document.documentElement.classList.add("dark");' }} />
      <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('load',function(){document.body.style.overflowY='';},{once:true});" }} />
    </>
  ),
  children: (
    <div id="root" className="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900">
      <main className="grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full p-4 sm:px-5" style={{ maxWidth: '30rem' }}>
          <form className="card mt-5 rounded-lg p-5 lg:p-7" action="#" method="post">
            <div className="flex justify-end" style={{ display: 'flex', position: 'absolute', right: '10px', top: '10px' }}>
              <details data-dropdown="language" style={{ position: 'relative' }}>
                <summary className="flex cursor-pointer items-center justify-center" style={{ display: 'flex', width: '42px', height: '42px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--color-action-primary-subtle)', listStyle: 'none' }} aria-label="Select language">
                  <span style={{ width: '24px', height: '24px', flex: '0 0 24px', overflow: 'hidden', borderRadius: '50%' }}>
                    <img src={isLang ? '/assets/images/flags/TH.svg' : '/assets/images/flags/US.svg'} alt="" width="20" height="20" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </span>
                </summary>
                <div data-dropdown-menu className="absolute right-0 top-full z-50 mt-2 min-w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 text-slate-600 shadow-xl shadow-slate-200/60 dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100 dark:shadow-none">
                  <a href="/language/th" className="language-option flex items-center gap-2 py-1.5 pr-2 pl-4 text-sm tracking-wide text-slate-600 outline-hidden transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-accent/15 dark:hover:text-accent-light"><span style={{ width: '20px', height: '20px', flex: '0 0 20px', overflow: 'hidden', borderRadius: '50%' }}><img src="/assets/images/flags/TH.svg" alt="" width="20" height="20" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span><span>ภาษาไทย</span></a>
                  <a href="/language/en" className="language-option flex items-center gap-2 py-1.5 pr-2 pl-4 text-sm tracking-wide text-slate-600 outline-hidden transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-accent/15 dark:hover:text-accent-light"><span style={{ width: '20px', height: '20px', flex: '0 0 20px', overflow: 'hidden', borderRadius: '50%' }}><img src="/assets/images/flags/US.svg" alt="" width="20" height="20" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></span><span>English</span></a>
                </div>
              </details>
            </div>

              <div className="text-center">
                <img src="/assets/images/logo.png" alt="Workless" className="mx-auto object-contain" width="100" />
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100" style={{ marginBottom: '1.5rem' }}>{t('auth.forgotPassword.heading')}</h2>
                  <p className="text-slate-400 dark:text-navy-300">{t('auth.forgotPassword.subheading')}</p>
                </div>
              </div>




            <label className="block">
              <span>{t('auth.forgotPassword.emailLabel')}</span>
              <span className="relative mt-1.5 flex">
                <input
                  id="forgot-password-email"
                  className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  required
                />
                <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                  <svg className="size-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2H5a2 2 0 00-2-2V7a2 2 0 002-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </span>
            </label>
            <button className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90" type="button" disabled title={t('auth.forgotPassword.comingSoon')}>
              {t('auth.forgotPassword.submit')}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400 dark:text-navy-300">{t('auth.forgotPassword.comingSoon')}</p>
            <div className="mt-4 text-center text-xs-plus">
              <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="/auth/login">
                {t('auth.forgotPassword.backToLogin')}
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  ),
}));
