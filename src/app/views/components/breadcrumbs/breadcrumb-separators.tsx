import { BreadcrumbBase } from '@/app/views/components/breadcrumbs/breadcrumb-base';
import type { BreadcrumbProps } from '@/app/views/components/breadcrumbs/breadcrumb.types';
import type { ReactNode } from 'react';

export type BreadcrumbSeparatorsProps = BreadcrumbProps & {
  separator: ReactNode;
};

/** Breadcrumb with a custom separator such as ›, ·, |, /, or an icon. */
export function BreadcrumbSeparators({ separator, ...props }: BreadcrumbSeparatorsProps) {
  return <BreadcrumbBase {...props} separator={separator} />;
}
