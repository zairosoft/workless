import { ButtonBase } from '@/app/views/components/buttons/button-base';
import type { ButtonProps } from '@/app/views/components/buttons/button.types';

export type { ButtonAppearance, ButtonProps, ButtonTone, ButtonVariant } from '@/app/views/components/buttons/button.types';

/** Default solid button. Supports legacy `variant` values for existing views. */
export function Button(props: ButtonProps) {
  return <ButtonBase {...props} />;
}
