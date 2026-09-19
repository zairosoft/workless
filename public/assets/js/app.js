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

  const syncFullscreenControls = () => {
    const isFullscreen = Boolean(document.fullscreenElement);

    document.querySelectorAll('[data-fullscreen-toggle]').forEach((control) => {
      control.setAttribute('aria-pressed', String(isFullscreen));
      control.setAttribute('aria-label', isFullscreen ? 'Exit full screen' : 'Enter full screen');
      control.setAttribute('title', isFullscreen ? 'Exit full screen' : 'Enter full screen');
      control.querySelector('[data-fullscreen-enter-icon]')?.classList.toggle('hidden', isFullscreen);
      control.querySelector('[data-fullscreen-exit-icon]')?.classList.toggle('hidden', !isFullscreen);
    });
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.fullscreenEnabled) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // The browser can reject fullscreen when the document is not active.
    }

    syncFullscreenControls();
  };

  initializeTheme();
  syncFullscreenControls();

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

    if (target.closest('[data-logout]')) {
      try {
        sessionStorage.removeItem('workless_token');
      } catch {
        // Continue to the server-side logout redirect when storage is unavailable.
      }
      return;
    }

    if (target.closest('[data-fullscreen-toggle]')) {
      void toggleFullscreen();
      return;
    }

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

  document.addEventListener('fullscreenchange', syncFullscreenControls);
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    syncFullscreenControls();
  });
  document.addEventListener('turbo:load', () => {
    initializeTheme();
    syncFullscreenControls();
  });

  colorScheme.addEventListener('change', (event) => {
    if (getStoredTheme() === null) applyTheme(event.matches);
  });
})();
(() => {
  if (window.__worklessTooltipsInitialized) return;
  window.__worklessTooltipsInitialized = true;

  const selector = '[data-workless-tooltip]';
  let active = null;
  let pendingTarget = null;
  let pendingTimer = null;
  let hideTimer = null;
  let nextId = 0;

  const setting = (target, name, fallback) => {
    const value = Number(target.dataset[name]);
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  };

  const hasTrigger = (target, kind) =>
    (target.dataset.worklessTooltipTrigger || 'hover focus').split(' ').includes(kind);

  const cancelPending = () => {
    clearTimeout(pendingTimer);
    pendingTimer = null;
    pendingTarget = null;
  };

  const position = (instance) => {
    const { target, node, cursor } = instance;
    if (!target.isConnected) return;

    const anchor = target.getBoundingClientRect();
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const placement = target.dataset.worklessTooltipPlacement || 'top';
    const [side, align] = placement.split('-');
    const gap = 10;
    let x = anchor.left + (anchor.width - width) / 2;
    let y = anchor.top - height - gap;

    if (side === 'bottom') y = anchor.bottom + gap;
    if (side === 'right' || side === 'left') {
      x = side === 'right' ? anchor.right + gap : anchor.left - width - gap;
      y = anchor.top + (anchor.height - height) / 2;
    }

    if (align === 'start') {
      if (side === 'top' || side === 'bottom') x = anchor.left;
      else y = anchor.top;
    } else if (align === 'end') {
      if (side === 'top' || side === 'bottom') x = anchor.right - width;
      else y = anchor.bottom - height;
    }

    const cursorMode = target.dataset.worklessTooltipCursor;
    if (cursor && cursorMode) {
      const followsX = cursorMode === 'both' || cursorMode === 'initial' || cursorMode === 'x';
      const followsY = cursorMode === 'both' || cursorMode === 'initial' || cursorMode === 'y';
      const cursorX = side === 'right' ? cursor.x + gap : side === 'left' ? cursor.x - width - gap : cursor.x - width / 2;
      const cursorY = side === 'bottom' ? cursor.y + gap : side === 'top' ? cursor.y - height - gap : cursor.y - height / 2;
      if (followsX) x = cursorX;
      if (followsY) y = cursorY;
    }

    const left = Math.max(8, Math.min(x, window.innerWidth - width - 8));
    const top = Math.max(8, Math.min(y, window.innerHeight - height - 8));
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;

    if (cursor && cursorMode) {
      if (side === 'top' || side === 'bottom') {
        const arrowX = cursorMode === 'y' ? anchor.left + anchor.width / 2 : cursor.x;
        node.style.setProperty('--workless-tooltip-arrow-x', `${Math.max(8, Math.min(arrowX - left, width - 8))}px`);
      } else {
        const arrowY = cursorMode === 'x' ? anchor.top + anchor.height / 2 : cursor.y;
        node.style.setProperty('--workless-tooltip-arrow-y', `${Math.max(8, Math.min(arrowY - top, height - 8))}px`);
      }
    }
  };

  const close = (immediate = false) => {
    cancelPending();
    clearTimeout(hideTimer);
    hideTimer = null;
    if (!active) return;

    const { target, node, previousDescription, duration } = active;
    active = null;
    if (previousDescription === null) target.removeAttribute('aria-describedby');
    else target.setAttribute('aria-describedby', previousDescription);

    node.dataset.open = 'closing';
    if (immediate) node.remove();
    else window.setTimeout(() => node.remove(), duration);
  };

  const scheduleClose = () => {
    clearTimeout(hideTimer);
    if (!active) {
      cancelPending();
      return;
    }
    hideTimer = window.setTimeout(() => close(), active.interactive ? 120 : 0);
  };

  const mount = (target, pointer) => {
    if (!target.isConnected) return;

    const node = document.createElement('span');
    const templateId = target.dataset.worklessTooltipTemplate;
    const template = templateId ? document.getElementById(templateId) : null;
    node.className = 'workless-tooltip';
    node.id = `workless-tooltip-${++nextId}`;
    node.setAttribute('role', 'tooltip');
    node.dataset.tone = target.dataset.worklessTooltipTone || 'default';
    node.dataset.placement = target.dataset.worklessTooltipPlacement || 'top';
    node.dataset.open = 'false';
    node.dataset.interactive = target.hasAttribute('data-workless-tooltip-interactive') ? 'true' : 'false';
    node.style.setProperty('--workless-tooltip-duration', `${setting(target, 'worklessTooltipDuration', 150)}ms`);

    if (template instanceof HTMLTemplateElement) node.append(template.content.cloneNode(true));
    else node.textContent = target.dataset.worklessTooltip || '';

    const extraClasses = target.dataset.worklessTooltipClass?.trim();
    if (extraClasses) node.classList.add(...extraClasses.split(/\s+/));

    document.body.append(node);
    const previousDescription = target.getAttribute('aria-describedby');
    target.setAttribute('aria-describedby', [previousDescription, node.id].filter(Boolean).join(' '));

    active = {
      target,
      node,
      previousDescription,
      duration: setting(target, 'worklessTooltipDuration', 150),
      interactive: node.dataset.interactive === 'true',
      cursor: pointer && Number.isFinite(pointer.clientX) ? { x: pointer.clientX, y: pointer.clientY } : null,
    };

    node.addEventListener('pointerenter', () => clearTimeout(hideTimer));
    node.addEventListener('pointerleave', () => {
      if (!target.matches(':hover') && !target.matches(':focus')) scheduleClose();
    });

    position(active);
    requestAnimationFrame(() => {
      if (active?.node === node) node.dataset.open = 'true';
    });
  };

  const open = (target, pointer) => {
    clearTimeout(hideTimer);
    if (active?.target === target || pendingTarget === target) return;
    close(true);
    pendingTarget = target;
    pendingTimer = window.setTimeout(() => {
      pendingTarget = null;
      pendingTimer = null;
      mount(target, pointer);
    }, setting(target, 'worklessTooltipDelay', 0));
  };

  document.addEventListener('pointerover', (event) => {
    const target = event.target instanceof Element ? event.target.closest(selector) : null;
    if (target instanceof HTMLElement && hasTrigger(target, 'hover')) open(target, event);
  });

  document.addEventListener('pointerout', (event) => {
    const target = event.target instanceof Element ? event.target.closest(selector) : null;
    if (!(target instanceof HTMLElement)) return;
    if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
    if (target === pendingTarget && !target.matches(':focus')) cancelPending();
    if (active?.target === target && !target.matches(':focus')) scheduleClose();
  });

  document.addEventListener('focusin', (event) => {
    const target = event.target instanceof Element ? event.target.closest(selector) : null;
    if (target instanceof HTMLElement && hasTrigger(target, 'focus')) open(target);
  });

  document.addEventListener('focusout', (event) => {
    const target = event.target instanceof Element ? event.target.closest(selector) : null;
    if (!(target instanceof HTMLElement)) return;
    if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
    if (target === pendingTarget && !target.matches(':hover')) cancelPending();
    if (active?.target === target && !target.matches(':hover')) scheduleClose();
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest(selector) : null;
    if (target instanceof HTMLElement && hasTrigger(target, 'click')) {
      if (active?.target === target) close();
      else open(target, event);
    } else if (active && !active.node.contains(event.target) && active.target !== target) {
      close();
    }
  });

  document.addEventListener('pointermove', (event) => {
    if (!active || !active.target.contains(event.target)) return;
    const mode = active.target.dataset.worklessTooltipCursor;
    if (!mode || mode === 'initial') return;
    active.cursor = { x: event.clientX, y: event.clientY };
    position(active);
  });

  document.addEventListener('scroll', () => { if (active) position(active); }, true);
  window.addEventListener('resize', () => { if (active) position(active); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(true); });
  document.addEventListener('turbo:before-render', () => close(true));
})();
