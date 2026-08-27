# Foundations & Styling

Reference for the Mizou design-system tokens and how they're wired into Tailwind
for the `ui/` component layer.

**Sources of truth** (nothing below is invented — every value traces back to one of these):
- [`styles/tokens.css`](../styles/tokens.css) — color, spacing, radius, shadow primitives + semantic aliases
- [`styles/app-typography.css`](../styles/app-typography.css) — type scale (Figma → *Type System [App]*)
- [`tailwind.config.ts`](../tailwind.config.ts) — how the above are exposed as Tailwind utilities

Live, interactive version: **Storybook → `UI / Foundations`** (Colors / Typography / Spacing stories),
rendered directly from the resolved Tailwind config so it can't drift from what utilities actually produce.

---

## Color

### Primitives

| Token | Value | Tailwind class |
|---|---|---|
| `slate-1` | `#fcfcfd` | `bg-slate-1` / `text-slate-1` |
| `slate-2` | `#f9f9fb` | `bg-slate-2` |
| `slate-3` | `#f2f2f5` | `bg-slate-3` |
| `slate-4` | `#ebebef` | `bg-slate-4` |
| `slate-5` | `#e4e4e9` | `bg-slate-5` |
| `slate-6` | `#dddde3` | `bg-slate-6` |
| `slate-7` | `#d3d4db` | `bg-slate-7` |
| `slate-8` | `#b9bbc6` | `bg-slate-8` |
| `slate-9` | `#8b8d98` | `bg-slate-9` |
| `slate-10` | `#7e808a` | `bg-slate-10` |
| `slate-11` | `#60646c` | `bg-slate-11` |
| `slate-12` | `#1c2024` | `bg-slate-12` |
| `black` | `#000000` | `bg-black` |
| `white` | `#ffffff` | `bg-white` |

| Accent | Dark | Base | Light |
|---|---|---|---|
| `indigo` | `#3730a3` → `bg-indigo-dark` | `#4f46e5` → `bg-indigo` | `#a5b4fc` → `bg-indigo-light` |
| `rose` | `#be123c` → `bg-rose-dark` | `#f43f5e` → `bg-rose` | `#fecdd3` → `bg-rose-light` |
| `emerald` | `#065f46` → `bg-emerald-dark` | `#34d399` → `bg-emerald` | `#d1fae5` → `bg-emerald-light` |
| `amber` | `#d97706` → `bg-amber-dark` | `#fbbf24` → `bg-amber` | `#fde68a` → `bg-amber-light` |

### Semantic aliases

These resolve to primitives above via CSS custom properties — change the primitive in
`tokens.css` and every semantic + Tailwind usage updates together.

| Group | Token | Resolves to | Tailwind class |
|---|---|---|---|
| **Surface** | `surface-page` | `slate-3` | `bg-surface-page` |
| | `surface-raised` | `slate-1` | `bg-surface-raised` |
| | `surface-emphasis` | `white` | `bg-surface-emphasis` |
| | `surface-overlay` | `slate-2` | `bg-surface-overlay` |
| | `surface-sunken` | `slate-4` | `bg-surface-sunken` |
| **Stroke / border** | `border-subtle` | `slate-3` | `border-stroke-subtle` |
| | `border-default` | `slate-4` | `border-stroke` |
| | `border-strong` | `slate-5` | `border-stroke-strong` |
| | `border-divider` | `slate-6` | `border-stroke-divider` |
| | `border-contrast` | `black` | `border-stroke-contrast` |
| | `border-button` | `slate-8` | `border-stroke-button` |
| **Text** | `text-primary` | `slate-12` | `text-content-primary` |
| | `text-secondary` | `slate-11` | `text-content-secondary` |
| | `text-inverse` | `white` | `text-content-inverse` |
| **Icon** | `icon-fill-default` | `slate-9` | `text-icon` (fill via `currentColor`) |
| **Interactive** | `interactive-primary` | `indigo-base` | `bg-interactive-primary` |
| | `interactive-primary-hover` | `indigo-dark` | `bg-interactive-primary-hover` |
| | `interactive-secondary` | `slate-3` | `bg-interactive-secondary` |
| | `interactive-secondary-hover` | `slate-4` | `bg-interactive-secondary-hover` |
| | `interactive-secondary-active` | `slate-5` | `bg-interactive-secondary-active` |
| | `interactive-secondary-clicked` | `slate-12` | `bg-interactive-secondary-clicked` |
| **Feedback** | `feedback-info` / `-bg` / `-bg-subtle` | `indigo-base` + tints | `bg-feedback-info(-bg / -bg-subtle)` |
| | `feedback-success` / `-bg` | `emerald-base` + tint | `bg-feedback-success(-bg)` |
| | `feedback-error` / `-bg` | `rose-base` + tint | `bg-feedback-error(-bg)` |
| | `feedback-warning` / `-bg` | `amber-base` + tint | `bg-feedback-warning(-bg)` |
| **Overlay** | `overlay-scrim` | `rgba(0,0,0,0.4)` | `bg-scrim` |

