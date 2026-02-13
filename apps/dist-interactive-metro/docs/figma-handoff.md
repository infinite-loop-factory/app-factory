# Figma UI Prototype — Design Handoff

> **App**: dist-interactive-metro (Distance + Interactive + Metro)
> **Platform**: iOS / Android / Web (React Native + Expo)
> **Primary language**: Korean (English fallback)
> **Stage**: Planning complete → Phase 1 (Data/API integration) upcoming

---

## 1. App Overview

A **distance-based, GPS-integrated subway route recommendation app** for the Seoul metropolitan area (nationwide expansion planned). Inspired by the Korean app 지하철종결자 ("Subway Master").

### Core Value Proposition

- GPS-aware departure station detection
- Distance-based route optimization (not just station count)
- Multiple route options: shortest distance (Dijkstra), minimum transfers (BFS)
- Real-time info integration (planned)

---

## 2. Information Architecture

### Tab Navigation (Bottom)

| Tab | Label (KO) | Label (EN) | Status |
|-----|-----------|-----------|--------|
| Route Guide | 경로안내 | Route | Partially implemented |
| Notifications | 알림 | Notifications | Placeholder |
| Favorites | 즐겨찾기 | Favorites | Placeholder |
| Settings | 설정 | Settings | Basic implementation |

### Screen Map

```
Tab: Route Guide
├── Home (Mode A: centered / Mode B: top-aligned)
├── Departure Selection Panel
├── Arrival Selection Panel
├── Via Selection Panel
├── Route Result (list of options)
└── Route Detail (step-by-step timeline)

Tab: Notifications
├── Notification List
└── Notification Settings

Tab: Favorites
└── Saved Routes & Stations

Tab: Settings
├── Default Home Tab
└── Notification Settings
```

---

## 3. User Flows

### Flow A — Basic Route Search

```
Home (empty) → Tap departure field → Select station
→ Tap arrival field → Select station
→ [Optional] Add via station(s)
→ Tap "Find Route" → Route Results → Route Detail
```

### Flow B — GPS-Assisted Search

```
App launch → GPS detects nearest station → Auto-fill departure
→ User selects arrival → Route Results → Route Detail
```

### Home Screen Layout Modes

| Mode | Trigger | Layout |
|------|---------|--------|
| **A — Initial** | No station selected | Departure + arrival fields centered vertically |
| **B — Expanded** | Any station selected | Fields move to top (animated), title + search button appear below |

**Transition**: `easeInEaseOut` layout animation from Mode A → Mode B.

---

## 4. Design System

### 4.1 Color Palette

The app uses a **semantic token system** with 0–950 scales. Dark mode inverts the scale direction.

#### Primary Colors

| Role | Token | Light Mode | Usage |
|------|-------|-----------|-------|
| **Primary** (Arrival) | `primary-300` | `rgb(255, 163, 26)` — Amber/Orange | Arrival station fields, badges, CTA |
| **Secondary** (Departure) | `secondary-300` | `rgb(26, 163, 255)` — Blue | Departure station fields, badges |
| **Tertiary** | `tertiary-300` | `rgb(128, 77, 255)` — Purple | Accent elements (future) |

#### Semantic Colors

| Role | Token | Light Mode |
|------|-------|-----------|
| Error | `error-400` | `rgb(239, 68, 68)` — Red |
| Success | `success-400` | `rgb(72, 151, 102)` — Green |
| Warning | `warning-400` | `rgb(251, 149, 75)` — Orange |
| Info | `info-400` | `rgb(50, 180, 244)` — Cyan |

#### Neutral Colors

| Role | Token | Light Mode |
|------|-------|-----------|
| Background (base) | `background-0` | `rgb(255, 255, 255)` — White |
| Background (subtle) | `background-50` | `rgb(246, 246, 246)` |
| Text (primary) | `typography-900` | `rgb(38, 38, 39)` |
| Text (secondary) | `typography-500` | `rgb(140, 140, 140)` |
| Text (tertiary) | `outline-500` | `rgb(140, 141, 141)` |
| Border (default) | `outline-200` | `rgb(221, 220, 219)` |
| Placeholder text | `outline-400` | `rgb(165, 163, 163)` |

