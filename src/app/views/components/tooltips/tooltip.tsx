import { TooltipBase } from '@/app/views/components/tooltips/tooltip-base';
import type { TooltipProps } from '@/app/views/components/tooltips/tooltip.types';

export type { TooltipFollowCursor, TooltipPlacement, TooltipProps, TooltipTone, TooltipTrigger } from '@/app/views/components/tooltips/tooltip.types';

/** Theme-aware tooltip for buttons, links, and other focusable elements. */
export function Tooltip(props: TooltipProps) {
  return <TooltipBase {...props} />;
}
