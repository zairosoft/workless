import type { ReactNode } from 'react';

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  /** Accessible description for the breadcrumb navigation landmark. */
  ariaLabel?: string;
};

export type BreadcrumbBaseProps = BreadcrumbProps & {
  separator?: ReactNode;
  bordered?: boolean;
};
