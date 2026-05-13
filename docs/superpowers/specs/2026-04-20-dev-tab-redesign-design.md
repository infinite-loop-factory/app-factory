# Dev Tab Redesign — Design Spec

**Date**: 2026-04-20  
**App**: `dist-interactive-metro`  
**Branch**: `feature/dist-interactive-metro`

---

## 1. Problem Statement

The current `dev.tsx` is a single long `ScrollView` with four sections stacked vertically:
- DB Entities, Sync Status, API Inspector, Dev Actions

Pain points:
- Hard to navigate — users must scroll to reach specific tools
- API Inspector (the heaviest section) has no way to verify endpoint health or DB write correctness
- No indication of whether fetched data is actually persisted to the local DB
- No app version / environment info surface

---

## 2. Approved Design

**Option C: Overview + Pill Sub-Navigation**

A pill tab bar sits beneath the `Developer Mode` page title. Tapping a pill swaps the content area — no router push, just local `useState`. The default view is **Overview**.

### Tab Structure

| Pill | Content |
|------|---------|
| Overview | Sync status badge · 2×2 stats grid (Lines/Stations/Routes/KRIC Codes) · Force Full Sync shortcut |
| Database | Entity list with counts → detail modal · Last sync details · DB Integrity panel |
| API | KRIC API Inspector (5 endpoints) · Endpoint Health Checker |
| Actions | Sync actions · UI tests · App version / environment info (via `expo-constants`) |

### Visual Theme

Matches existing app tokens exactly — no new colors introduced:
- Backgrounds: `bg-background-0` / `bg-background-50`
- Accent: `primary` (orange, `#FFA31A`)
- Text: `text-typography-900` / `text-outline-400/500`
- Borders: `border-outline-200`
- Status: green (`success`), red (`error`), amber (`warning`)

Pill active state: `bg-primary-500 text-white`  
Pill inactive state: `bg-background-50 border-outline-200 text-outline-500`

---

## 3. Architecture

### Component Tree

```
src/app/(tabs)/dev.tsx          ← shell: pill tab state only
src/components/dev/
  pill-tab-bar.tsx              ← reusable pill selector
  overview-tab.tsx              ← stats grid + sync status + quick sync
  database-tab.tsx              ← entity table + integrity panel
  api-inspector.tsx             ← existing, extended with health checker
  endpoint-health-checker.tsx   ← NEW: per-endpoint live validation
  actions-tab.tsx               ← sync actions + banner test + app info
```

`dev.tsx` holds only `activeTab` state and renders the active tab component. All business logic stays in each tab component and existing context/hooks.

### State Management

No new global state. Each tab uses existing hooks:
- `useSyncStatus()` — sync state, items counts, actions
- `useUpdateBanner()` — banner test
- Local `useState` in each tab for UI-only state (search, selected entity, health results)

---

## 4. New Features

### 4-A. Endpoint Health Checker (API tab)

A collapsible panel listing all 5 KRIC endpoints. Each row shows:
- Endpoint name + path
- Last check result: **✓ OK** (green) / **✗ Error** (red) / **— Untested** (gray)
- Response time (ms) on success
- HTTP status code + truncated error message on failure

**"Check All" button**: fires all 5 endpoints in parallel with minimal valid params (uses first available station/line from `getAllStations()` / `getKricRoutes()`). If DB is empty (not yet synced), button is disabled with a "Sync required" notice. Writes results to local `useState` — no persistence needed.

Validation logic per endpoint:
- `subwayRouteInfo` → response array length > 0
- `subwayTimetable` → `body.items.item` exists and is non-empty
- `stationTimetable` → same as above
- `stationTransferInfo` → transfer distance field is present
- `transferMovement` → step array is non-empty

### 4-B. DB Integrity Panel (Database tab)

Shown as a collapsible section titled "DB Integrity". Triggered by a **"Run Check"** button.

Checks performed:
1. **Count parity**: Compare `items.stations` (from sync context) vs `getAllStations().length`
2. **Route coverage**: Every line in `metroLines` has ≥ 1 route in `getKricRoutes()`
3. **Code map coverage**: Every station that has connections has a corresponding KRIC code entry
4. **Orphan detection**: Any station whose `line` value doesn't match a known line name

Each check renders as a row: check name · result badge (Pass / Warn / Fail) · detail count.

---

## 5. Data Flow

```
KRIC API ──fetch──► endpoint-health-checker.tsx
                         │ (local state, no DB write)
                         ▼
                    health results displayed in API tab

DB (station-store, kric-station-sync)
         │
         ├──► overview-tab.tsx   (read counts via useSyncStatus)
         ├──► database-tab.tsx   (read via getAllStations, getKricRoutes, getKricCodeMap)
         └──► db-integrity-panel (read same sources, cross-checks)

checkAndRefreshData() ──► setSyncStatus / setLastSync ──► all tabs update via context
```

---

## 6. Error Handling

- **Endpoint health check fails**: Show HTTP status + first 100 chars of error. Never throw — catch per-endpoint.
- **DB integrity check**: If a source function throws, mark that check row as `error` with message. Other checks continue.
- **Force Full Sync**: Existing error path unchanged (already handled via `setLastSync` with error param).

---

## 7. File Changes

| File | Action |
|------|--------|
| `src/app/(tabs)/dev.tsx` | Refactor to shell — move sections into tab components |
| `src/components/dev/pill-tab-bar.tsx` | Create |
| `src/components/dev/overview-tab.tsx` | Create (extract from dev.tsx) |
| `src/components/dev/database-tab.tsx` | Create (extract + add integrity panel) |
| `src/components/dev/api-inspector.tsx` | Extend with health checker section |
| `src/components/dev/endpoint-health-checker.tsx` | Create |
| `src/components/dev/actions-tab.tsx` | Create (extract + add app info) |

No changes to: context, data layer, types, routing.

---

## 8. Out of Scope

- Dark mode–specific styling (tokens handle this automatically)
- Persisting health check results across sessions
- Network retry logic for health checks
- Any changes outside `dist-interactive-metro`
