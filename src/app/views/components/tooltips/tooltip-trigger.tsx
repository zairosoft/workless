import { Tooltip } from '@/app/views/components/tooltips/tooltip';
import type { TooltipProps, TooltipTrigger as TooltipTriggerEvent } from '@/app/views/components/tooltips/tooltip.types';

export type TooltipTriggerProps = Omit<TooltipProps, 'trigger'> & {
  trigger: TooltipTriggerEvent | TooltipTriggerEvent[];
};

/** Tooltip that opens from a specific event: hover, click, or keyboard focus. */
export function TooltipTrigger(props: TooltipTriggerProps) {
  return <Tooltip {...props} />;
}
