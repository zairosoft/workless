type LoginPageOptions = {
  error?: string;
  email?: string;
};

export const renderLoginPage = createView<LoginPageOptions>(
  ({ t, isLang }, options) => {
    const registerUrl = url("/auth/register");
    const initialState = JSON.stringify({
      email: options.email ?? "",
      error: options.error ?? "",
      messages: {
        missingEmail: t("auth.login.validation.missingEmail"),
        loginFailed: t("auth.login.errors.loginFailed"),
        networkError: t("auth.login.errors.network"),
        signIn: t("common.actions.signIn"),
        signingIn: t("common.actions.signingIn"),
      },
    });

    return {
      title: t("auth.login.pageTitle"),
      bodyClassName: "is-header-blur",
      bodyProps: { "x-data": "", style: { overflowY: "hidden" } },
      head: (
        <>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                [x-cloak]{display:none!important;}
              `,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com/" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com/"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <script
            defer
            src="https://cdn.jsdelivr.net/npm/alpinejs/dist/cdn.min.js"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              localStorage.getItem("_x_darkMode_on") === "true" &&
                document.documentElement.classList.add("dark");

              window.loginPage = function(initialState) {
                var messages = initialState.messages || {};

                return {
                  email: initialState.email || '',
                  password: '',
                  rememberMe: false,
                  loading: false,
                  error: initialState.error || '',
                  messages: messages,
                  showError(message) {
                    this.error = message;
                  },
                  async submit() {
                    this.error = '';

                    if (!this.email) {
                      this.showError(messages.missingEmail || '');
                      return;
                    }

                    this.loading = true;

                    try {
                      var res = await fetch('/api/v1/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: this.email, password: this.password })
                      });
                      var data = await res.json();

                      if (!res.ok) {
                        this.showError(data.message || messages.loginFailed || '');
                        return;
                      }

                      sessionStorage.setItem('workless_token', data.accessToken);
                      window.location.href = '/';
                    } catch (e) {
                      this.showError(messages.networkError || '');
                    } finally {
                      this.loading = false;
                    }
                  }
                };
              };
            `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                "window.addEventListener('load',function(){document.body.style.overflowY='';},{once:true});",
            }}
          />
        </>
      ),
      children: (
        <div
          id="root"
          className="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900"
          {...{ "x-cloak": "" }}
        >
          <main className="grid w-full grow grid-cols-1 place-items-center">
            <div className="w-full p-4 sm:px-5" style={{ maxWidth: "30rem" }}>
              
              <div
                className="card rounded-lg p-5 lg:p-7"
                {...{ "x-data": `loginPage(${initialState})` }}
              >


                <div
                  className="mb-4 flex justify-end"
                  style={{ display: "flex", position: "absolute", right: "10px", top: "10px" }}
                >
                  <details data-dropdown="language" style={{ position: "relative" }}>
                    <summary
                      className="flex cursor-pointer items-center justify-center"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-action-primary-subtle)",
                        listStyle: "none",
                      }}
                      aria-label="Select language"
                    >
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          flex: "0 0 24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={isLang ? "/assets/images/flags/TH.svg" : "/assets/images/flags/US.svg"}
                          alt=""
                          width="20"
                          height="20"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </span>
                    </summary>
                    <div
                      data-dropdown-menu
                      className="absolute right-0 top-full z-50 mt-2 min-w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 text-slate-600 shadow-xl shadow-slate-200/60 dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100 dark:shadow-none"
                    >
                      <a href="/language/th" className="language-option flex items-center gap-2 py-1.5 pr-2 pl-4 text-sm tracking-wide text-slate-600 outline-hidden transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-accent/15 dark:hover:text-accent-light">
                        <span style={{ width: "20px", height: "20px", flex: "0 0 20px", overflow: "hidden", borderRadius: "50%" }}>
                          <img src="/assets/images/flags/TH.svg" alt="" width="20" height="20" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </span>
                        <span>ภาษาไทย</span>
                      </a>
                      <a href="/language/en" className="language-option flex items-center gap-2 py-1.5 pr-2 pl-4 text-sm tracking-wide text-slate-600 outline-hidden transition-colors hover:bg-primary/10 hover:text-primary dark:text-navy-200 dark:hover:bg-accent/15 dark:hover:text-accent-light">
                        <span style={{ width: "20px", height: "20px", flex: "0 0 20px", overflow: "hidden", borderRadius: "50%" }}>
                          <img src="/assets/images/flags/US.svg" alt="" width="20" height="20" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </span>
                        <span>English</span>
                      </a>
                    </div>
                  </details>
                </div>


              <div className="text-center">
                <img
                  src="/assets/images/logo.png"
                  alt="Workless"
                  className="mx-auto object-contain"
                  width="100"
                />
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100" style={{ marginBottom: "1.5rem" }}>
                    ล็อกอินเข้าสู่ระบบ
                  </h2>
                </div>
              </div>














                
                <label className="block">
                  <span>{t("auth.login.usernameLabel")}</span>
                  <span className="relative mt-1.5 flex">
                    <input
                      id="login-email"
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder={t("auth.login.usernamePlaceholder")}
                      type="text"
                      autoComplete="username"
                      {...{
                        "x-model": "email",
                        "x-on:keydown.enter.prevent": "submit()",
                      }}
                    />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                  </span>
                </label>
                <label className="mt-4 block">
                  <span>{t("auth.login.passwordLabel")}</span>
                  <span className="relative mt-1.5 flex">
                    <input
                      id="login-password"
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder={t("auth.login.passwordPlaceholder")}
                      type="password"
                      autoComplete="current-password"
                      {...{
                        "x-model": "password",
                        "x-on:keydown.enter.prevent": "submit()",
                      }}
                    />
                    <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 transition-colors duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                  </span>
                </label>
                <div className="mt-4 flex items-center justify-between space-x-2">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      className="form-checkbox is-basic size-5 rounded-sm border-slate-400/70 checked:border-primary checked:bg-primary hover:border-primary focus:border-primary dark:border-navy-400 dark:checked:border-accent dark:checked:bg-accent dark:hover:border-accent dark:focus:border-accent"
                      type="checkbox"
                      id="remember-me"
                      {...{ "x-model": "rememberMe" }}
                    />
                    <span className="line-clamp-1">
                      {t("auth.login.rememberMe")}
                    </span>
                  </label>
                  <a
                    href="/auth/forgot/password"
                    className="text-sm text-slate-400 transition-colors line-clamp-1 hover:text-slate-800 focus:text-slate-800 dark:text-navy-300 dark:hover:text-navy-100 dark:focus:text-navy-100"
                  >
                    {t("auth.login.forgotPassword")}
                  </a>
                </div>
                <button
                  id="login-submit"
                  className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  type="button"
                  {...{
                    "x-on:click": "submit()",
                    "x-bind:disabled": "loading",
                  }}
                >
                  <span
                    {...{
                      "x-text":
                        "loading ? messages.signingIn : messages.signIn",
                    }}
                  >
                    {t("common.actions.signIn")}
                  </span>
                </button>
                <div
                  id="login-error"
                  role="alert"
                  className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs-plus text-red-400"
                  {...{
                    "x-cloak": "",
                    "x-show": "error",
                    "x-text": "error",
                  }}
                />
                <div className="mt-4 text-center text-xs-plus">
                  <p className="line-clamp-1">
                    <span>{t("auth.login.noAccount")}</span>
                    <a
                      className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                      href={registerUrl}
                    >
                      &nbsp; {t("common.actions.createAccount")}
                    </a>
                  </p>
                </div>
                <div className="my-7 flex items-center space-x-3">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
                  <p>OR</p>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-navy-500"></div>
                </div>
                <div className="flex">
                  <button
                    className="btn w-full space-x-3 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                    type="button"
                  >
                    <span
                      className="size-5.5"
                      dangerouslySetInnerHTML={{
                        __html:
                          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>',
                      }}
                    />
                    <span>{t("auth.login.social.google")}</span>
                  </button>
                </div>
              </div>
              <div className="mt-8 flex justify-center text-xs text-slate-400 dark:text-navy-300">
                Powered by &nbsp;
                <a
                  className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                  href="https://www.workless.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Workless
                </a>
              </div>
            </div>
          </main>
        </div>
      ),
    };
  },
);
