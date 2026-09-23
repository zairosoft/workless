import type { ButtonAppearance, ButtonProps, ButtonSize, ButtonTone, ButtonVariant } from '@/app/views/components/buttons/button.types';

const solidClasses: Record<ButtonTone, string> = {
  default: 'bg-slate-150 text-slate-800 hover:bg-slate-200 focus-visible:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:focus-visible:bg-navy-450 dark:active:bg-navy-450/90',
  primary: 'bg-primary text-white hover:bg-primary-focus focus-visible:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus-visible:bg-accent-focus dark:active:bg-accent/90',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 focus-visible:bg-secondary/90 active:bg-secondary/80',
  info: 'bg-info text-white hover:bg-info/90 focus-visible:bg-info/90 active:bg-info/80',
  success: 'bg-success text-white hover:bg-success/90 focus-visible:bg-success/90 active:bg-success/80',
  warning: 'bg-warning text-white hover:bg-warning/90 focus-visible:bg-warning/90 active:bg-warning/80',
  danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:bg-danger/90 active:bg-danger/80',
};

const outlineClasses: Record<ButtonTone, string> = {
  default: 'border border-slate-300 text-slate-800 hover:bg-slate-150 focus-visible:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus-visible:bg-navy-500 dark:active:bg-navy-500/90',
  primary: 'border border-primary text-primary hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus-visible:bg-accent dark:focus-visible:text-white dark:active:bg-accent/90',
  secondary: 'border border-secondary text-secondary hover:bg-secondary hover:text-white focus-visible:bg-secondary focus-visible:text-white active:bg-secondary/90',
  info: 'border border-info text-info hover:bg-info hover:text-white focus-visible:bg-info focus-visible:text-white active:bg-info/90',
  success: 'border border-success text-success hover:bg-success hover:text-white focus-visible:bg-success focus-visible:text-white active:bg-success/90',
  warning: 'border border-warning text-warning hover:bg-warning hover:text-white focus-visible:bg-warning focus-visible:text-white active:bg-warning/90',
  danger: 'border border-danger text-danger hover:bg-danger hover:text-white focus-visible:bg-danger focus-visible:text-white active:bg-danger/90',
};

const softClasses: Record<ButtonTone, string> = {
  default: 'bg-slate-150 text-slate-800 hover:bg-slate-200 focus-visible:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-100 dark:hover:bg-navy-450 dark:focus-visible:bg-navy-450',
  primary: 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus-visible:bg-accent-light/20',
  secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20 focus-visible:bg-secondary/20 active:bg-secondary/25',
  info: 'bg-info/10 text-info hover:bg-info/20 focus-visible:bg-info/20 active:bg-info/25',
  success: 'bg-success/10 text-success hover:bg-success/20 focus-visible:bg-success/20 active:bg-success/25',
  warning: 'bg-warning/10 text-warning hover:bg-warning/20 focus-visible:bg-warning/20 active:bg-warning/25',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20 focus-visible:bg-danger/20 active:bg-danger/25',
};

const borderedClasses: Record<ButtonTone, string> = {
  default: 'border border-slate-300 bg-slate-150/60 text-slate-800 hover:bg-slate-200/70 focus-visible:bg-slate-200/70 active:bg-slate-200/80 dark:border-navy-450 dark:bg-navy-500/50 dark:text-navy-100 dark:hover:bg-navy-450/70',
  primary: 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 focus-visible:bg-primary/20 active:bg-primary/25 dark:border-accent-light/30 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20',
  secondary: 'border border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20 focus-visible:bg-secondary/20 active:bg-secondary/25',
  info: 'border border-info/30 bg-info/10 text-info hover:bg-info/20 focus-visible:bg-info/20 active:bg-info/25',
  success: 'border border-success/30 bg-success/10 text-success hover:bg-success/20 focus-visible:bg-success/20 active:bg-success/25',
  warning: 'border border-warning/30 bg-warning/10 text-warning hover:bg-warning/20 focus-visible:bg-warning/20 active:bg-warning/25',
  danger: 'border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 focus-visible:bg-danger/20 active:bg-danger/25',
};

