(() => {
  const themeStorageKey = '_x_darkMode_on';
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

  const getStoredTheme = () => {
    try {
      const storedTheme = localStorage.getItem(themeStorageKey);

      if (storedTheme === 'true') return true;
      if (storedTheme === 'false') return false;
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }

    return null;
  };

  const syncThemeControls = (isDark) => {
    document.querySelectorAll('[data-theme-toggle]').forEach((control) => {
      control.setAttribute('aria-pressed', String(isDark));
      control.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      control.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
    });
  };

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    syncThemeControls(isDark);
  };

  const initializeTheme = () => {
    applyTheme(getStoredTheme() ?? colorScheme.matches);
  };

  initializeTheme();

  if (window.__worklessDropdownsInitialized) return;
  window.__worklessDropdownsInitialized = true;

  const closeDropdowns = (except = null) => {
    document.querySelectorAll('details[data-dropdown][open]').forEach((dropdown) => {
      if (dropdown !== except) dropdown.removeAttribute('open');
    });
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-theme-toggle]')) {
      const isDark = !document.documentElement.classList.contains('dark');

      try {
        localStorage.setItem(themeStorageKey, String(isDark));
      } catch {
        // The selected theme still applies for the current page.
      }

      applyTheme(isDark);
      return;
    }

    const activeDropdown = target.closest('details[data-dropdown]');
    closeDropdowns(activeDropdown);

    if (activeDropdown && target.closest('[data-dropdown-menu] a')) {
      activeDropdown.removeAttribute('open');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const openDropdown = document.querySelector('details[data-dropdown][open]');
    closeDropdowns();

    if (openDropdown instanceof HTMLElement) {
      openDropdown.querySelector('summary')?.focus();
    }
  });

  document.addEventListener('DOMContentLoaded', initializeTheme);
  document.addEventListener('turbo:load', initializeTheme);

  colorScheme.addEventListener('change', (event) => {
    if (getStoredTheme() === null) applyTheme(event.matches);
  });
})();
