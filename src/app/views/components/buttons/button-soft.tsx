import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonCommonProps } from '@/app/views/components/buttons/button.types';

export type ButtonSoftProps = ButtonCommonProps;

export function ButtonSoft(props: ButtonSoftProps) {
  return <ButtonBase {...props} appearance="soft" />;
}
