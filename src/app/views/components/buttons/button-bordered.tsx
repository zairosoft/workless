import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonCommonProps } from '@/app/views/components/buttons/button.types';

export type ButtonBorderedProps = ButtonCommonProps;

export function ButtonBordered(props: ButtonBorderedProps) {
  return <ButtonBase {...props} appearance="bordered" />;
}
