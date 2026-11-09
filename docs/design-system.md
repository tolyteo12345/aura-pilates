# Aura Design System

The visual system for **Aura Studio Pilates & Wellness**, applied to both SvelteKit apps:

| App | Path | Notes |
|---|---|---|
| Admin panel | `resources/apps/admin/` | Studio staff, data-dense screens (tables, forms) |
| Member PWA | `resources/apps/member/` | Members on mobile, bottom navigation |

Both apps use **Tailwind CSS v3 + Skeleton UI v2**. The design system is a custom Skeleton theme plus a few semantic Tailwind aliases. There is no separate component library: you build with Skeleton classes (`btn`, `card`, `input`, `badge`, `table`, …) and the tokens below.

## 1. Brand identity

Minimalist luxury wellness: warm, calm, natural and feminine, with plenty of space.

- **Do:** warm neutrals, generous whitespace, serif headings, soft borders, subtle shadows and short transitions.
- **Don't:** neon or default blue/purple brand colours, heavy gradients, dense layouts, flashy animation, a mix of border radii.
- **Logo:** `static/logo.png` (full lockup: mark + "aura" + "Studio Pilates & Wellness"). In admin it is rendered through `$lib/components/Logo.svelte`.
- **Favicon / mark:** `static/favicon.png`.
- **Name in copy:** "Aura Studio" (short) or "Aura Studio Pilates & Wellness" (full). Code identifiers that still say `laragym` (token keys, package names) are intentionally left as they are.

## 2. Where the tokens live

| File | Role |
|---|---|
| `resources/apps/aura-theme.cjs` | **Single source of truth.** Skeleton theme `aura` plus the semantic Tailwind aliases (`auraExtend`). Both apps import it. |
| `resources/apps/<app>/tailwind.config.cjs` | Registers the theme (`skeleton({ themes: { custom: [auraTheme] } })`) and spreads `auraExtend` into `theme.extend`. |
| `resources/apps/<app>/src/app.html` | `<body data-theme="aura">` and the Google Fonts `<link>`. |
| `resources/apps/<app>/src/app.pcss` | Global base: heading font, focus ring, primary-button hover, input background. Admin also has sidebar and svelte-select styles. |

Change a colour in `aura-theme.cjs` only, never in a component.

## 3. Colour tokens

### Official palette (do not change without design approval)

| Token | HEX | Tailwind utility | Skeleton scale | Use |
|---|---|---|---|---|
| Primary | `#43271F` | `bg-primary`, `text-primary`, `border-primary` | `primary-500` | Headings, primary buttons, navigation |
| Primary Hover | `#745044` | `bg-primary-hover`, `text-primary-hover` | `primary-400` | Hover states, accents, links |
| Secondary | `#D8C4B2` | `bg-secondary`, `border-secondary` | `secondary-500`, `surface-300` | Accent sections, dividers, icon chips, soft badges |
| Background | `#F5F0E8` | `bg-background` | `surface-50` | Page background (Skeleton paints `<body>` with it) |
| Surface | `#FAF8F4` | `bg-surface` | `surface-100` | Cards, panels, modals, tables (Skeleton `.card` / `.table` use it) |
| Text | `#43271F` | `text-primary` (default body colour) | `--theme-font-color-base` | Main content |
| Muted | `#82776E` | `text-muted` | `surface-500`, `tertiary-500` | Secondary and meta text (see accessibility) |
| White | `#FFFFFF` | `bg-white`, `text-white` | n/a | Inputs, text on Primary |

All aliases accept opacity modifiers (`bg-secondary/40`, `border-secondary/60`).
A bare `border` already uses Secondary, so `border`, `border-t` and `border-b` need no colour class.

### Skeleton scale mapping

The numbered scales (`primary-50`…`primary-900`, `surface-50`…`surface-900`) still exist for Skeleton internals and rare edge cases. Prefer the semantic aliases above.

`surface-50` (Background) is deliberately a touch darker than `surface-100` (Surface). That way Skeleton's own roles (body vs card) land on the right brand colours without overriding Skeleton components.

### Functional colours

`success`, `warning` and `error` keep the values of the previous `wintry` theme. Use them only for status: toasts (`variant-filled-success|error`), destructive buttons (`variant-filled-error`), status badges and validation. Never use them as brand decoration.

