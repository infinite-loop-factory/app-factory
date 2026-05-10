# Country Tracker — DESIGN.md

Direction: **Stitch Hybrid**. Inherits the existing Stitch design system
(amber accent, white/cream surface, Plus Jakarta Sans, card-based layout)
and removes the AI-slop residue (rainbow per-row icons, identical 2-stat hero,
nested decoration).

Source: Stitch project `13273652130168901163` ("Country List Home Screen", 2025-12-27).

---

## 1. Principles

1. **Honor the Stitch baseline.** Cards, amber accent, Plus Jakarta Sans, and the lightning-bolt-on-amber-tint hero card are intentional and kept.
2. **Cut slop, keep tone.** Rainbow Settings icons → unified neutral. Identical 2-stat hero → asymmetric hierarchy. Decorative cards inside cards → flat sections.
3. **Single accent.** Amber is the only chromatic color. Status colors (success/warning/danger) remain functional only.
4. **Map first, chrome second.** The map and country list are the heroes. Chrome serves them.
5. **CJK parity.** Korean and English render with equal hierarchy; Pretendard Variable on web for ko, Plus Jakarta Sans for en, system stack on native.
6. **Light↔dark symmetry.** Both modes are first-class.

---

## 2. Color Tokens

Reuse existing primary palette (already amber). Token names map to NativeWind semantic classes already wired in `src/constants/color-tokens.ts`.

### Light mode

| Token | Hex | NativeWind | Role |
|---|---|---|---|
| Surface — Cream | `#FAF7F2` | `bg-background-50` | Page background |
| Surface Raised — Paper | `#FFFFFF` | `bg-background-0` | Cards, list rows, sheets |
| Ink — Near Black | `#1A1D24` | `text-typography-900` | Body text, headings |
| Ink Muted — Slate 600 | `#4B5363` | `text-typography-600` | Secondary text |
| Ink Subtle — Slate 400 | `#8B93A1` | `text-typography-500` | Tertiary, placeholders, dividers-as-text |
| Edge — Hairline | `#E5E5DE` | `border-outline-100` | Borders |
| Amber 500 — Saffron | `#E69317` | `bg-primary-500` | Primary accent (CTA fab, accent bar, key badge) |
| Amber 600 — Roasted | `#B37211` | `bg-primary-600` | Pressed |
| Amber 50 — Tint | `#FFF6E5` | `bg-primary-50` | Accent surface (logo card bg, badges) |
| Success | `#1F8A4C` | `text-success-600` | Auto-Sync OK, visa OK |
| Warning | `#C97A0F` | `text-warning-600` | Approaching visa limit |
| Danger | `#B5341E` | `text-error-600` | Over-stay, log-out destructive |

### Dark mode

| Token | Hex | Role |
|---|---|---|
| Surface — Graphite | `#0E1117` | Page background |
| Surface Raised | `#161B26` | Cards |
| Ink — Bone | `#F2F0E8` | Body text |
| Ink Muted | `#B7BDC9` | Secondary |
| Edge | `#242936` | Borders |
| Amber 400 — Raised | `#FFA82D` | Primary accent (raised in dark) |
| Amber 950 — Tint Dark | `#3A2406` | Accent surface |

### Banned

- Gradient orbs/blobs as decoration (the original `absolute -top-16 …` blobs are removed)
- Per-row colored icon backgrounds outside the brand amber (rainbow Settings)
- Mesh gradients
- Pure `#000` / `#FFF` body
- New accent hues (no purple, no teal — even from Stitch source)

---

## 3. Typography

### Stack

```
Web:    "Plus Jakarta Sans", "Pretendard Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Native: System (San Francisco / Roboto)
```

Plus Jakarta Sans for Latin (matches Stitch source). Pretendard Variable as the CJK fallback for ko text. Native ships system stack — no custom font bundled (perf budget).

### Scale (mobile baseline)

| Token | Size / LH | Weight | Use |
|---|---|---|---|
| Display | 32 / 38 | 700 | Hero stat numbers (12, 452) |
| H1 | 28 / 36 | 700 | Screen title (Settings, My Travels) |
| H2 | 22 / 30 | 700 | Card heading |
| H3 | 18 / 26 | 600 | Section title |
| Body | 16 / 24 | 400 | Default body |
| Body Strong | 16 / 24 | 600 | Emphasized body |
| Small | 14 / 20 | 400 | Meta, captions, list dates |
| Eyebrow | 12 / 16 | 600 | Section labels (PREFERENCES, DATA & SYNC), uppercase + tracking-wide |
| Tabular | 16 / 24 | 600 | Day-count badges (`tabular-nums`) |

