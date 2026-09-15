# Badges

Badges communicate a compact status, category, or count. All badge components
accept `children`, an optional `tone`, and an optional `className`.

```tsx
import { BadgeBasic } from '@/app/views/components/badges/badge-basic';
```

## Default Badge

Use `BadgeBasic` as the starting point for a solid status badge.

```tsx
<BadgeBasic tone="success">Active</BadgeBasic>
```

## Badge Styles

| Component | Appearance |
| --- | --- |
| `BadgeBasic` | Solid background. |
| `BadgeSoft` | Soft background with colored text. |
| `BadgeOutlined` | Border with transparent background. |
| `BadgeRounded` | Pill-shaped solid badge. |
| `BadgeDot` | Solid badge with a leading status dot. |
| `BadgeSoftDot` | Soft badge with a leading status dot. |
| `BadgeGlow` | Solid badge with a subtle colored glow. |

```tsx
import { BadgeDot } from '@/app/views/components/badges/badge-dot';
import { BadgeOutlined } from '@/app/views/components/badges/badge-outlined';
import { BadgeSoft } from '@/app/views/components/badges/badge-soft';

<BadgeSoft tone="warning">Pending</BadgeSoft>
<BadgeOutlined tone="info">Draft</BadgeOutlined>
<BadgeDot tone="success">Online</BadgeDot>
```

## Tones

Available tones are `default`, `primary`, `secondary`, `info`, `success`,
`warning`, `error`, `dark`, and `light`.

```tsx
<BadgeBasic tone="primary">New</BadgeBasic>
<BadgeBasic tone="warning">Needs review</BadgeBasic>
<BadgeBasic tone="error">Failed</BadgeBasic>
```

## Custom BadgeBase

Use `BadgeBase` when the supplied badge wrappers do not fit the required
combination.

```tsx
import { BadgeBase } from '@/app/views/components/badges/badge-base';

<BadgeBase tone="info" style="outline" rounded dot>
  Processing
</BadgeBase>
```
