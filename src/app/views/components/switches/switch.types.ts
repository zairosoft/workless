import type { InputHTMLAttributes, ReactNode } from 'react';

export type SwitchTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type SwitchAppearance =
  | 'basic'
  | 'squircle'
  | 'outline'
  | 'outline-squircle';

export type SwitchSize = 'sm' | 'md' | 'lg';

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** Optional text rendered next to the switch. */
  label?: ReactNode;
  /** Classes applied to the optional label text. */
  labelClassName?: string;
  tone?: SwitchTone;
  /** Switch dimensions. `md` matches the Notifications control in Settings. */
  size?: SwitchSize;
};

export type SwitchBaseProps = SwitchProps & {
  appearance: SwitchAppearance;
};
