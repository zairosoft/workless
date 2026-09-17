import { BreadcrumbBase, BreadcrumbChevron } from '@/app/views/components/breadcrumbs/breadcrumb-base';
import type { BreadcrumbProps } from '@/app/views/components/breadcrumbs/breadcrumb.types';

export type BreadcrumbBorderedProps = BreadcrumbProps;

/** Breadcrumb with bordered link items, suited to compact navigation trails. */
export function BreadcrumbBordered(props: BreadcrumbBorderedProps) {
  return <BreadcrumbBase {...props} bordered separator={<BreadcrumbChevron />} />;
}
