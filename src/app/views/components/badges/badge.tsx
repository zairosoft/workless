import { BadgeBase } from '@/app/views/components/badges/badge-base';
import type { BadgeCommonProps } from '@/app/views/components/badges/badge.types';

export type BadgeBasicProps = BadgeCommonProps;

export function BadgeBasic(props: BadgeBasicProps) {
  return <BadgeBase {...props} />;
}
