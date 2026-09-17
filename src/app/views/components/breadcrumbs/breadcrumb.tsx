import { BreadcrumbBase, BreadcrumbChevron } from '@/app/views/components/breadcrumbs/breadcrumb-base';
import type { BreadcrumbProps } from '@/app/views/components/breadcrumbs/breadcrumb.types';

export type { BreadcrumbItem, BreadcrumbProps } from '@/app/views/components/breadcrumbs/breadcrumb.types';

/** Default chevron-separated breadcrumb. */
export function Breadcrumb(props: BreadcrumbProps) {
  return <BreadcrumbBase {...props} separator={<BreadcrumbChevron />} />;
}
