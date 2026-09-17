import { Tooltip } from '@/app/views/components/tooltips/tooltip';
import type { TooltipProps } from '@/app/views/components/tooltips/tooltip.types';

export type TooltipDelayProps = Omit<TooltipProps, 'delay' | 'duration'> & {
  delay?: number;
  duration?: number;
};

/** Tooltip with an explicit reveal delay and transition duration. */
export function TooltipDelay({ delay = 500, duration = 150, ...props }: TooltipDelayProps) {
  return <Tooltip {...props} delay={delay} duration={duration} />;
}