#### Color Usage Rules

- **Departure** elements → `secondary-*` family (blue tones)
- **Arrival** elements → `primary-*` family (amber/orange tones)
- **Via / neutral** elements → `outline-*` family (gray tones)
- **Disabled** states → `outline-100` background, `outline-400` text
- **Active selection** → 2px colored border + tinted background (e.g. `secondary-400` border + `secondary-0` bg)

### 4.2 Typography

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Title | 36px | Bold | 40px | Screen titles |
| Subtitle | 20px | Bold | — | Section headings |
| Heading | 16px | Semibold | 24px | Card/section titles |
| Body | 16px | Regular | 24px | Body text |
| Body Small | 14px | Regular/Medium | 20px | Secondary info, field text |
| Caption | 12px | Regular | 16px | Labels, metadata |
| Tiny | 10px | Regular | — | Badges, indicators |

### 4.3 Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `xl` | 32px | Large section gaps |
| `l` | 28px | — |
| `xm` | 24px | Screen horizontal padding |
| `m` | 20px | — |
| `xs` | 18px | — |
| `s` | 16px | Card inner padding |
| `ss` | 12px | Tight spacing |

- **Screen horizontal padding**: 24px
- **Card/field inner padding**: 12–16px
- **Corner radius**: 12px (`rounded-xl`) for cards/fields, 8px (`rounded-lg`) for buttons

### 4.4 Shadows

| Name | Value | Usage |
|------|-------|-------|
| `hard-2` | `0px 3px 10px rgba(38,38,38,0.20)` | Elevated cards |
| `hard-5` | `0px 2px 10px rgba(38,38,38,0.10)` | Subtle elevation |
| `soft-1` | `0px 0px 10px rgba(38,38,38,0.1)` | Soft glow |

### 4.5 Icons

Using **Lucide Icons** (`lucide-react-native`). Key icons in use:

- Navigation: `ChevronLeft`, `ChevronRight`
- Stations: `CircleDot` (departure), `MapPin` (arrival)
- Actions: `Plus`, `X`, `Check`, `RefreshCw`
- Status: `Clock`, `CheckCircle2`, `AlertCircle`, `Loader2`
- Misc: `Database`, `Heart`

Tab bar uses **Ionicons**: `navigate`, `notifications`, `heart`, `settings`.

---

## 5. Component Inventory

### 5.1 Implemented Components

#### StationField
A horizontal input-like field for selecting a station.

- **States**: empty (placeholder), filled (station name), active (selecting), disabled
- **Variants**: departure (blue accent), arrival (orange accent)
- **Features**: clear button (X icon), chevron indicator, label (optional)
- **Active style**: 2px colored border + tinted background

#### StationBlock
Groups departure + arrival + via fields horizontally.

#### AddViaField
Button to add via stations. Shows count badge and "clear all" action.

- Max 3 via stations
- Shows count with max indicator

#### StationListItem
Selectable row in station selection panels.

- Station name + line info
- Disabled state (50% opacity) when already selected
- Accent left border per variant

#### StationSelectPanel
Full-panel overlay for selecting departure/arrival/via stations.

- Color-coded by variant (blue/orange/gray)
- Pill badge showing current mode
- Back button + scrollable station list

#### SearchButton
Primary CTA for route search.

- Enabled: `primary-500` background, white text
- Disabled: `outline-100` background, `outline-400` text

#### ScreenHeader
Back navigation + title bar.

- Minimum 44x44pt touch target for back button
- Respects top safe area insets

#### Tab Bar
Bottom navigation with 4 tabs (+ Dev tab in development builds only).

### 5.2 Components Needing Design