CJK rule: line-height ×1.1 on headings, ×1.05 on body. Eyebrows uppercase only in Latin; Korean eyebrows stay sentence case.

---

## 4. Spacing & Grid

8px base. Tokens: `0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 80`.

### Breakpoints

| Name | Min | Layout |
|---|---|---|
| sm | 375 | Single column, edge-to-edge cards |
| md | 768 | Two-column lists, side rails |
| lg | 1024 | Map + side panel |
| xl | 1440 | Centered max-width 1280 |

### Page rhythm

- Screen padding: 16px (sm), 24px (md+)
- Section gap: 24px between sections
- Card inner padding: 16/20px
- Between cards: 12px
- Eyebrow → first row: 12px

---

## 5. Surfaces & Elevation

Three surface levels:

| Level | Light | Dark | Use |
|---|---|---|---|
| 0 — Page | Cream | Graphite | Screen bg |
| 1 — Card | Paper | Slate 900 | Cards, list rows |
| 2 — Modal | Paper + soft shadow | Slate 900 + hairline | Sheets, dialogs |

**Login card is the special case.** It sits on Page (Level 0) with a 1.5px amber accent bar at top + soft shadow — this is the Stitch signature and is preserved.

**No nested cards.** A card never contains another card. Use dividers for sub-sections.

Shadow (light only):

```
soft-1: 0 1px 2px rgba(20,23,31,0.04), 0 4px 12px rgba(20,23,31,0.06)
soft-2: 0 1px 2px rgba(20,23,31,0.04), 0 8px 24px rgba(20,23,31,0.08)
```

Dark mode: replace shadow with hairline border only.

Border radius scale: `8 | 12 | 16 | 999`. Default card 12, login card 16. Avoid 20+.

---

## 6. Components

Built on gluestack-ui v3 + NativeWind. Tokens above are the source of truth.

### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary FAB | Amber 500 | Paper | none | Amber 600 |
| Apple | Near Black | Paper | Near Black | typography-800 |
| GitHub | Near Black | Paper | Near Black | typography-800 |
| Google | Paper | Near Black | outline-200 | background-50 |
| Default | transparent | Ink | 1px Edge | background-50 |
| Destructive (Log Out) | transparent | Danger | 1px Danger | error-50 |

Height: 48 (touch target ≥ 44). Radius `xl` (12px). Active state: brightness −8%.

### Input

44–48 height, 1px Edge, 12 radius. Focus: 2px Amber 500 outer ring, no border color shift.

### List row (settings, country list)

Height ≥ 56. Single icon column (24×24 icon on transparent or unified neutral background), label (Body), trailing value (Body Muted) + Chevron 20.

**Settings rule (anti-slop):** icon background uses **only one of** `bg-primary-50` (default for product features), `bg-success-50` (sync features), `bg-error-50` (destructive features). No purple, no teal, no green-for-licenses-and-orange-for-home-country randomness. Icon stroke is always `text-typography-700`.

### Card

Surface 1, radius 12, padding 16/20, 1px hairline border in both modes. Soft-1 shadow on light only.

**Login card variant**: radius 16, soft-2 shadow, 1.5px Amber 500 accent bar at top edge (the Stitch signature).

### Stat card

White surface, radius 12, padding 16/20, hairline border. Header row: 18×18 icon (Amber stroke) + eyebrow (uppercase, 12/600). Number: Display (32/700, tabular).

