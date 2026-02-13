# Home Screen Design Specification

> Merged from: `home-screen-ui-prompt.md`, `home-screen-v0-prompt.md`, `home-screen-ui-compliance.md`

---

## Overview

The home screen lets users input departure, arrival, and optional via stations, then search for a route. The station block is a **single horizontal row** whose shape stays the same across all screens — only its vertical position changes.

---

## 1. Basic Fields (Always Visible)

- **Departure field**: Label "출발역", placeholder "출발역 선택". Tap → departure selection panel.
- **Arrival field**: Label "도착역", placeholder "도착역 선택". Tap → arrival selection panel.
- "Add via" is hidden until at least one station is selected.

## 2. Via Station Rules

- Shown when **departure or arrival** has a value.
- Max **3** via stations. At 3: disable or show "최대 3개".
- Tap → via selection panel.

## 3. Layout Modes

### Mode A — Empty (Centered)

- **Condition**: No stations selected at all.
- Departure + arrival fields in one row, **vertically centered**.
- No title, subtitle, or search button.

### Mode B — Expanded (Top-Aligned)

- **Condition**: Any station is selected.
- **Animated transition** (easeInEaseOut ~300ms) from center to top.
- Title ("경로 찾기") + subtitle + station block at top + "Search & more" section with "경로 찾기" button below.
- Search button enabled only when **both** departure and arrival are set.

## 4. Selection Screen Block Positions

| Screen | Block Position |
|--------|---------------|
| Departure selection | Always at top |
| Arrival selection | Always at top |
| Via selection | Split: departure row at top, arrival row at bottom, via list in middle |

## 5. Search Button

- Only in Mode B (inside "Search & more" section).
- Enabled when `departure !== null && arrival !== null`.
- Disabled style: gray background, muted text, not clickable.

---

## V0 Prompt (English, Copy-Paste Ready)

```
Create a modern, minimal mobile-first UI for a subway route finder app's home screen and selection flow.

=== CONTEXT ===
- App: Subway route recommendation (departure → optional via stations → arrival).
- Platform: React / React Native–style components; mobile-first, touch-friendly.
- The main input is a single-row "station block": Departure | (Add via) | Arrival. This block keeps the same shape everywhere; only its vertical position and surrounding content change.

=== HOME SCREEN ===

1) Default state (nothing selected)
- Show only two fields in one horizontal row: Departure and Arrival.
- Labels: "Departure" / "Arrival"; placeholders: "Select departure" / "Select arrival".
- Do not show "Add via" in this state.
- Place this single row in the vertical center of the screen.
- Do not show a page title, subtitle, or search/actions area in this state.

2) Expanded state (at least one station selected)
- Smooth animation: same station row moves from center to top (~300ms ease-in-out).
- At the top: page title + subtitle.
- Below: same single-row block, now at top.
- Below block: "Search & more" section with "Find route" button.
- Button enabled only when both departure and arrival are selected.

3) Add via
- Show "Add via" slot in row only when at least one of departure/arrival is selected.
- Maximum 3 via stations.

4) Station block styling
- One horizontal row: Departure | (Add via) | Arrival.
- Horizontal margin ~24px from screen edges.
- Friendly, compact spacing between cells.

=== SELECTION SCREENS ===

5) Departure / Arrival selection: Block always at top, scrollable list below.
6) Via selection: Departure row top, Arrival row bottom, via list in middle.

=== DESIGN ===
- Clean, minimal, subway-themed. Rounded corners, subtle borders.
- Touch targets ≥44px. Clear disabled states.
- Smooth center-to-top transition (layout animation, not instant jump).
```

---

## Implementation Compliance

All specifications above are implemented in the current codebase:

| Requirement | Status | Code Reference |
|------------|--------|----------------|
| Basic fields with i18n labels/placeholders | ✅ | `station-block.tsx`, `ko.json` |
| Via shown when departure or arrival set | ✅ | `showViaField = !!departure \|\| !!arrival` |
| Max 3 via with disabled state | ✅ | `route-search-context.tsx` `MAX_VIA_STATIONS = 3` |
| Mode A (centered when empty) | ✅ | `RouteSceneLayout` + `RouteGuideTab` |
| Mode B (top + title + search) | ✅ | `RouteSceneLayout` with title/subtitle props |
| Search button enabled only when both set | ✅ | `canSearch = departure !== null && arrival !== null` |
| Selection screen block positions | ✅ | `StationBlock` with `selectingMode` prop |
| Same block shape across all screens | ✅ | Single `StationBlock` component reused everywhere |