### Forbidden

- Raw hex/rgb values in components.
- `*-blue-*`, `*-indigo-*`, `*-purple-*`, `*-gray-*`, `*-slate-*` and similar default palettes.
- Per-page themes or a second `data-theme`.

## 4. Typography

| Role | Font | How it applies |
|---|---|---|
| Headings | **Cormorant Garamond** (500, 600, 700) | Every `h1`–`h6` and the Skeleton `.h1`–`.h6` classes, weight 600 by default. Utility: `font-heading`. |
| Body | **DM Sans** (400, 500, 600, 700) | `<body>`, via `--theme-font-family-base`. Utility: `font-body`. |

- Fonts load once per app through one Google Fonts `<link>` in `src/app.html` with `display=swap`. Don't add `@import` or extra font links.
- Use the Skeleton heading classes for page and section titles: `.h1` (`text-3xl` → `md:text-4xl`), `.h2` (`text-2xl` → `md:text-3xl`), `.h3` (`text-xl` → `md:text-2xl`).
- Cormorant has a small x-height. Don't set headings below `text-lg`. For small uppercase "eyebrow" labels written as headings, add `font-body` (DM Sans), e.g. `<h2 class="font-body text-sm font-semibold uppercase tracking-wide text-muted">`.
- Use `font-semibold` rather than `font-bold` for serif headings. Body emphasis can use `font-medium` or `font-semibold`.
- Use the Tailwind type scale (`text-xs` … `text-4xl`). No arbitrary `text-[17px]`.
- Keep semantic HTML: one `h1` per page and no skipped levels where you can avoid it.

## 5. Spacing and layout

- Use the Tailwind spacing scale only. Page padding: `p-4 lg:p-6` (admin) and `px-4 pt-6 pb-4` (member).
- Gap between cards and sections: `gap-6` (admin) and `gap-3` to `gap-4` (member grids). Leave room around elements rather than packing them.
- Admin content width: forms use `lg:max-w-1200` (custom `75rem` token). Lists may span full width.
- Member: single column, mobile first. `main` reserves bottom-nav space with `.with-bottom-nav`, and `.safe-bottom` handles the iOS safe area.

## 6. Radius and elevation

| Token | Value | Applies to |
|---|---|---|
| `--theme-rounded-base` (`rounded-token`) | pill (`9999px`) | Buttons, badges, text inputs |
| `--theme-rounded-container` (`rounded-container-token`) | `12px` | Cards, modals, tables, selects, textareas |

- Use `rounded-container-token` for custom containers. Don't add `rounded-lg` or `rounded-xl` on buttons or inputs. Member cards may use `rounded-2xl` for the softer mobile look; stick to that one value.
- Shadows stay subtle: `shadow-sm` for cards and `shadow-lg` only for floating layers (modals, the dashboard cards that already use it). Never `shadow-2xl`.

## 7. Buttons

Always use Skeleton `btn` / `btn-icon` with a variant:

| Intent | Classes |
|---|---|
| Primary action | `btn variant-filled-primary` (hover switches to Primary Hover automatically) |
| Secondary action | `btn variant-filled-secondary` or `btn variant-ghost-primary` |
| Neutral / dark | `btn variant-filled` |
| Destructive | `btn variant-filled-error` |
| Icon action | `btn-icon variant-filled-primary` / `variant-filled-error` |

- Text colour comes from the theme's `--on-*` tokens. Don't add `text-white` to new secondary buttons, because the on-secondary colour is Primary.
- Disabled state: the `disabled` attribute. Skeleton styles it.
- One primary button per form or section. Put it on the right in admin forms (existing pattern: Cancel on the left, Submit on the right).

## 8. Cards

