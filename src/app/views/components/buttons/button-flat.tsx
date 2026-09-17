import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonCommonProps } from '@/app/views/components/buttons/button.types';

export type ButtonFlatProps = ButtonCommonProps;

export function ButtonFlat(props: ButtonFlatProps) {
  return <ButtonBase {...props} appearance="flat" />;
}
