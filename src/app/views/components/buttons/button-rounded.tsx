import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonCommonProps } from '@/app/views/components/buttons/button.types';

export type ButtonRoundedProps = ButtonCommonProps;

export function ButtonRounded(props: ButtonRoundedProps) {
  return <ButtonBase {...props} rounded />;
}
