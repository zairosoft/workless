import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonCommonProps } from '@/app/views/components/buttons/button.types';

export type ButtonOutlinedProps = ButtonCommonProps;

export function ButtonOutlined(props: ButtonOutlinedProps) {
  return <ButtonBase {...props} appearance="outline" />;
}