The following components do not exist yet and require full design:

- **SearchBar** — Station search with autocomplete
- **LineFilterTabs** — Horizontal scrollable tabs for filtering by subway line
- **NearbyStationCard** — GPS-based nearby station recommendation card
- **RouteOptionCard** — Summary card for a route option (time, transfers, distance, fare)
- **RouteTimeline** — Vertical step-by-step route visualization
- **TransferBadge** — Inline badge showing transfer walk time
- **NotificationCard** — Alert/notification list item
- **FavoriteRouteCard** — Saved route card with quick search action
- **FavoriteStationChip** — Saved station chip with quick action
- **SkeletonLoader** — Content placeholder during loading
- **EmptyState** — Illustration + message for empty screens
- **ErrorState** — Error illustration + retry action

---

## 6. Screens Requiring Full Design

### 6.1 Station Selection (Enhanced)

Current implementation is a basic list. The enhanced version needs:

- **Search bar** at top with real-time autocomplete
- **GPS section**: "Nearby stations" card group (top, collapsible)
- **Recent searches**: Horizontal chip list
- **Line-based filter**: Horizontal scrollable tabs (Line 1, 2, 3...)
- **Station list**: Grouped by line, with line color indicators
- **Each station item**: Name (KO), name (EN), line badges, station number

#### Line Colors (Seoul Metro)

| Line | Color | Hex |
|------|-------|-----|
| Line 1 | Dark Blue | `#263C96` |
| Line 2 | Green | `#3CB44A` |
| Line 3 | Orange | `#EF7C1C` |
| Line 4 | Sky Blue | `#00A2D1` |
| Line 5 | Purple | `#996CAC` |
| Line 6 | Brown | `#CD7C2F` |
| Line 7 | Olive | `#747F00` |
| Line 8 | Pink | `#E6186C` |
| Line 9 | Gold | `#BDB092` |
| Sinbundang | Red | `#D4003B` |
| Gyeongui-Jungang | Teal | `#77C4A3` |
| Airport Railroad | Blue | `#0090D2` |
| Gyeongchun | Green | `#0C8E72` |
| Suinbundang | Yellow | `#FABE00` |
| Shinlim | Blue-Violet | `#6789CA` |
| UI Sinseol | Gold | `#B0CE18` |

> These are the official Seoul Metro line colors and should be used for line badges/indicators.

### 6.2 Route Results Screen

Multiple route options displayed as cards:

- **Sort options**: Fastest, Fewest transfers, Shortest distance
- **Each route card** includes:
  - Total travel time (prominent)
  - Number of transfers
  - Total distance (km)
  - Fare (KRW)
  - Departure time → Arrival time
  - Brief station sequence preview (e.g. "Seoul Stn → Transfer at Sindorim → Gangnam")
- **GPS-optimal route** gets a highlighted badge ("Recommended based on your location")
- **Tap** → expands to Route Detail

### 6.3 Route Detail Screen

Step-by-step vertical timeline:

- **Timeline nodes**: Departure station → Intermediate stations → Transfer points → Arrival station
- **Colored segments**: Each segment colored by subway line
- **Transfer points** highlighted with:
  - Transfer walk time
  - "Fast transfer" badge (if applicable)
  - Platform/exit info
- **Summary bar** (sticky bottom or top):
  - Total time, total distance, total fare, transfer count
- **Action buttons**: Save to favorites, Share route

### 6.4 Notifications Screen

- **Card list**: Operation disruptions, congestion alerts, favorite route changes
- **Each card**: Icon + title + body + timestamp + read/unread indicator
- **Empty state**: Illustration + "No notifications yet"
- **Pull-to-refresh**

### 6.5 Notification Settings Screen

- Toggle switches for notification categories:
  - Operation disruptions
  - Congestion alerts
  - Favorite route updates
- Time-based quiet hours setting

### 6.6 Favorites Screen

