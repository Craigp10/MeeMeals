# MeeMeals: switch to the warm color palette

**Goal:** Make the app feel warmer and more inviting, like a kitchen, so people want to plan meals and share them. This change covers colors plus a few small style updates (fonts, corner radius, shadows). **Layout, components and behavior stay the same.**

## Instructions for the agent

1. Find where colors are defined: CSS variables, a Tailwind config, a theme file, styled-components or hardcoded hex values in components.
2. If colors are hardcoded in several places, first pull them into one set of design tokens (CSS custom properties or the existing theme object). Then change the values in that one place.
3. Replace each color with its new value from the tables below, going by what the color is used for. Existing hex values may not match the "Current" column exactly, so match by role.
4. Keep the blue keyboard focus outline as it is (see "Accessibility").
5. Don't change layout, spacing scale, copy or behavior.
6. Run the app and check the Home, Meals and Calendar screens. Report every file you changed.

---

## 1. Core palette

| Token | Current (approx.) | **New** | Where it's used |
|---|---|---|---|
| `--color-header-bg` | `#0B1F3A` (navy) | **`#2A1F1A`** (espresso) | Top app bar with the "MeeMeals" logo. **This is the biggest change.** |
| `--color-header-fg` | `#FFFFFF` | **`#FFFBF5`** | Logo and icons in the header |
| `--color-primary` | navy / forest green | **`#B4532A`** (terracotta) | Main buttons, active nav item, links, selected/today state |
| `--color-primary-hover` | n/a | **`#8A3D1E`** | Hover/pressed state of primary buttons and links |
| `--color-primary-tint` | n/a | **`#FBE7DC`** | Selected-row background, drag-over highlight, active nav background |
| `--color-primary-border` | n/a | **`#E8B79C`** | Border on tinted areas and today's column |
| `--color-primary-dashed` | n/a | **`#D9936F`** | Dashed drop-zone outline |
| `--color-bg` | `#FFFFFF` / `#F9F9F9` | **`#FAF3EA`** (warm cream) | Page background behind everything |
| `--color-surface` | `#F9F9F9` | **`#FFFBF5`** | Main panel ("Meals for the Week!") and sidebar |
| `--color-card` | `#FFFFFF` | **`#FFFFFF`** (keep) | Meal cards. Keep them pure white so they stand out on the cream background. |
| `--color-text` | `#0B1F3A` (navy) | **`#2A1F1A`** | Headings, day names, meal names |
| `--color-text-secondary` | gray | **`#5A4A40`** | Dates, row labels (Breakfast/Lunch…), sidebar nav text |
| `--color-text-muted` | light gray | **`#75665C`** | Placeholder text and hints |
| `--color-text-status` | n/a | **`#3A2D26`** | Status and aria-live messages |
| `--color-border` | `#E5E5E5` | **`#E2DCD0`** | Card borders, dividers, sidebar edge |
| `--color-border-strong` | n/a | **`#CFC7B8`** | Input borders, stronger dividers |

## 2. Meal-type tag colors

Each meal type gets its own pair of text and background colors. The colors differ in lightness as well as hue, so users who can't tell some hues apart can still distinguish them.

| Meal type | Text (`fg`) | Background (`bg`) | Note |
|---|---|---|---|
| Breakfast | **`#7A4A00`** | **`#FBEBC8`** | Amber (unchanged) |
| Lunch | **`#1F5A48`** | **`#D7EBE2`** | Sage (unchanged) |
| Dinner | **`#7E2A4A`** | **`#F5DCE5`** | Berry. Changed from rust (`#8F3316`/`#F6DDD1`) because rust clashed with the new terracotta primary. |
| Snack | **`#5A3F8C`** | **`#EAE2F4`** | Warm plum. Changed from indigo (`#45408F`/`#E3E1F5`). |

## 3. Shadows

Replace cool gray or black shadows with warm brown ones:

```css
/* before */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
/* after */
box-shadow: 0 4px 12px rgba(42, 31, 26, 0.18);
```

## 4. Typography (recommended)

The app currently uses Helvetica or a similar font, which reads as neutral and corporate. Change it to:

- **Headings** ("Meals for the Week!", page titles): `'Fraunces', Georgia, serif`, weight 600
- **Body and UI**: `'Atkinson Hyperlegible', system-ui, sans-serif`

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
```

## 5. Shape (recommended)

- Meal cards and panels: `border-radius: 12px`
- Buttons: `border-radius: 9px`
- Touch targets: at least **44px** high

## 6. Accessibility

- **Keep** the blue keyboard focus outline: `outline: 3px solid #1D4ED8; outline-offset: 2px` on `button`, `input` and `a` with `:focus-visible`. Blue stands out clearly against the warm palette, so it stays blue on purpose.
- Every text/background pair above meets WCAG AA (4.5:1). Terracotta `#B4532A` on white is about 5:1. Don't lighten the primary color for text or button labels.

---

## Ready-to-paste CSS tokens

```css
:root {
  /* Brand */
  --color-header-bg: #2A1F1A;
  --color-header-fg: #FFFBF5;
  --color-primary: #B4532A;
  --color-primary-hover: #8A3D1E;
  --color-primary-tint: #FBE7DC;
  --color-primary-border: #E8B79C;
  --color-primary-dashed: #D9936F;

  /* Surfaces */
  --color-bg: #FAF3EA;
  --color-surface: #FFFBF5;
  --color-card: #FFFFFF;

  /* Text */
  --color-text: #2A1F1A;
  --color-text-secondary: #5A4A40;
  --color-text-muted: #75665C;
  --color-text-status: #3A2D26;

  /* Borders */
  --color-border: #E2DCD0;
  --color-border-strong: #CFC7B8;

  /* Meal types */
  --meal-breakfast-fg: #7A4A00; --meal-breakfast-bg: #FBEBC8;
  --meal-lunch-fg:     #1F5A48; --meal-lunch-bg:     #D7EBE2;
  --meal-dinner-fg:    #7E2A4A; --meal-dinner-bg:    #F5DCE5;
  --meal-snack-fg:     #5A3F8C; --meal-snack-bg:     #EAE2F4;

  /* Effects */
  --shadow-card: 0 4px 12px rgba(42, 31, 26, 0.18);
  --focus-ring: #1D4ED8;

  /* Type & shape */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Atkinson Hyperlegible', system-ui, sans-serif;
  --radius-card: 12px;
  --radius-button: 9px;
}
```

### If the project uses Tailwind

Add this to `tailwind.config.js` under `theme.extend.colors`:

```js
meemeals: {
  espresso: '#2A1F1A',
  terracotta: { DEFAULT: '#B4532A', hover: '#8A3D1E', tint: '#FBE7DC', border: '#E8B79C' },
  cream: '#FAF3EA',
  surface: '#FFFBF5',
  text: { DEFAULT: '#2A1F1A', secondary: '#5A4A40', muted: '#75665C' },
  border: { DEFAULT: '#E2DCD0', strong: '#CFC7B8' },
},
```

Then replace navy or slate classes (for example `bg-slate-900` → `bg-meemeals-espresso`, `text-slate-900` → `text-meemeals-text`).

---

## Done when

- [ ] The header is espresso (`#2A1F1A`), with no navy left anywhere
- [ ] The page background is cream, and meal cards are white with warm shadows
- [ ] The active nav item, primary buttons and today/selected states use terracotta
- [ ] Meal-type tags use the four colors above, with dinner in berry
- [ ] The blue focus outline still shows when tabbing through the page
- [ ] Nothing changed in layout or behavior
