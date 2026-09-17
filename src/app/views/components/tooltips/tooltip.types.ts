import type { ReactElement, ReactNode } from 'react';

export type TooltipTone = 'default' | 'light' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type TooltipFollowCursor = 'both' | 'x' | 'y' | 'initial';

export type TooltipTrigger = 'hover' | 'click' | 'focus';

export type TooltipProps = {
  /** The focusable or hoverable element that opens the tooltip. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  content: ReactNode;
  placement?: TooltipPlacement;
  tone?: TooltipTone;
  /** Delay before the tooltip begins its visibility transition, in milliseconds. */
  delay?: number;
  /** Visibility transition duration, in milliseconds. */
  duration?: number;
  /** Makes the tooltip follow the pointer inside its trigger. */
  followCursor?: TooltipFollowCursor;
  /** Events that reveal the tooltip. Defaults to hover and keyboard focus. */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** Allows pointer interaction and multiline content inside the tooltip. */
  interactive?: boolean;
  contentClassName?: string;
  className?: string;
};
