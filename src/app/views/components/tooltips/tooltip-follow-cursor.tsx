import { Tooltip } from '@/app/views/components/tooltips/tooltip';
import type { TooltipFollowCursor as TooltipFollowCursorMode, TooltipProps } from '@/app/views/components/tooltips/tooltip.types';

export type TooltipFollowCursorProps = Omit<TooltipProps, 'followCursor'> & {
  followCursor?: TooltipFollowCursorMode;
};

/** Tooltip that tracks the pointer along both axes, one axis, or its initial position. */
export function TooltipFollowCursor({ followCursor = 'both', ...props }: TooltipFollowCursorProps) {
  return <Tooltip {...props} followCursor={followCursor} />;
}
