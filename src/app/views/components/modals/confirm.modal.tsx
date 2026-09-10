import type { ReactNode } from 'react';

export type CenterConfirmModalProps = {
  /** The Alpine boolean state that controls the modal visibility. */
  model?: string;
  /** An optional stable DOM id for tests and accessibility relationships. */
  id?: string;
  title: string;
  description?: ReactNode;
  locale?: AppLocale;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Alpine expression executed after the user confirms. */
  onConfirm?: string;
  /** Alpine expression executed when the user dismisses the modal. */
  onCancel?: string;
  variant?: 'primary' | 'danger';
};

/**
 * A centered confirmation modal for server-rendered pages that use Alpine.
 * The enclosing Alpine component must define the boolean named by `model`.
 */
export function CenterConfirmModal({
  model = 'showConfirmModal',
  id = 'center-confirm-modal',
  title,
  description,
  locale = 'en',
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'primary',
}: CenterConfirmModalProps) {
  const { t } = createTranslator(locale);
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const dismissAction = onCancel ?? `${model} = false`;
  const confirmAction = onConfirm ?? dismissAction;
  const confirmClassName =
    variant === 'danger'
      ? 'bg-danger hover:bg-danger/90 focus:bg-danger/90'
      : 'bg-primary hover:bg-primary-focus focus:bg-primary-focus';

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      {...{
        'x-cloak': '',
        'x-show': model,
        'x-on:keydown.escape.window': dismissAction,
        'x-transition:enter': 'transition ease-out duration-200',
        'x-transition:enter-start': 'opacity-0',
        'x-transition:enter-end': 'opacity-100',
        'x-transition:leave': 'transition ease-in duration-150',
        'x-transition:leave-start': 'opacity-100',
        'x-transition:leave-end': 'opacity-0',
      }}
    >
      <div
        className="absolute inset-0 bg-slate-900/50 dark:bg-navy-900/70"
        aria-hidden="true"
        {...{ 'x-on:click': dismissAction }}
      />
      <section
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-navy-800"
        {...{
          'x-on:click.stop': '',
          'x-transition:enter': 'transition ease-out duration-200',
          'x-transition:enter-start': 'translate-y-2 scale-95 opacity-0',
          'x-transition:enter-end': 'translate-y-0 scale-100 opacity-100',
          'x-transition:leave': 'transition ease-in duration-150',
          'x-transition:leave-start': 'translate-y-0 scale-100 opacity-100',
          'x-transition:leave-end': 'translate-y-2 scale-95 opacity-0',
        }}
      >
        <h2 id={titleId} className="text-lg font-semibold text-slate-800 dark:text-navy-50">
          {title}
        </h2>
        {description ? (
          <div id={descriptionId} className="mt-2 text-sm text-slate-500 dark:text-navy-200">
            {description}
          </div>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 focus:bg-slate-100 dark:border-navy-500 dark:bg-navy-700 dark:text-navy-100 dark:hover:bg-navy-600"
            {...{ 'x-on:click': dismissAction }}
          >
            {cancelLabel ?? t('common.actions.cancel')}
          </button>
          <button
            type="button"
            className={`btn px-4 py-2 text-white ${confirmClassName}`}
            {...{ 'x-on:click': confirmAction }}
          >
            {confirmLabel ?? t('common.actions.confirm')}
          </button>
        </div>
      </section>
    </div>
  );
}
