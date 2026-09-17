import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonCommonProps } from '@/app/views/components/buttons/button.types';

export type ButtonGlowProps = ButtonCommonProps;

export function ButtonGlow(props: ButtonGlowProps) {
  return <ButtonBase {...props} glow />;
}