### Gradient

`--ocean-gradient-diagonal`: `linear-gradient(261deg, var(--feedback-success) -66.17%, var(--feedback-info) 154.72%)`
→ `bg-ocean-diagonal`

---

## Typography

Font: **Nunito Sans** (Google Fonts, weights `300 / 400 / 500 / 600 / 700 / 800` all loaded — see
[`.storybook/preview-head.html`](../.storybook/preview-head.html)), falling back to
`ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif`.

### Type scale (Figma → Type System [App])

| Tailwind class | Size | Line height | Letter spacing | Weight |
|---|---|---|---|---|
| `text-h1` | 45px | 54px | -0.63px | 800 (extrabold) |
| `text-h2` | 38px | 48px | -0.42px | 700 (bold) |
| `text-h3` | 32px | 42px | -0.24px | 700 (bold) |
| `text-h4` | 27px | 36px | -0.09px | 700 (bold) |
| `text-lead` | 27px | 36px | -0.09px | 400 (normal) |
| `text-lg` | 19px | 30px | 0.15px | 400 (normal) |
| `text-base` | 16px | 24px | 0.24px | 400 (normal) |
| `text-sm` | 13px | 18px | 0.33px | 400 (normal) |
| `text-xs` | 11px | 18px | 0.39px | 500 (medium) |

### Font weight utilities

| Class | Value | Note |
|---|---|---|
| `font-light` | 300 | |
| `font-normal` | 400 | |
| `font-medium` | 500 | Tailwind's standard value. **Not** the same as the legacy `--fw-medium: 600` token still used by the 17 existing CSS files in `styles/` — kept separate deliberately so the new layer follows Tailwind convention without restyling old components. |
| `font-semibold` | 600 | |
| `font-bold` | 700 | |
| `font-extrabold` | 800 | |

---

## Spacing

`styles/tokens.css` → `--spacing-*`. Applies to `p-*`, `m-*`, `gap-*`, `space-x-*`, `space-y-*`, etc.

| Class suffix | Value |
|---|---|
| `3xs` | 4px |
| `2xs` | 8px |
| `xs` | 12px |
| `sm` | 16px |
| `md` | 24px |
| `lg` | 32px |

---

## Border radius

`styles/tokens.css` → `--radius-*`.

| Class | Value |
|---|---|
| `rounded-none` | 0 |
| `rounded-sm` | 4px |
| `rounded-md` | 8px |
| `rounded-lg` | 12px |
| `rounded-xl` | 16px |
| `rounded-2xl` | 20px |
| `rounded-full` | 999px |
| `rounded-input` | = `rounded-md` (8px) |
| `rounded-modal` | = `rounded-md` (8px) |
| `rounded-container` | = `rounded-lg` (12px) |

---

## Shadows

`styles/tokens.css` → `--shadow-*`.

| Class | Value |
|---|---|
| `shadow-none` | none |
| `shadow-1` | `0 1px 0 rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.05)` |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)` |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -2px rgba(0,0,0,0.05)` |
| `shadow-2xl` | `0 25px 50px -12px rgba(0,0,0,0.25)` |

---

## Other tokens

| Token | Value | Tailwind |
|---|---|---|
| `--alpha-disabled` | 0.5 | `opacity-disabled` |

---

## How the token scale is enforced

- **`ui/` and `stories/ui/` only** — Tailwind's `content` glob and the ESLint config are both scoped
  there, so none of this touches the 52 existing HTML/TS components in `components/` + `styles/`.
- **Color / spacing / radius / fontSize / fontWeight / boxShadow are set at the top level of
  `theme`, not under `theme.extend`** — this *replaces* Tailwind's own defaults instead of adding
  to them. Without this, escape hatches like `p-4`, `h-16`, `bg-red-500` would still work and
  generate real CSS despite not being on-scale.
- **`tailwindcss/no-arbitrary-value` (ESLint, error)** blocks bracket-syntax overrides like
  `p-[13px]` or `text-[#4f46e5]` — every value must come from a named token above.
- **`tailwindcss/no-custom-classname` (ESLint, warning)** flags class strings that aren't
  recognized Tailwind utilities (typos, or classes from other libraries mixed into the same
  string) — a softer signal, not a hard block, since Phase 2 shadcn components will legitimately
  mix in library-generated class names.
- **Preflight is disabled** (`corePlugins.preflight: false`) — Tailwind's base-style reset never
  loads, so it can't restyle buttons, headings, or borders in the pre-existing stories.
