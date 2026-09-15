# Confirmation Modal

`CenterConfirmModal` renders an accessible confirmation dialog in the center
of the page. It uses Alpine directives for visibility and button actions.

```tsx
import { CenterConfirmModal } from '@/app/views/components/modals/confirm.modal';
```

## Required Parent State

The enclosing page must define the boolean state used by `model`.

```tsx
<main x-data="{ showDeleteConfirm: false }">
  {/* Page content */}
</main>
```

## Basic Usage

The modal closes automatically when cancel is selected if `onCancel` is not
provided.

```tsx
<CenterConfirmModal
  model="showDeleteConfirm"
  title="Delete this company?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm="deleteCompany()"
/>
```

## Open the Modal

Use an Alpine click expression to change the state.

```tsx
<Button variant="danger" {...{ 'x-on:click': 'showDeleteConfirm = true' }}>
  Delete company
</Button>
```

## Properties

| Property | Description |
| --- | --- |
| `model` | Alpine boolean state name. Default: `showConfirmModal`. |
| `title` | Required dialog title. |
| `description` | Optional supporting text or JSX. |
| `confirmLabel` | Text for the confirm button. |
| `cancelLabel` | Text for the cancel button. |
| `variant` | `primary` or `danger`. |
| `onConfirm` | Alpine expression run after confirmation. |
| `onCancel` | Alpine expression run when the dialog is dismissed. |
| `locale` | Locale used for default button labels. |

Keep the business operation in an Alpine action, form submit handler, or page
controller. The modal only handles the user confirmation interface.
