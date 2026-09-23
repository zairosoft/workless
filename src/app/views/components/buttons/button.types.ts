import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type ButtonAppearance = 'solid' | 'outline' | 'soft' | 'bordered' | 'flat';

export type ButtonSize = 'sm' | 'md' | 'lg';

/** Legacy values remain valid for existing views. */
export type ButtonVariant = ButtonTone | 'outline';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: ButtonTone;
  appearance?: ButtonAppearance;
  /** Button dimensions. `md` preserves the existing button size. */
  size?: ButtonSize;
  /** @deprecated Use tone or a named button component for new views. */
  variant?: ButtonVariant;
  rounded?: boolean;
  glow?: boolean;
};

export type ButtonCommonProps = Omit<ButtonProps, 'appearance' | 'rounded' | 'glow'>;
