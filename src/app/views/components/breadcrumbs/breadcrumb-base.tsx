import type { ComponentType, SVGProps } from 'react';
import type { BreadcrumbBaseProps } from '@/app/views/components/breadcrumbs/breadcrumb.types';

type SolarIconProps = {
  color?: string;
  size?: number | string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'height' | 'size' | 'width'>;

type SolarIconComponent = ComponentType<SolarIconProps>;

const { AltArrowRightOutline } = require('solar-icon-set') as Record<string, SolarIconComponent>;

/** Internal Solar Outline chevron used between breadcrumb items. */
export function BreadcrumbChevron() {
  return <AltArrowRightOutline aria-hidden="true" className="size-3.5" />;
}

/** Shared, accessible renderer for all breadcrumb variants. */
export function BreadcrumbBase({
  items,
  separator,
  bordered = false,
  className = '',
  ariaLabel = 'Breadcrumb',
}: BreadcrumbBaseProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          const content = (
            <>
              {item.icon && <span aria-hidden="true" className="flex size-4.5 shrink-0 items-center justify-center [&>svg]:size-full">{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );

          return (
            <li key={index} className="flex items-center gap-2">
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? 'page' : undefined} className="inline-flex items-center gap-1.5 text-slate-600 dark:text-navy-200">
                  {content}
                </span>
              ) : (
                <a
                  href={item.href}
                  className={[
                    'inline-flex items-center gap-1.5 text-primary outline-hidden transition-colors hover:text-primary-focus focus-visible:text-primary-focus dark:text-accent-light dark:hover:text-accent dark:focus-visible:text-accent',
                    bordered ? 'rounded-lg border border-slate-200 px-1.5 py-1 leading-none dark:border-navy-500' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {content}
                </a>
              )}
              {!isCurrent && separator && <span aria-hidden="true" className="flex shrink-0 items-center text-slate-400 dark:text-navy-300">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