- Use `card` (Surface background, container radius) plus padding `p-4 lg:p-6`, and `card-header` / `card-footer` for structure.
- Add `bg-surface` explicitly when the parent is also a card or when overriding a stray background.
- Separate areas inside a card with `border-t` / `border-b` (Secondary by default).
- For an emphasised card (for example the member's active subscription), use `bg-primary` with white text and `text-secondary` labels. Don't use gradients.
- Empty states: `bg-background` with a border and centred text.

## 9. Forms

- Wrap each field as `<label class="label"><span>Label</span><input class="input" /></label>`. Use `.textarea` and `.select` for those controls.
- Inputs are white on Surface cards. The border is `surface-400`, which keeps the 3:1 non-text contrast against white, and turns Primary on focus. All of this is global, so don't restyle per page.
- svelte-select components (`*Select.svelte`) are themed globally in admin `app.pcss` through their CSS variables.
- Validation and errors: `variant-filled-error` alerts or toasts, or `text-error-500` helper text.
- Labels stay in Text (`text-primary`). Muted is only for optional hints.

## 10. Modals and dialogs

- Admin: compose `Modal` + `ModalHeader` + `ModalBody` + `ModalFooter` + `ModalClose` from `$lib/components`. Don't build a new modal shell.
- Surface background, container radius, `border-b` / `border-t` dividers. Footer actions follow the button rules.

## 11. Navigation

- **Admin sidebar** (`Navigation.svelte`, `#sidebar-left`, mobile `Drawer`): `bg-primary` with white text. Hover uses `bg-primary-hover`. The active item uses `bg-primary-hover` plus a Secondary inset bar.
- **Admin header** (`Header.svelte`): Surface bar with a Secondary bottom border and the "Aura" serif wordmark.
- **Member bottom nav** (`BottomNav.svelte`): Surface bar with a Secondary top border. The active tab is `text-primary font-semibold` and inactive tabs are `text-muted`.

## 12. Responsive rules

- Mobile first. Admin breakpoints in use: `lg` (sidebar appears, two-column dashboard) and `md` (heading size step).
- Never remove an existing responsive class when restyling.
- Tap targets in the member app must be at least 44px high (`btn` default, bottom nav `h-16`).
- Tables in admin sit inside `.table-container` for horizontal scroll.

## 13. Accessibility

Measured contrast ratios:

| Pair | Ratio | WCAG |
|---|---|---|
| Primary text on Background | 11.95:1 | AAA |
| Primary text on Surface | 12.78:1 | AAA |
| White on Primary (buttons, sidebar) | 13.56:1 | AAA |
| White on Primary Hover | 7.06:1 | AAA |
| Primary Hover text on Surface (links) | 6.66:1 | AA+ |
| Primary text on Secondary | 8.04:1 | AAA |
| **Muted on Background** | **3.85:1** | **Large text only** |
| **Muted on Surface** | **4.11:1** | **Large text only** |
| **Muted on White** | **4.36:1** | **Large text only** |

- **Muted (`#82776E`) is below 4.5:1 on every brand background.** Use it only for non-essential meta text (timestamps, helper hints, counters) or for text that is at least 24px regular or 18.66px bold. Body copy, labels and anything a user needs must use `text-primary`. A darker Muted, roughly `#6F655D` (about 5:1), is waiting on design approval; if approved, change it only in `aura-theme.cjs`.
- Focus: every focusable element gets a 2px Primary Hover outline through `:focus-visible` (global). In the admin sidebar it is Secondary. Never remove outlines without a visible replacement.
- Don't rely on colour alone. Status badges always include the status text.
- Images need `alt` text (the logo uses "Aura Studio Pilates & Wellness"). Decorative SVG icons sit inside labelled links or buttons.

## 14. Creating a new page

1. Read this document and check `src/lib/components/` for an existing component first (`StatisticsCard`, `Status`, `SubscriptionCard`, `Modal*`, `*Select`, `SkeletonLoader`, `BottomNav`, …).
2. Admin: copy the structure of an existing CRUD page (`routes/(admin)/branches/`). That means `<div class="p-4 lg:p-6">`, then `<div class="card bg-surface p-4 lg:p-6">`, then `<header class="card-header mb-6 flex items-center"><h3 class="h3">…</h3>`.
3. Member: put the page under `(app)` (authenticated, with bottom nav) or `(auth)`. Use `px-4 pt-6 pb-4`, a serif page title, `font-body` eyebrow section labels, and `card bg-surface border border-secondary/60 rounded-2xl` cards.
4. Use only the semantic tokens from section 3 plus Skeleton variants. No hex values, no default Tailwind palettes, no page-level theme.
5. Before opening a PR, run `npm run check`, `npm run lint` and `npm run build` in the app. Tab through the page to check focus, and check it at 375px and ≥1024px.