- **Tabs or segments**: Saved Routes / Saved Stations
- **Saved route card**: Departure → Arrival summary, quick "Search again" button, last searched date
- **Saved station card**: Station name + line badges, quick actions (set as departure, set as arrival)
- **Empty state**: Illustration + "Save your frequent routes for quick access"
- **Swipe to delete** (or long press → delete)

---

## 7. State Variations

Every screen should include designs for:

| State | Description |
|-------|-------------|
| **Default** | Normal loaded state |
| **Loading** | Skeleton placeholders or spinner |
| **Empty** | No data available — illustration + message + CTA |
| **Error** | Network/API failure — illustration + message + retry button |
| **Partial** | Some data loaded, some failed (degraded state) |

### Screen-Specific States

| Screen | Special States |
|--------|---------------|
| Home | Same-station warning (departure = arrival) |
| Station Selection | No search results, GPS permission denied, GPS loading |
| Route Results | No valid route found, slow calculation loading |
| Route Detail | Real-time data unavailable fallback |

---

## 8. Dark Mode

All screens require both **Light** and **Dark** variants. The token system already supports this — dark mode inverts the 0–950 scale:

- Light `background-0` (white) → Dark `background-0` (near-black `rgb(18,18,18)`)
- Light `typography-900` (near-black) → Dark `typography-900` (near-white `rgb(245,245,245)`)
- Primary/secondary base colors shift but maintain contrast ratios

---

## 9. Accessibility Requirements

- **Touch targets**: Minimum 44×44pt for all interactive elements
- **Color contrast**: WCAG AA (4.5:1 for text, 3:1 for large text/UI)
- **Screen reader**: All interactive elements must have descriptive labels
- **Text scaling**: Layouts should accommodate up to 200% text scaling
- **Reduced motion**: Provide alternative for animation-dependent interactions

---

## 10. Device Targets

| Device | Screen Size | Priority |
|--------|------------|----------|
| iPhone SE (3rd gen) | 375×667pt | Must support |
| iPhone 16/17 | 393×852pt | Primary design target |
| iPhone 16/17 Pro Max | 430×932pt | Must support |
| iPad (basic) | 820×1180pt | Nice to have |

- **Orientation**: Portrait only
- **Safe areas**: Respect top (notch/Dynamic Island) and bottom (home indicator) insets

---

## 11. Reference Materials

### Existing Prototype Screenshots

Located in `docs/prototype/`:

- 6 screenshots from a v0.dev prototype (Jan 25, 2026)
- These show early concepts — the current codebase has evolved beyond them

### Reference Apps

| App | What to Reference |
|-----|------------------|
| 지하철종결자 (Subway Master) | Core feature set, route result layout |
| 카카오맵 (Kakao Map) — Subway | Clean station selection UX, search experience |
| 네이버 지도 (Naver Map) — Subway | Route timeline visualization, transfer info |
| Citymapper | Modern UI patterns, multi-modal route cards |

### Existing v0.dev Prompts

Detailed prompts for each screen are available in:
- `docs/ui-prototype-prompts.md` — 5 screen specifications
- `docs/home-screen-ui-prompt.md` — Home screen layout spec
- `docs/home-screen-v0-prompt.md` — English v0 prompt

---

## 12. Deliverables Checklist

- [ ] **Home screen** — Mode A (centered) and Mode B (expanded), both light/dark
- [ ] **Station selection** — Departure, Arrival, Via variants with search/GPS/filter
- [ ] **Route results** — Card list with sort options, GPS highlight
- [ ] **Route detail** — Timeline visualization with line colors
- [ ] **Notifications** — List + empty + settings
- [ ] **Favorites** — Routes + stations tabs + empty
- [ ] **Settings** — Full settings page
- [ ] **Error/loading/empty states** for all screens
- [ ] **Component library** — All reusable components documented
- [ ] **Dark mode** — All screens in both themes
- [ ] **Prototype interactions** — Key flows linked (home → select → results → detail)
