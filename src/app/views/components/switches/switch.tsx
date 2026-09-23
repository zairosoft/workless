import { SwitchBase } from '@/app/views/components/switches/switch-base';
import type { SwitchProps } from '@/app/views/components/switches/switch.types';

/** Basic rounded switch. */
export function Switch(props: SwitchProps) {
  return <SwitchBase appearance="basic" {...props} />;
}
