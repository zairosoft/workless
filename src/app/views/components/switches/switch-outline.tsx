import { SwitchBase } from '@/app/views/components/switches/switch-base';
import type { SwitchProps } from '@/app/views/components/switches/switch.types';

/** Outline switch with a rounded track. */
export function SwitchOutline(props: SwitchProps) {
  return <SwitchBase appearance="outline" {...props} />;
}
