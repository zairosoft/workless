import type { ComponentType, ReactNode, SVGProps } from 'react';
import { BadgeBasic } from '@/app/views/components/badges/badge';
import { BadgeDot } from '@/app/views/components/badges/badge-dot';
import { BadgeGlow } from '@/app/views/components/badges/badge-glow';
import { BadgeOutlined } from '@/app/views/components/badges/badge-outlined';
import { BadgeRounded } from '@/app/views/components/badges/badge-rounded';
import { BadgeSoftDot } from '@/app/views/components/badges/badge-soft-dot';
import { BadgeSoft } from '@/app/views/components/badges/badge-soft';
import type { BadgeTone } from '@/app/views/components/badges/badge.types';
import { Button } from '@/app/views/components/buttons/button';
import { ButtonBordered } from '@/app/views/components/buttons/button-bordered';
import { ButtonFlat } from '@/app/views/components/buttons/button-flat';
import { ButtonGlow } from '@/app/views/components/buttons/button-glow';
import { ButtonOutlined } from '@/app/views/components/buttons/button-outlined';
import { ButtonRounded } from '@/app/views/components/buttons/button-rounded';
import { ButtonSoft } from '@/app/views/components/buttons/button-soft';
import { Breadcrumb } from '@/app/views/components/breadcrumbs/breadcrumb';
import { BreadcrumbBordered } from '@/app/views/components/breadcrumbs/breadcrumb-bordered';
import { BreadcrumbIcon } from '@/app/views/components/breadcrumbs/breadcrumb-icon';
import { BreadcrumbSeparators } from '@/app/views/components/breadcrumbs/breadcrumb-separators';
import type { BreadcrumbItem } from '@/app/views/components/breadcrumbs/breadcrumb.types';
import { renderMainLayoutView } from '@/app/views/components/layouts/layout';
import { TooltipContent } from '@/app/views/components/tooltips/tooltip-content';
import { TooltipDelay } from '@/app/views/components/tooltips/tooltip-delay';
import { TooltipFollowCursor } from '@/app/views/components/tooltips/tooltip-follow-cursor';
import { Tooltip } from '@/app/views/components/tooltips/tooltip';
import { TooltipTrigger } from '@/app/views/components/tooltips/tooltip-trigger';
import type { TooltipTone } from '@/app/views/components/tooltips/tooltip.types';

type SolarIconProps = {
  color?: string;
  size?: number | string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'color' | 'height' | 'size' | 'width'>;

type SolarIconComponent = ComponentType<SolarIconProps>;

const {
  AltArrowRightOutline,
  HomeAngleOutline,
  CalendarOutline,
  WidgetOutline,
} = require('solar-icon-set') as Record<string, SolarIconComponent>;

const badgeTones: Array<{ label: string; tone: BadgeTone }> = [
  { label: 'Default', tone: 'default' },
  { label: 'Primary', tone: 'primary' },
  { label: 'Secondary', tone: 'secondary' },
  { label: 'Info', tone: 'info' },
  { label: 'Success', tone: 'success' },
  { label: 'Warning', tone: 'warning' },
  { label: 'Error', tone: 'error' },
  { label: 'Dark', tone: 'dark' },
  { label: 'Light', tone: 'light' },
];

const buttonTones = [
  { label: 'Default', tone: 'default' },
  { label: 'Primary', tone: 'primary' },
  { label: 'Secondary', tone: 'secondary' },
  { label: 'Info', tone: 'info' },
  { label: 'Success', tone: 'success' },
  { label: 'Warning', tone: 'warning' },
  { label: 'Error', tone: 'danger' },
] as const;

const coloredButtonTones = buttonTones.slice(1);

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Elements', href: '/components' },
  { label: 'Breadcrumb' },
];

const iconBreadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/', icon: <HomeAngleOutline aria-hidden="true" /> },
  { label: 'Elements', href: '/components', icon: <WidgetOutline aria-hidden="true" /> },
  { label: 'Calendar', icon: <CalendarOutline aria-hidden="true" /> },
];

const tooltipTones: Array<{ label: string; tone: TooltipTone }> = [
  { label: 'Default', tone: 'default' },
  { label: 'Light', tone: 'light' },
  { label: 'Primary', tone: 'primary' },
  { label: 'Secondary', tone: 'secondary' },
  { label: 'Info', tone: 'info' },
  { label: 'Success', tone: 'success' },
  { label: 'Warning', tone: 'warning' },
  { label: 'Error', tone: 'danger' },
];

type ShowcaseCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function ShowcaseCard({ title, description, children }: ShowcaseCardProps) {
  return (
    <section className="card px-4 pb-4 sm:px-5">
      <div className="my-3 flex min-h-8 items-center">
        <h2 className="font-medium tracking-wide text-slate-700 dark:text-navy-100 lg:text-base">
          {title}
        </h2>
      </div>
      <p className="max-w-2xl text-sm text-slate-500 dark:text-navy-200">
        {description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {children}
      </div>
    </section>
  );
}

export function renderComponentShowcasePage(): string {
  return renderMainLayoutView({
    title: 'Components',
    content: (
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
        <section id="badges" className="scroll-mt-20">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Components</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800 dark:text-navy-50">Badges</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <ShowcaseCard title="Badge" description="Basic badges for labels and compact status values.">
              {badgeTones.map(({ label, tone }) => (
                <BadgeBasic key={tone} tone={tone}>{label}</BadgeBasic>
              ))}
            </ShowcaseCard>

            <ShowcaseCard title="Rounded Badge" description="Badges with a fully rounded pill shape.">
              {badgeTones.map(({ label, tone }) => (
                <BadgeRounded key={tone} tone={tone}>{label}</BadgeRounded>
              ))}
            </ShowcaseCard>

            <ShowcaseCard title="Glow Badge" description="Solid badges with a soft color-matched shadow.">
              {badgeTones.slice(0, 7).map(({ label, tone }) => (
                <BadgeGlow key={tone} tone={tone}>{label}</BadgeGlow>
              ))}
            </ShowcaseCard>

            <ShowcaseCard title="Soft Color Badge" description="Low-emphasis badges with a tinted background.">
              {badgeTones.slice(1, 7).map(({ label, tone }) => (
                <BadgeSoft key={tone} tone={tone}>{label}</BadgeSoft>
              ))}
            </ShowcaseCard>

            <ShowcaseCard title="Outlined Badge" description="Rounded badges with a colored outline and transparent background.">
              {badgeTones.map(({ label, tone }) => (
                <BadgeOutlined key={tone} tone={tone}>{label}</BadgeOutlined>
              ))}
            </ShowcaseCard>

            <ShowcaseCard title="Badge With Dots" description="Minimal status badges represented by a colored dot and label.">
              {badgeTones.slice(0, 7).map(({ label, tone }) => (
                <BadgeDot key={tone} tone={tone}>{label}</BadgeDot>
              ))}
            </ShowcaseCard>

            <ShowcaseCard title="Soft Color Badge With Dots" description="Rounded soft badges with a matching status dot.">
              {badgeTones.slice(1, 7).map(({ label, tone }) => (
                <BadgeSoftDot key={tone} tone={tone}>{label}</BadgeSoftDot>
              ))}
            </ShowcaseCard>
          </div>
        </section>

        <section id="buttons" className="scroll-mt-20">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Components</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800 dark:text-navy-50">Buttons</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <ShowcaseCard title="Button" description="Solid action buttons for primary and status-based actions.">
              {buttonTones.map(({ label, tone }) => <Button key={tone} tone={tone}>{label}</Button>)}
            </ShowcaseCard>
            <ShowcaseCard title="Rounded Button" description="The same solid buttons with a fully rounded pill shape.">
              {buttonTones.map(({ label, tone }) => <ButtonRounded key={tone} tone={tone}>{label}</ButtonRounded>)}
            </ShowcaseCard>
            <ShowcaseCard title="Outlined Button" description="Transparent buttons that fill with their color on hover or keyboard focus.">
              {buttonTones.map(({ label, tone }) => <ButtonOutlined key={tone} tone={tone}>{label}</ButtonOutlined>)}
            </ShowcaseCard>
            <ShowcaseCard title="Soft Color Button" description="Low-emphasis colored actions using the Workless theme tokens.">
              {coloredButtonTones.map(({ label, tone }) => <ButtonSoft key={tone} tone={tone}>{label}</ButtonSoft>)}
            </ShowcaseCard>
            <ShowcaseCard title="Bordered Button" description="Soft buttons with a subtle matching border for clearer separation.">
              {coloredButtonTones.map(({ label, tone }) => <ButtonBordered key={tone} tone={tone}>{label}</ButtonBordered>)}
            </ShowcaseCard>
            <ShowcaseCard title="Flat Button" description="Text-forward actions with a restrained hover background.">
              {buttonTones.map(({ label, tone }) => <ButtonFlat key={tone} tone={tone}>{label}</ButtonFlat>)}
            </ShowcaseCard>
            <ShowcaseCard title="Glow Buttons" description="Solid buttons with a color-matched glow on hover and keyboard focus.">
              {buttonTones.map(({ label, tone }) => <ButtonGlow key={tone} tone={tone}>{label}</ButtonGlow>)}
            </ShowcaseCard>
          </div>
        </section>

        <section id="breadcrumbs" className="scroll-mt-20">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Components</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800 dark:text-navy-50">Breadcrumbs</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <ShowcaseCard title="Breadcrumb" description="A navigation trail that communicates the current page’s location.">
              <Breadcrumb items={breadcrumbItems} />
            </ShowcaseCard>
            <ShowcaseCard title="Separators" description="Use characters or a Solar icon to match the context of the navigation.">
              <div className="flex w-full flex-col gap-4">
                <BreadcrumbSeparators items={breadcrumbItems} separator={<span>»</span>} />
                <BreadcrumbSeparators items={breadcrumbItems} separator={<span>·</span>} />
                <BreadcrumbSeparators items={breadcrumbItems} separator={<span className="text-xs font-light">|</span>} />
                <BreadcrumbSeparators items={breadcrumbItems} separator={<span className="text-xs font-light">/</span>} />
                <BreadcrumbSeparators items={breadcrumbItems} separator={<AltArrowRightOutline aria-hidden="true" className="size-3.5" />} />
              </div>
            </ShowcaseCard>
            <ShowcaseCard title="Icon Breadcrumb" description="Breadcrumb items can carry Solar Outline icons alongside their label.">
              <BreadcrumbIcon items={iconBreadcrumbItems} />
            </ShowcaseCard>
            <ShowcaseCard title="Bordered Breadcrumb" description="Bordered linked items provide a compact, more defined navigation trail.">
              <BreadcrumbBordered items={iconBreadcrumbItems} />
            </ShowcaseCard>
          </div>
        </section>

        <section id="tooltips" className="scroll-mt-20">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Components</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-800 dark:text-navy-50">Tooltips</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
            <ShowcaseCard title="Basic Tooltip" description="Hover or focus an action to reveal concise supporting information.">
              {tooltipTones.map(({ label, tone }) => (
                <Tooltip key={tone} content={`${label} tooltip`} tone={tone}>
                  <Button tone={tone === 'light' ? 'default' : tone === 'danger' ? 'danger' : tone}>{label}</Button>
                </Tooltip>
              ))}
            </ShowcaseCard>
            <ShowcaseCard title="Tooltip Delay, Duration" description="Control the reveal delay and the transition duration for less distracting hints.">
              <TooltipDelay content="Debounce 500 milliseconds"><Button tone="default">Delay</Button></TooltipDelay>
              <TooltipDelay content="Duration 1 second animation" delay={0} duration={1000}><Button tone="default">Duration</Button></TooltipDelay>
            </ShowcaseCard>
            <ShowcaseCard title="Tooltip Trigger" description="Tooltips work with pointer hover, click focus, and keyboard focus.">
              <TooltipTrigger content="Hover me" trigger="hover"><Button tone="default">Hover</Button></TooltipTrigger>
              <TooltipTrigger content="Click me" trigger="click"><Button tone="default">Click</Button></TooltipTrigger>
              <TooltipTrigger content="Focus me" trigger="focus"><Button tone="default">Focus</Button></TooltipTrigger>
            </ShowcaseCard>
            <ShowcaseCard title="Follow Cursor" description="Tooltips can follow the pointer in both directions or on a single axis.">
              <TooltipFollowCursor content="Follow Cursor"><Button tone="default">Cursor</Button></TooltipFollowCursor>
              <TooltipFollowCursor content="Follow Cursor Horizontal" followCursor="x"><Button tone="default">Horizontal</Button></TooltipFollowCursor>
              <TooltipFollowCursor content="Follow Cursor Vertical" followCursor="y"><Button tone="default">Vertical</Button></TooltipFollowCursor>
              <TooltipFollowCursor content="Follow Cursor Initial" followCursor="initial"><Button tone="default">Initial</Button></TooltipFollowCursor>
            </ShowcaseCard>
            <ShowcaseCard title="HTML Content Tooltip" description="Render richer, interactive content when a short text hint is not enough.">
              <TooltipContent
                tone="light"
                content={(
                  <div className="flex min-w-52 items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">ZS</span>
                    <span className="block">
                      <span className="block font-semibold text-slate-700 dark:text-navy-100">Zairosoft</span>
                      <span className="mt-0.5 block text-xs font-normal text-slate-500 dark:text-navy-300">Workless maintainer</span>
                    </span>
                  </div>
                )}
              >
                <Button tone="default">Content</Button>
              </TooltipContent>
            </ShowcaseCard>
          </div>
        </section>
      </div>
    ),
  });
}
