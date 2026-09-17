import { cloneElement, useId } from 'react';
import type { CSSProperties } from 'react';
import type { TooltipPlacement, TooltipProps, TooltipTone, TooltipTrigger } from '@/app/views/components/tooltips/tooltip.types';

const toneClasses: Record<TooltipTone, string> = {
  default: 'bg-navy-700 text-white dark:bg-navy-50 dark:text-navy-900',
  light: 'border border-slate-200 bg-white text-slate-700 shadow-slate-200/60 dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100 dark:shadow-none',
  primary: 'bg-primary text-white dark:bg-accent',
  secondary: 'bg-secondary text-white',
  info: 'bg-info text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger: 'bg-danger text-white',
};

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0',
  'top-start': 'bottom-full left-0 mb-2 translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0',
  'top-end': 'bottom-full right-0 mb-2 translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2 -translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0',
  'right-start': 'left-full top-0 ml-2 -translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0',
  'right-end': 'bottom-0 left-full ml-2 -translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2 -translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0',
  'bottom-start': 'left-0 top-full mt-2 -translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0',
  'bottom-end': 'right-0 top-full mt-2 -translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0',
  left: 'right-full top-1/2 mr-2 translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0',
  'left-start': 'right-full top-0 mr-2 translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0',
  'left-end': 'bottom-0 right-full mr-2 translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0',
};

const arrowClasses: Record<TooltipPlacement, string> = {
  top: '-bottom-1.5 left-1/2 -translate-x-1/2',
  'top-start': '-bottom-1.5 left-3',
  'top-end': '-bottom-1.5 right-3',
  right: '-left-1.5 top-1/2 -translate-y-1/2',
  'right-start': '-left-1.5 top-3',
  'right-end': '-left-1.5 bottom-3',
  bottom: '-top-1.5 left-1/2 -translate-x-1/2',
  'bottom-start': '-top-1.5 left-3',
  'bottom-end': '-top-1.5 right-3',
  left: '-right-1.5 top-1/2 -translate-y-1/2',
  'left-start': '-right-1.5 top-3',
  'left-end': '-right-1.5 bottom-3',
};

/** Shared accessible tooltip renderer. It opens on pointer hover and keyboard focus. */
export function TooltipBase({
  children,
  content,
  placement = 'top',
  tone = 'default',
  delay = 0,
  duration = 150,
  followCursor,
  trigger = ['hover', 'focus'],
  interactive = false,
  contentClassName = '',
  className = '',
}: TooltipProps) {
  const tooltipId = useId();
  const describedBy = [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ');
  const triggers = new Set<TooltipTrigger>(Array.isArray(trigger) ? trigger : [trigger]);
  const transitionStyle: CSSProperties = { transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` };
  const visibleClasses = [
    triggers.has('hover') && 'group-hover/tooltip:visible group-hover/tooltip:opacity-100',
    triggers.has('focus') && 'group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100',
    triggers.has('click') && 'group-data-[tooltip-open=true]/tooltip:visible group-data-[tooltip-open=true]/tooltip:opacity-100',
  ].filter(Boolean).join(' ');

  return (
    <span
      className={['group/tooltip relative inline-flex', className].filter(Boolean).join(' ')}
      data-tooltip-follow-cursor={followCursor || undefined}
      data-tooltip-trigger-click={triggers.has('click') || undefined}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span
        id={tooltipId}
        role="tooltip"
        data-tooltip-content={followCursor ? 'true' : undefined}
        style={transitionStyle}
        className={[
          'invisible absolute z-50 max-w-64 rounded-md px-2.5 py-1.5 text-xs font-medium leading-tight opacity-0 shadow-lg transition-[opacity,transform,visibility] ease-out',
          visibleClasses,
          interactive ? 'pointer-events-auto whitespace-normal' : 'pointer-events-none whitespace-nowrap',
          toneClasses[tone],
          followCursor ? 'left-[var(--tooltip-cursor-x)] top-[var(--tooltip-cursor-y)]' : placementClasses[placement],
          contentClassName,
        ].join(' ')}
      >
        {!followCursor && (
          <span
            aria-hidden="true"
            className={[
              'absolute size-3 rotate-45 bg-inherit',
              arrowClasses[placement],
            ].join(' ')}
          />
        )}
        {content}
      </span>
    </span>
  );
}
