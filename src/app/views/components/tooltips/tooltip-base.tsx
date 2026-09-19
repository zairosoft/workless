import { cloneElement, useId } from 'react';
import type { HTMLAttributes, ReactElement } from 'react';
import type { TooltipProps } from '@/app/views/components/tooltips/tooltip.types';

type TooltipTriggerAttributes = HTMLAttributes<HTMLElement> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

/** Adds tooltip configuration to the trigger; the visible tooltip is created when opened. */
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
  contentClassName,
  className,
}: TooltipProps) {
  const templateId = useId();
  const isText = typeof content === 'string' || typeof content === 'number';
  const child = children as ReactElement<TooltipTriggerAttributes>;
  const triggerClassName = [child.props.className, className].filter(Boolean).join(' ');

  const element = cloneElement(child, {
    className: triggerClassName || undefined,
    'data-workless-tooltip': isText ? String(content) : '',
    'data-workless-tooltip-template': isText ? undefined : templateId,
    'data-workless-tooltip-placement': placement,
    'data-workless-tooltip-tone': tone,
    'data-workless-tooltip-delay': delay,
    'data-workless-tooltip-duration': duration,
    'data-workless-tooltip-cursor': followCursor,
    'data-workless-tooltip-trigger': Array.isArray(trigger) ? trigger.join(' ') : trigger,
    'data-workless-tooltip-interactive': interactive || undefined,
    'data-workless-tooltip-class': contentClassName || undefined,
  });

  return isText ? element : (
    <>
      {element}
      <template id={templateId}>{content}</template>
    </>
  );
}
