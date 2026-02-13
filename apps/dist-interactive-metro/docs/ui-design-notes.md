# UI Design Notes & Prototype Prompts

> Merged from: `ui-prototype-prompts.md`, `ui-usability-analysis.md`

---

## Design Guidelines

- **Style**: Modern / minimal, subway-themed
- **Colors**: Official Seoul Metro line colors
- **Platform**: Mobile-first (React Native)
- **Icons**: Line-style, clean

### Official Line Colors

| Line | Color | Hex |
|------|-------|-----|
| Line 1 | Dark Blue | `#263C96` |
| Line 2 | Green | `#3CB44A` |
| Line 3 | Orange | `#EF7C1C` |
| Line 4 | Sky Blue | `#00A5DE` |
| Line 5 | Purple | `#996CAC` |
| Line 6 | Brown | `#CD7C2F` |
| Line 7 | Olive | `#747F00` |
| Line 8 | Pink | `#E6186C` |
| Line 9 | Gold | `#BDB092` |

---

## Prototype Screenshots

All screenshots from v0.dev prototype (Jan 25, 2026) are in `prototype/`:

1. **Home screen**: `Screenshot 2026-01-25 at 4.13.45 PM.png`
2. **Departure selection**: `Screenshot 2026-01-25 at 4.14.22 PM.png`
3. **Arrival selection**: `Screenshot 2026-01-25 at 4.14.58 PM.png`
4. **Route results**: `Screenshot 2026-01-25 at 4.15.05 PM.png`
5. **Route detail**: `Screenshot 2026-01-25 at 4.15.26 PM.png`
6. **Additional variant**: `Screenshot 2026-01-25 at 4.16.12 PM.png`

---

## Screen-by-Screen Prompts & Analysis

### Screen 1: Home Screen

**Key decisions**:
- Destination selection is the PRIMARY action (large, prominent card)
- GPS-based departure is SECONDARY (compact info bar: "📍 [Station]에서 출발" + "변경" button)
- "경로 찾기" button at bottom, enabled only when both stations selected

**States**: GPS enabled + auto-selected, GPS disabled, destination not selected, both selected.

### Screen 2: Departure Station Selection (GPS-Based)

**Recommended layout**: Card grid (not circular — more practical for mobile):
- Top: Large card for nearest station (name, distance, walking time, direction, line colors)
- Below: 2-column grid of 3–4 nearby station cards
- "더 많은 역 보기" button → full searchable list
- GPS disabled: Falls back to search + list

**Key improvements over initial design**:
- Added walking time ("200m (도보 3분)")
- Added direction indicator (compass or arrow)
- "현재 위치 재확인" button for GPS refresh

### Screen 3: Arrival Station Selection

**Search-first design**:
- Large search input at top with real-time autocomplete
- Recent selections (horizontal chips, shown only when search is empty)
- Collapsible line filter tabs
- Station list: Name (KO + EN), line badges, station number

### Screen 4: Route Results

**Multiple route option cards**:
- Sort: 시간순, 비용순, 환승순
- List view (default) + comparison view (table-like)
- GPS optimal route: prominent banner + badge + auto-top
- Each card: Time (large, bold) + Cost (equally large) + transfers + distance

**Key insight from usability analysis**: Time and cost must be **equally prominent** — not time-large cost-small.

### Screen 5: Route Detail

**Vertical timeline visualization**:
- Color-coded segments by subway line
- Transfer points: walk time, difficulty, fast-transfer badge
- Summary bar: total time, distance, fare, transfers
- Real-time info section (planned): next train arrival, congestion level
- Actions: save to favorites, share, "다른 경로 보기"

---

## Usability Findings Summary

### High Priority
- Home: Destination selection must be PRIMARY focus
- Home: GPS departure as compact info bar (not equal to destination)
- Route results: Cost and time equally prominent
- Route results: GPS optimal route clearly highlighted
- All screens: Loading / error / empty states required

### Medium Priority
- Departure selection: Walking time + direction info
- Route results: Sort/filter options
- Route results: Comparison view
- Accessibility: Screen reader, keyboard navigation, WCAG AA contrast

### Low Priority
- Route detail: Real-time transit info integration
- Route detail: Line map visualization
- Mobile UX: Swipe gestures, thumb-zone optimization

---

## Error & Edge Cases

| Case | Handling |
|------|----------|
| GPS permission denied | "위치 권한이 필요합니다" + "설정으로 이동" |
| Network error | "인터넷 연결을 확인해주세요" + "재시도" |
| Same station for departure/arrival | Inline error + prevent search |
| No route found | Helpful message + alternative suggestions |
| GPS location unavailable | "위치를 찾을 수 없습니다" + manual selection |

---

*Last updated: 2026-01-25 (original), consolidated 2026-02-13*
