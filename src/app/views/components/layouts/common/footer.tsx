export type FooterProps = {
  version?: string;
  year?: number;
};

export function Footer({
  version = process.env.npm_package_version ?? '1.0.0',
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className="shrink-0 border-t border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800">
      <div className="workless-main-container flex h-[64px] w-full items-center justify-between px-[var(--layout-page-gutter)] text-sm font-medium text-slate-500 dark:text-navy-300">
        <p>Workless © {year}</p>
        <p>เวอร์ชัน {version}</p>
      </div>
    </footer>
  );
}