**Anti-slop hierarchy rule**: when two stat cards appear side-by-side, the primary metric is `flex: 2` and the secondary `flex: 1`. Equal-width side-by-side stats are not allowed (this fixes the Stitch home's identical-pair anti-pattern).

### Filter chip

Height 36, radius 999. Active: Near Black bg + Paper text. Rest: transparent + 1px Edge + Ink Muted.

Sort axis (recent / mostDays) and Filter axis (continents) must be visually separated — never one row of mixed semantics. Use a bullet `·` or full divider between them.

### Day-count badge

Pill, radius 999, padding 4/10. Default: `bg-primary-50` + `text-primary-600`. When `>= 30 days`: `bg-primary-500` + `text-typography-0` (filled, emphasized).

### Map markers

Visited: Amber 500 dot, 6px, 1px Paper halo (light) / 1px Graphite halo (dark).
Selected: Amber 500 dot, 10px, 2px halo + 1px Amber 600 ring.

### Bottom tab bar

White surface, hairline top border, 64 height. Active tab: Amber 500 icon + Amber 500 label. Inactive: Ink Muted icon + Ink Subtle label.

### Pro badge / status badge

Pill, radius 999, padding 2/8, eyebrow type. Pro: `bg-primary-50` + `text-primary-600`. Status badges use Success/Warning/Danger 50-tint bg + 700-tint text.

---

## 7. Motion

| Use | Duration | Easing |
|---|---|---|
| Press, hover | 120ms | ease-out |
| Toggle, expand | 200ms | cubic-bezier(0.2, 0.8, 0.2, 1) |
| Page transition | 300ms | ease-in-out |
| Map fly-to | 600ms | ease-in-out |

- transform + opacity only for 60fps
- Never bounce on UI controls
- Respect `prefers-reduced-motion`: disable parallax, disable map fly-to, snap to position
- Parallax is opt-in per screen — not default on home (Stitch home uses parallax; we keep it but gated)

---

## 8. Accessibility

- WCAG 2.2 AA minimum
- Touch target ≥ 44×44 (we use 48)
- Visible focus state on every interactive element (2px Amber 500 outer ring + 2px offset)
- Form inputs always paired with label or `accessibilityLabel`
- Dynamic type respected up to 200% (test at 200% on mobile)
- Color is never the only signal (visa status uses icon + label, not just hue)
- Reduced motion disables parallax, map fly-to, decorative transitions

---

## 9. Agent Prompt Guide

When implementing a screen:

1. **Surface**: Cream page (`bg-background-50`); Paper cards (`bg-background-0`) only when grouping is needed. Login card is special — keep amber accent bar.
2. **Type**: Plus Jakarta Sans on web; system on native. Body never below 16px on mobile.
3. **Color**: Ink for text, Amber for accent only. Status colors only when conveying status. **No rainbow per-row icons** — Settings menu uses one of three semantic tints (primary-50, success-50, error-50).
4. **Spacing**: 8px grid. 16/24 page padding, 12 between cards, 24 between sections.
5. **Components**: gluestack-ui v3 primitives. Buttons 48 high, inputs 48 high, radius 12. Cards radius 12 (login card 16).
6. **Hero rule**: When two stat cards appear, give the primary `flex-2` and secondary `flex-1`. Never equal-width.
7. **Motion**: 120ms press, 200ms toggle. transform+opacity only. Honor reduced-motion.
8. **A11y**: 48 touch target, focus ring, label every input, contrast AA.

### Forbidden

- Two corner blobs / orbs (any radial decoration outside card chrome)
- Background gradient on full screen
- Glassmorphism + blur (the only blur is inside specific UI like map controls)
- Card-inside-card
- Per-row colored icon backgrounds (rainbow Settings)
- Identical equal-width 3-stat or 2-stat hero rows
- Body text below 16px on mobile
- Amber on body text in light mode below 18px
- Custom font on native runtime
- Mixing sort and filter axes in one chip row

---

## 10. Divergences from Stitch source

What we keep from Stitch:
- Cream page + Paper cards
- Amber accent (already in our token palette)
- Login card with amber 1.5px top accent bar + lightning/logo on amber-tint chip
- Plus Jakarta Sans
- Day-count amber-fill badge for emphasis (>= 30 days)
- FAB-style amber primary action
- Bottom tab nav with amber active
- Filter chip dark-active style

What we drop:
- Rainbow per-row icon backgrounds in Settings → unified to 3-tint semantic system
- Equal-width 2-stat hero on Home → asymmetric `flex-2 / flex-1`
- Card-on-card decoration anywhere outside login

What we add (not in Stitch):
- Apple, Google, GitHub three-provider login (Stitch had Google + GitHub only)
- Brand-correct multi-color Google "G" icon
- Brand-correct Apple silhouette icon
- Explicit hover/active states for solid-dark buttons (Apple, GitHub)
- CJK typographic rules (line-height multipliers, ko fallback to Pretendard)
- Reduced-motion gates on parallax and map fly-to
