import { Tooltip } from '@/app/views/components/tooltips/tooltip';
import type { TooltipProps } from '@/app/views/components/tooltips/tooltip.types';

export type TooltipContentProps = Omit<TooltipProps, 'interactive'>;

/** Tooltip for rich, pointer-interactive content such as a compact profile card. */
export function TooltipContent(props: TooltipContentProps) {
  return <Tooltip {...props} interactive />;
}
