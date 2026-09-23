import { SwitchBase } from '@/app/views/components/switches/switch-base';
import type { SwitchProps } from '@/app/views/components/switches/switch.types';

/** Basic switch with a squircle track and thumb. */
export function SwitchSquircle(props: SwitchProps) {
  return <SwitchBase appearance="squircle" {...props} />;
}
