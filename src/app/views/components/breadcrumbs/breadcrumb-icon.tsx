import { BreadcrumbBase, BreadcrumbChevron } from '@/app/views/components/breadcrumbs/breadcrumb-base';
import type { BreadcrumbProps } from '@/app/views/components/breadcrumbs/breadcrumb.types';

export type BreadcrumbIconProps = BreadcrumbProps;

/** Default breadcrumb where items may include an icon. */
export function BreadcrumbIcon(props: BreadcrumbIconProps) {
  return <BreadcrumbBase {...props} separator={<BreadcrumbChevron />} />;
}
