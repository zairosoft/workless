# Buttons

Use `Button` for actions that submit a form, save changes, cancel an action, or
perform a destructive operation. It renders a native `<button>` and uses the
shared Workless button shape, spacing, dark-mode styles, and disabled state.

```tsx
import { Button } from '@/app/views/components/buttons/button';
```

## Default Button

The default variant is `primary`. Use it for the main action on a page or form.

```tsx
<Button type="submit">Save changes</Button>
```

## Variants

| Variant | Use for |
| --- | --- |
| `primary` | Main action, such as save, create, or continue. |
| `secondary` | Secondary non-destructive action. |
| `danger` | Destructive action, such as delete or revoke. |
| `outline` | Low-emphasis action on a white or card surface. |

```tsx
<Button variant="primary">Create company</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete user</Button>
<Button variant="outline">Preview</Button>
```

## Disabled State

Use the native `disabled` attribute while an action cannot be performed.

```tsx
<Button type="submit" disabled>
  Saving…
</Button>
```

## Additional Classes

Pass `className` only for page-specific layout or sizing. Do not replace the
variant classes with a new visual style.

```tsx
<Button className="w-full sm:w-auto" type="submit">
  Sign in
</Button>
```

All standard `button` attributes are forwarded to the rendered element.
