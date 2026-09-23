import type { SwitchBaseProps, SwitchSize, SwitchTone } from '@/app/views/components/switches/switch.types';

const basicTrackClasses: Record<SwitchTone, string> = {
  default: 'bg-slate-300 peer-checked:bg-slate-500 dark:bg-navy-500 dark:peer-checked:bg-navy-400',
  primary: 'bg-slate-300 peer-checked:bg-primary dark:bg-navy-500 dark:peer-checked:bg-accent',
  secondary: 'bg-slate-300 peer-checked:bg-secondary dark:bg-navy-500 dark:peer-checked:bg-secondary',
  info: 'bg-slate-300 peer-checked:bg-info dark:bg-navy-500 dark:peer-checked:bg-info',
  success: 'bg-slate-300 peer-checked:bg-success dark:bg-navy-500 dark:peer-checked:bg-success',
  warning: 'bg-slate-300 peer-checked:bg-warning dark:bg-navy-500 dark:peer-checked:bg-warning',
  danger: 'bg-slate-300 peer-checked:bg-danger dark:bg-navy-500 dark:peer-checked:bg-danger',
};

const basicThumbClasses: Record<SwitchTone, string> = {
  default: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
  primary: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
  secondary: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
  info: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
  success: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
  warning: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
  danger: 'bg-white dark:bg-navy-200 dark:peer-checked:bg-white',
};

const outlineTrackClasses: Record<SwitchTone, string> = {
  default: 'border-slate-400/70 bg-transparent peer-checked:border-slate-500 dark:border-navy-400 dark:peer-checked:border-navy-200',
  primary: 'border-slate-400/70 bg-transparent peer-checked:border-primary dark:border-navy-400 dark:peer-checked:border-accent',
  secondary: 'border-slate-400/70 bg-transparent peer-checked:border-secondary dark:border-navy-400 dark:peer-checked:border-secondary-light',
  info: 'border-slate-400/70 bg-transparent peer-checked:border-info dark:border-navy-400 dark:peer-checked:border-info',
  success: 'border-slate-400/70 bg-transparent peer-checked:border-success dark:border-navy-400 dark:peer-checked:border-success',
  warning: 'border-slate-400/70 bg-transparent peer-checked:border-warning dark:border-navy-400 dark:peer-checked:border-warning',
  danger: 'border-slate-400/70 bg-transparent peer-checked:border-danger dark:border-navy-400 dark:peer-checked:border-danger',
};

const outlineThumbClasses: Record<SwitchTone, string> = {
  default: 'bg-slate-300 peer-checked:bg-slate-500 dark:bg-navy-300 dark:peer-checked:bg-navy-200',
  primary: 'bg-slate-300 peer-checked:bg-primary dark:bg-navy-300 dark:peer-checked:bg-accent',
  secondary: 'bg-slate-300 peer-checked:bg-secondary dark:bg-navy-300 dark:peer-checked:bg-secondary-light',
  info: 'bg-slate-300 peer-checked:bg-info dark:bg-navy-300 dark:peer-checked:bg-info',
  success: 'bg-slate-300 peer-checked:bg-success dark:bg-navy-300 dark:peer-checked:bg-success',
  warning: 'bg-slate-300 peer-checked:bg-warning dark:bg-navy-300 dark:peer-checked:bg-warning',
  danger: 'bg-slate-300 peer-checked:bg-danger dark:bg-navy-300 dark:peer-checked:bg-danger',
};

const appearanceClasses = {
  basic: {
    track: 'rounded-full',
    thumb: 'rounded-full',
  },
  squircle: {
    track: 'rounded-lg',
    thumb: 'rounded-md',
  },
  outline: {
    track: 'rounded-full border',
    thumb: 'rounded-full',
  },
  'outline-squircle': {
    track: 'rounded-lg border',
    thumb: 'rounded-md',
  },
} as const;

const sizeClasses: Record<SwitchSize, { track: string; thumb: string }> = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'left-1 top-1 size-3 peer-checked:translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'left-1 top-1 size-4 peer-checked:translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'left-1.5 top-1.5 size-4 peer-checked:translate-x-7',
  },
};

/** Shared Tailwind renderer used by each named switch component. */
export function SwitchBase({
  appearance,
  label,
  labelClassName = '',
  tone = 'primary',
  size = 'md',
  className = '',
  ...props
}: SwitchBaseProps) {
  const isOutline = appearance === 'outline' || appearance === 'outline-squircle';
  const shape = appearanceClasses[appearance];
  const dimensions = sizeClasses[size];
  const trackTone = isOutline ? outlineTrackClasses[tone] : basicTrackClasses[tone];
  const thumbTone = isOutline ? outlineThumbClasses[tone] : basicThumbClasses[tone];

  const control = (
    <span className="relative inline-flex shrink-0">
      <input
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className={[
          'block transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white peer-disabled:cursor-not-allowed peer-disabled:opacity-60 dark:peer-focus-visible:ring-accent/40 dark:peer-focus-visible:ring-offset-navy-800',
          dimensions.track,
          shape.track,
          trackTone,
          className,
        ].filter(Boolean).join(' ')}
      />
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute shadow-sm transition-transform duration-200 peer-disabled:opacity-60',
          dimensions.thumb,
          shape.thumb,
          thumbTone,
        ].join(' ')}
      />
    </span>
  );

  if (label == null) return control;

  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 has-[:disabled]:cursor-not-allowed">
      {control}
      <span className={['text-sm text-slate-700 dark:text-navy-100', labelClassName].filter(Boolean).join(' ')}>
        {label}
      </span>
    </label>
  );
}