const flatClasses: Record<ButtonTone, string> = {
  default: 'text-slate-700 hover:bg-slate-300/20 focus-visible:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:focus-visible:bg-navy-300/20 dark:active:bg-navy-300/25',
  primary: 'text-primary hover:bg-primary/20 focus-visible:bg-primary/20 active:bg-primary/25 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus-visible:bg-accent-light/20',
  secondary: 'text-secondary hover:bg-secondary/20 focus-visible:bg-secondary/20 active:bg-secondary/25',
  info: 'text-info hover:bg-info/20 focus-visible:bg-info/20 active:bg-info/25',
  success: 'text-success hover:bg-success/20 focus-visible:bg-success/20 active:bg-success/25',
  warning: 'text-warning hover:bg-warning/20 focus-visible:bg-warning/20 active:bg-warning/25',
  danger: 'text-danger hover:bg-danger/20 focus-visible:bg-danger/20 active:bg-danger/25',
};

const appearanceClasses: Record<ButtonAppearance, Record<ButtonTone, string>> = {
  solid: solidClasses,
  outline: outlineClasses,
  soft: softClasses,
  bordered: borderedClasses,
  flat: flatClasses,
};

const glowClasses: Record<ButtonTone, string> = {
  default: 'hover:shadow-lg hover:shadow-slate-200/50 focus-visible:shadow-lg focus-visible:shadow-slate-200/50 dark:hover:shadow-navy-450/50 dark:focus-visible:shadow-navy-450/50',
  primary: 'hover:shadow-lg hover:shadow-primary/50 focus-visible:shadow-lg focus-visible:shadow-primary/50 dark:hover:shadow-accent/50 dark:focus-visible:shadow-accent/50',
  secondary: 'hover:shadow-lg hover:shadow-secondary/50 focus-visible:shadow-lg focus-visible:shadow-secondary/50',
  info: 'hover:shadow-lg hover:shadow-info/50 focus-visible:shadow-lg focus-visible:shadow-info/50',
  success: 'hover:shadow-lg hover:shadow-success/50 focus-visible:shadow-lg focus-visible:shadow-success/50',
  warning: 'hover:shadow-lg hover:shadow-warning/50 focus-visible:shadow-lg focus-visible:shadow-warning/50',
  danger: 'hover:shadow-lg hover:shadow-danger/50 focus-visible:shadow-lg focus-visible:shadow-danger/50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'gap-1.5 px-3 py-1.5 text-xs',
  md: 'gap-2 px-5 py-2 text-sm',
  lg: 'gap-2.5 px-6 py-3 text-base',
};

function resolveButtonStyle(variant: ButtonVariant | undefined, tone: ButtonTone | undefined, appearance: ButtonAppearance | undefined) {
  if (variant === 'outline') return { tone: tone ?? 'default', appearance: appearance ?? 'outline' };
  return { tone: tone ?? variant ?? 'primary', appearance: appearance ?? 'solid' };
}

/** Shared internal renderer for the named button components. */
export function ButtonBase({ children, className = '', variant, tone, appearance, size = 'md', rounded = false, glow = false, type = 'button', ...props }: ButtonProps) {
  const resolved = resolveButtonStyle(variant, tone, appearance);

  return (
    <button
      type={type}
      className={[
        'inline-flex cursor-pointer items-center justify-center rounded-lg text-center font-medium tracking-wide no-underline outline-hidden transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-75 dark:focus-visible:ring-accent-light dark:focus-visible:ring-offset-navy-800',
        sizeClasses[size],
        rounded ? 'rounded-full' : '',
        appearanceClasses[resolved.appearance][resolved.tone],
        glow ? glowClasses[resolved.tone] : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
