import { SwitchBase } from '@/app/views/components/switches/switch-base';
import type { SwitchProps } from '@/app/views/components/switches/switch.types';

/** Outline switch with a squircle track and thumb. */
export function SwitchOutlineSquircle(props: SwitchProps) {
  return <SwitchBase appearance="outline-squircle" {...props} />;
}
