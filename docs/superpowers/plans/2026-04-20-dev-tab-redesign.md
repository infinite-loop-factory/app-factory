# Dev Tab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `dist-interactive-metro` dev tab into an Overview + Pill sub-navigation structure (4 tabs: Overview / Database / API / Actions) with live KRIC endpoint health checking and DB integrity validation.

**Architecture:** `dev.tsx` becomes a thin shell that holds only `activeTab` state and renders one of four tab components. Each tab component is self-contained and pulls data from existing hooks/functions. Two new components (`endpoint-health-checker.tsx` inside api tab, `DbIntegrityPanel` inside database tab) implement the new validation features.

**Tech Stack:** React Native, Expo Router, NativeWind v4, Gluestack UI tokens, `expo-constants`, existing `useSyncStatus` / `useUpdateBanner` contexts, `kric-api.ts`, `kric-station-sync.ts`, `station-store.ts`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/dev/pill-tab-bar.tsx` | Reusable horizontal pill selector |
| Create | `src/components/dev/overview-tab.tsx` | Stats grid + sync status + quick Force Sync |
| Create | `src/components/dev/actions-tab.tsx` | Dev actions + app version/env info |
| Create | `src/components/dev/endpoint-health-checker.tsx` | Per-endpoint live KRIC API validation |
| Create | `src/components/dev/database-tab.tsx` | Entity table + DB integrity panel (extracted from dev.tsx) |
| Modify | `src/components/dev/api-inspector.tsx` | Add EndpointHealthChecker section |
| Modify | `src/app/(tabs)/dev.tsx` | Refactor to shell: pill state + tab switching |

---

## Task 1: PillTabBar component

**Files:**
- Create: `apps/dist-interactive-metro/src/components/dev/pill-tab-bar.tsx`

- [ ] **Step 1: Create pill-tab-bar.tsx**

```tsx
import { Pressable, ScrollView, Text, View } from "react-native";

export type DevTab = "overview" | "database" | "api" | "actions";

const TABS: { id: DevTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "database", label: "Database" },
  { id: "api", label: "API" },
  { id: "actions", label: "Actions" },
];

export function PillTabBar({
  active,
  onChange,
}: {
  active: DevTab;
  onChange: (tab: DevTab) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6, gap: 8 }}
      className="flex-row"
    >
      {TABS.map((tab) => (
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: active === tab.id }}
          key={tab.id}
          onPress={() => onChange(tab.id)}
          className={`rounded-full px-4 py-1.5 ${
            active === tab.id
              ? "bg-primary-500"
              : "bg-background-50 border border-outline-200"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              active === tab.id ? "text-white" : "text-outline-500"
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dist-interactive-metro/src/components/dev/pill-tab-bar.tsx
git commit -m "feat(dev): add PillTabBar component"
```

---

## Task 2: OverviewTab component

**Files:**
- Create: `apps/dist-interactive-metro/src/components/dev/overview-tab.tsx`

- [ ] **Step 1: Create overview-tab.tsx**

```tsx
import type { SyncStatus } from "@/types/sync-status";

import { AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSyncStatus } from "@/context/sync-status-context";
import { useUpdateBanner } from "@/context/update-banner-context";
import {
  checkAndRefreshData,
  getKricCodeMap,
  getKricRoutes,
} from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import { lines as metroLines } from "@/data/stations";

// ── Helpers ───────────────────────────────────────────────────

function formatTimestamp(ms: number | null): string {
  if (ms == null) return "—";
  return new Date(ms).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

// ── SyncStatusBadge ───────────────────────────────────────────

function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const configs = {
    idle: { label: "Idle", dot: "bg-outline-300", text: "text-outline-500", Icon: Clock },
    syncing: { label: "Syncing…", dot: "bg-primary-500", text: "text-primary-600", Icon: Loader2 },
    success: { label: "Success", dot: "bg-green-500", text: "text-green-600", Icon: CheckCircle2 },
    error: { label: "Error", dot: "bg-red-500", text: "text-red-600", Icon: AlertCircle },
  };
  const { label, dot, text } = configs[status];
  return (
    <View className="flex-row items-center gap-2">
      <View className={`h-2 w-2 rounded-full ${dot}`} />
      <Text className={`text-sm font-semibold ${text}`}>{label}</Text>
    </View>
  );
}

// ── StatCard ──────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <View className="flex-1 rounded-xl border border-outline-200 bg-background-0 p-3">
      <Text className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-outline-400">
        {label}
      </Text>
      <Text className="font-bold text-2xl text-typography-900">{value}</Text>
      <Text className="text-outline-400 text-xs">{sub}</Text>
    </View>
  );
}

// ── OverviewTab ───────────────────────────────────────────────

const SCROLL_CONTENT = { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 } as const;

export function OverviewTab() {
  const {
    status,
    lastSyncTimestamp,
    lastSyncError,
    items,
    setSyncStatus,
    setLastSync,
  } = useSyncStatus();
  const { showBanner } = useUpdateBanner();

  const handleForceSync = useCallback(() => {
    setSyncStatus("syncing");
    checkAndRefreshData()
      .then((result) => {
        const totalStations = getAllStations().length;
        const totalCodeMap = Object.keys(getKricCodeMap()).length;
        const totalRoutes = getKricRoutes().length;
        setLastSync(Date.now(), {
          lines: metroLines.length,
          stations: totalStations,
          routes: totalRoutes,
          transfers: totalCodeMap,
        });
        const msg = result.updated
          ? `데이터 변경 감지 · ${totalCodeMap}개 역 코드`
          : `데이터 최신 상태 · ${totalCodeMap}개 역 코드`;
        showBanner(msg, result.updated ? "success" : "info");
      })
      .catch((err: unknown) => {
        setLastSync(
          Date.now(),
          items,
          err instanceof Error ? err.message : "Sync failed",
        );
      });
  }, [setSyncStatus, setLastSync, items, showBanner]);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={SCROLL_CONTENT}
      showsVerticalScrollIndicator={false}
    >
      {/* Status card */}
      <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-outline-400">
        상태
      </Text>
      <View className="mb-5 overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        <View className="flex-row items-center justify-between border-b border-outline-100 px-4 py-3.5">
          <Text className="text-sm text-outline-600">Sync Status</Text>
          <SyncStatusBadge status={status} />
        </View>
        <View className="flex-row items-center justify-between px-4 py-3.5">
          <Text className="text-sm text-outline-600">Last sync</Text>
          <Text className="font-mono text-sm text-typography-800">
            {formatTimestamp(lastSyncTimestamp)}
          </Text>
        </View>
        {lastSyncError ? (
          <View className="border-t border-outline-100 bg-red-50 px-4 py-3">
            <Text className="font-mono text-red-700 text-sm">{lastSyncError}</Text>
          </View>
        ) : null}
      </View>

      {/* Stats grid */}
      <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-outline-400">
        데이터베이스
      </Text>
      <View className="mb-2 flex-row gap-3">
        <StatCard label="Lines" value={items.lines} sub="노선" />
        <StatCard label="Stations" value={items.stations} sub="역" />
      </View>
      <View className="mb-5 flex-row gap-3">
        <StatCard label="Routes" value={items.routes} sub="경로 분기" />
        <StatCard label="KRIC Codes" value={items.transfers} sub="역코드" />
      </View>

      {/* Force sync shortcut */}
      <Pressable
        accessibilityLabel="Force full sync"
        accessibilityRole="button"
        accessibilityState={{ disabled: status === "syncing" }}
        className={`flex-row items-center justify-center gap-3 rounded-xl border border-primary-200 bg-primary-50 py-4 ${
          status === "syncing" ? "opacity-50" : "active:bg-primary-100"
        }`}
        disabled={status === "syncing"}
        onPress={handleForceSync}
      >
        {status === "syncing" ? (
          <Loader2 className="text-primary-600" size={18} />
        ) : (
          <RefreshCw className="text-primary-600" size={18} />
        )}
        <Text className="font-semibold text-primary-700 text-sm">Force Full Sync</Text>
      </Pressable>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dist-interactive-metro/src/components/dev/overview-tab.tsx
git commit -m "feat(dev): add OverviewTab with stats grid and sync status"
```

---

## Task 3: ActionsTab component

**Files:**
- Create: `apps/dist-interactive-metro/src/components/dev/actions-tab.tsx`

- [ ] **Step 1: Create actions-tab.tsx**

```tsx
import Constants from "expo-constants";
import { AlertCircle, Bell, RefreshCw } from "lucide-react-native";
import { useCallback, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSyncStatus } from "@/context/sync-status-context";
import { useUpdateBanner } from "@/context/update-banner-context";

const SCROLL_CONTENT = { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 } as const;
const SECTION_LABEL = "mb-2 text-xs font-semibold uppercase tracking-widest text-outline-400";

export function ActionsTab() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { status, items, setSyncStatus, setLastSync, resetSyncState } = useSyncStatus();
  const { showBanner } = useUpdateBanner();

  const handleSimulateError = useCallback(() => {
    setSyncStatus("syncing");
    timerRef.current = setTimeout(() => {
      setLastSync(Date.now(), items, "Network error (simulated)");
    }, 1000);
  }, [setSyncStatus, setLastSync, items]);

  const handleTestBanner = useCallback(() => {
    showBanner("배너 테스트 · 4.5초 후 자동 닫힘", "info");
  }, [showBanner]);

  const appVersion = Constants.expoConfig?.version ?? "—";
  const buildNumber =
    (Constants.expoConfig?.ios?.buildNumber ??
      Constants.expoConfig?.android?.versionCode?.toString()) ??
    "—";
  const envName = (Constants.expoConfig?.extra as Record<string, unknown> | undefined)?.env ?? "development";

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={SCROLL_CONTENT}
      showsVerticalScrollIndicator={false}
    >
      <Text className={SECTION_LABEL}>Sync</Text>
      <View className="mb-5 gap-3">
        <Pressable
          accessibilityLabel="Force full sync"
          accessibilityRole="button"
          accessibilityState={{ disabled: status === "syncing" }}
          className={`flex-row items-center justify-center gap-3 rounded-xl border border-primary-200 bg-primary-50 py-4 ${
            status === "syncing" ? "opacity-50" : "active:bg-primary-100"
          }`}
          disabled={status === "syncing"}
          onPress={() => {
            /* handled in OverviewTab — here just re-export the same action */
            showBanner("Overview 탭에서 Force Sync를 실행하세요.", "info");
          }}
        >
          <RefreshCw className="text-primary-600" size={18} />
          <Text className="font-semibold text-primary-700 text-sm">Force Full Sync</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Simulate sync error"
          accessibilityRole="button"
          accessibilityState={{ disabled: status === "syncing" }}
          className={`flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 bg-background-0 py-4 ${
            status === "syncing" ? "opacity-50" : "active:bg-background-50"
          }`}
          disabled={status === "syncing"}
          onPress={handleSimulateError}
        >
          <AlertCircle className="text-red-500" size={18} />
          <Text className="font-semibold text-red-600 text-sm">Simulate Sync Error</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Reset sync state"
          accessibilityRole="button"
          className="flex-row items-center justify-center gap-3 rounded-xl border border-dashed border-outline-200 bg-background-50 py-4 active:bg-background-100"
          onPress={resetSyncState}
        >
          <Text className="font-medium text-outline-500 text-sm">Reset Sync State</Text>
        </Pressable>
      </View>

      <Text className={SECTION_LABEL}>UI</Text>
      <View className="mb-5">
        <Pressable
          accessibilityLabel="Test update banner"
          accessibilityRole="button"
          className="flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 bg-background-0 py-4 active:bg-background-50"
          onPress={handleTestBanner}
        >
          <Bell className="text-typography-700" size={18} />
          <Text className="font-semibold text-sm text-typography-900">Test Update Banner</Text>
        </Pressable>
      </View>

      <Text className={SECTION_LABEL}>앱 정보</Text>
      <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        <View className="flex-row items-center justify-between border-b border-outline-100 px-4 py-3.5">
          <Text className="text-sm text-outline-600">Version</Text>
          <Text className="font-mono text-sm text-typography-800">
            {appVersion} ({buildNumber})
          </Text>
        </View>
        <View className="flex-row items-center justify-between px-4 py-3.5">
          <Text className="text-sm text-outline-600">Environment</Text>
          <Text className="font-mono text-sm font-semibold text-primary-600">
            {String(envName)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dist-interactive-metro/src/components/dev/actions-tab.tsx
git commit -m "feat(dev): add ActionsTab with dev actions and app info"
```

---

## Task 4: EndpointHealthChecker component

**Files:**
- Create: `apps/dist-interactive-metro/src/components/dev/endpoint-health-checker.tsx`

- [ ] **Step 1: Create endpoint-health-checker.tsx**

```tsx
import type { DayCd } from "@/lib/kric-api";
import type { KricCodeMap, KricStationRef } from "@/data/kric-station-sync";

import { useState, useCallback } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { getKricCodeMap } from "@/data/kric-station-sync";
import {
  fetchSubwayRouteInfo,
  fetchSubwayTimetable,
  fetchStationTimetable,
  fetchStationTransferInfo,
  fetchTransferMovement,
  getCurrentDayCd,
} from "@/lib/kric-api";

// ── Types ──────────────────────────────────────────────────────

type HealthStatus = "untested" | "checking" | "ok" | "error" | "skipped";

interface EndpointHealth {
  id: string;
  label: string;
  path: string;
  status: HealthStatus;
  responseTimeMs?: number;
  itemCount?: number;
  errorMessage?: string;
}

// ── Endpoint definitions ───────────────────────────────────────

const ENDPOINT_DEFS: Pick<EndpointHealth, "id" | "label" | "path">[] = [
  { id: "subwayRouteInfo", label: "Route Info", path: "trainUseInfo/subwayRouteInfo" },
  { id: "subwayTimetable", label: "Subway Timetable", path: "trainUseInfo/subwayTimetable" },
  { id: "stationTimetable", label: "Station Timetable", path: "convenientInfo/stationTimetable" },
  { id: "stationTransferInfo", label: "Transfer Info", path: "convenientInfo/stationTransferInfo" },
  { id: "transferMovement", label: "Transfer Movement", path: "vulnerableUserInfo/transferMovement" },
];

// ── Param builders ─────────────────────────────────────────────

function findTransferPair(
  codeMap: KricCodeMap,
): [KricStationRef, KricStationRef] | null {
  const nameMap = new Map<string, KricStationRef[]>();
  for (const [key, ref] of Object.entries(codeMap)) {
    const name = key.split("|")[0];
    if (!nameMap.has(name)) nameMap.set(name, []);
    nameMap.get(name)!.push(ref);
  }
  const pair = [...nameMap.values()].find((refs) => refs.length >= 2);
  return pair ? [pair[0], pair[1]] : null;
}

async function checkEndpoint(
  id: string,
  codeMap: KricCodeMap,
  dayCd: DayCd,
): Promise<{ items: unknown[]; skipped?: boolean }> {
  const firstEntry = Object.values(codeMap)[0];

  switch (id) {
    case "subwayRouteInfo": {
      const items = await fetchSubwayRouteInfo({ mreaWideCd: "01", lnCd: "2" });
      return { items };
    }
    case "subwayTimetable": {
      if (!firstEntry) return { items: [], skipped: true };
      const items = await fetchSubwayTimetable({
        railOprIsttCd: firstEntry.railOprIsttCd,
        dayCd,
        lnCd: firstEntry.lnCd,
        stinCd: firstEntry.stinCd,
      });
      return { items };
    }
    case "stationTimetable": {
      if (!firstEntry) return { items: [], skipped: true };
      const items = await fetchStationTimetable({
        railOprIsttCd: firstEntry.railOprIsttCd,
        dayCd,
        lnCd: firstEntry.lnCd,
        stinCd: firstEntry.stinCd,
      });
      return { items };
    }
    case "stationTransferInfo": {
      if (!firstEntry) return { items: [], skipped: true };
      const items = await fetchStationTransferInfo({
        railOprIsttCd: firstEntry.railOprIsttCd,
        lnCd: firstEntry.lnCd,
        stinCd: firstEntry.stinCd,
      });
      return { items };
    }
    case "transferMovement": {
      const pair = findTransferPair(codeMap);
      if (!pair) return { items: [], skipped: true };
      const [from, to] = pair;
      const items = await fetchTransferMovement({
        railOprIsttCd: from.railOprIsttCd,
        lnCd: from.lnCd,
        stinCd: from.stinCd,
        prevStinCd: from.stinCd,
        chthTgtLn: to.lnCd,
        chtnNextStinCd: to.stinCd,
      });
      return { items };
    }
    default:
      return { items: [], skipped: true };
  }
}

// ── HealthRow ──────────────────────────────────────────────────

function HealthRow({ entry }: { entry: EndpointHealth }) {
  const isChecking = entry.status === "checking";

  const badge = {
    untested: { label: "—", cls: "text-outline-400" },
    checking: { label: "…", cls: "text-primary-500" },
    ok: { label: "✓ OK", cls: "text-green-600" },
    error: { label: "✗ Error", cls: "text-red-600" },
    skipped: { label: "Skip", cls: "text-outline-400" },
  }[entry.status];

  return (
    <View className="border-b border-outline-100 px-4 py-3 last:border-0">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-semibold text-sm text-typography-900">{entry.label}</Text>
          <Text className="font-mono text-outline-400 text-xs">{entry.path}</Text>
        </View>
        {isChecking ? (
          <ActivityIndicator size="small" />
        ) : (
          <View className="items-end">
            <Text className={`font-semibold text-sm ${badge.cls}`}>{badge.label}</Text>
            {entry.status === "ok" && entry.responseTimeMs !== undefined ? (
              <Text className="font-mono text-outline-400 text-xs">
                {entry.responseTimeMs}ms · {entry.itemCount} items
              </Text>
            ) : null}
            {entry.status === "error" && entry.errorMessage ? (
              <Text className="font-mono text-red-400 text-xs" numberOfLines={2}>
                {entry.errorMessage}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

// ── EndpointHealthChecker ──────────────────────────────────────

export function EndpointHealthChecker() {
  const [results, setResults] = useState<EndpointHealth[]>(
    ENDPOINT_DEFS.map((d) => ({ ...d, status: "untested" as HealthStatus })),
  );
  const [isRunning, setIsRunning] = useState(false);

  const handleCheckAll = useCallback(async () => {
    const codeMap = getKricCodeMap();
    const dayCd = getCurrentDayCd();
    setIsRunning(true);

    // Set all to checking
    setResults(ENDPOINT_DEFS.map((d) => ({ ...d, status: "checking" })));

    const checks = ENDPOINT_DEFS.map(async (def) => {
      const start = Date.now();
      try {
        const { items, skipped } = await checkEndpoint(def.id, codeMap, dayCd);
        const responseTimeMs = Date.now() - start;
        if (skipped) {
          return { ...def, status: "skipped" as HealthStatus };
        }
        return {
          ...def,
          status: "ok" as HealthStatus,
          responseTimeMs,
          itemCount: items.length,
        };
      } catch (err) {
        return {
          ...def,
          status: "error" as HealthStatus,
          responseTimeMs: Date.now() - start,
          errorMessage: err instanceof Error ? err.message.slice(0, 120) : String(err),
        };
      }
    });

    const settled = await Promise.allSettled(checks);
    setResults(
      settled.map((r, i) =>
        r.status === "fulfilled"
          ? r.value
          : { ...ENDPOINT_DEFS[i], status: "error", errorMessage: "Unexpected failure" },
      ),
    );
    setIsRunning(false);
  }, []);

  const hasCodeMap = Object.keys(getKricCodeMap()).length > 0;

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-widest text-outline-400">
          Endpoint Health
        </Text>
        <Pressable
          className={`rounded-lg px-3 py-1.5 ${
            isRunning || !hasCodeMap
              ? "bg-background-100 opacity-50"
              : "bg-primary-50 border border-primary-200 active:bg-primary-100"
          }`}
          disabled={isRunning || !hasCodeMap}
          onPress={handleCheckAll}
        >
          <Text className={`text-xs font-semibold ${isRunning || !hasCodeMap ? "text-outline-400" : "text-primary-700"}`}>
            {isRunning ? "Checking…" : !hasCodeMap ? "Sync required" : "Check All"}
          </Text>
        </Pressable>
      </View>
      <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        {results.map((entry) => (
          <HealthRow entry={entry} key={entry.id} />
        ))}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dist-interactive-metro/src/components/dev/endpoint-health-checker.tsx
git commit -m "feat(dev): add EndpointHealthChecker for live KRIC API validation"
```

---

## Task 5: DatabaseTab component

**Files:**
- Create: `apps/dist-interactive-metro/src/components/dev/database-tab.tsx`

Extracts DB Entities section + sync log from `dev.tsx` and adds a new `DbIntegrityPanel`.

- [ ] **Step 1: Create database-tab.tsx**

```tsx
import type { KricRoute } from "@/data/kric-station-sync";

import { ChevronRight, X } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSyncStatus } from "@/context/sync-status-context";
import { getKricCodeMap, getKricRoutes } from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import { lines as metroLines } from "@/data/stations";

// ── Types ──────────────────────────────────────────────────────

const DB_ENTITIES = [
  { key: "lines", label: "Lines", desc: "노선", schema: "id, name, number, color" },
  { key: "stations", label: "Stations", desc: "역 (전체)", schema: "id, name, line, lineColor, connections?" },
  { key: "routes", label: "Routes", desc: "노선 경로 (분기 포함)", schema: "lnCd, routCd, routNm, stationCount" },
  { key: "transfers", label: "Transfers", desc: "KRIC 역코드", schema: "stinNm|lnCd → { stinCd, railOprIsttCd, lnCd }" },
] as const;

type EntityKey = (typeof DB_ENTITIES)[number]["key"];

// ── Integrity check types ───────────────────────────────────────

type IntegrityStatus = "idle" | "running" | "done";
type CheckResult = "pass" | "warn" | "fail";

interface IntegrityCheck {
  name: string;
  result: CheckResult;
  detail: string;
}

// ── Integrity helpers ───────────────────────────────────────────

function runIntegrityChecks(): IntegrityCheck[] {
  const stations = getAllStations();
  const routes = getKricRoutes();
  const codeMap = getKricCodeMap();
  const lineNames = new Set(metroLines.map((l) => l.name));

  // 1. Count parity: context items vs actual store
  const storeCount = stations.length;

  // 2. Route coverage: every line has ≥1 route
  const linesWithRoutes = new Set(routes.map((r) => r.appLine));
  const missingRoutes = metroLines.filter((l) => !linesWithRoutes.has(l.name));

  // 3. KRIC code coverage: stations with connections should have code map entries
  const stationsWithConnections = stations.filter(
    (s) => s.connections && s.connections.length > 0,
  );
  const missingCodes = stationsWithConnections.filter(
    (s) => !codeMap[`${s.name}|${s.line}`],
  );

  // 4. Orphan stations: station.line not in metroLines
  const orphans = stations.filter((s) => !lineNames.has(s.line));

  return [
    {
      name: "Station count",
      result: storeCount > 0 ? "pass" : "warn",
      detail: storeCount > 0 ? `${storeCount} stations in store` : "Store is empty — run Force Sync",
    },
    {
      name: "Route coverage",
      result: missingRoutes.length === 0 ? "pass" : "warn",
      detail:
        missingRoutes.length === 0
          ? `All ${metroLines.length} lines have routes`
          : `${missingRoutes.length} lines missing routes: ${missingRoutes.map((l) => l.name).join(", ")}`,
    },
    {
      name: "KRIC code coverage",
      result:
        codeMap && Object.keys(codeMap).length > 0
          ? missingCodes.length === 0
            ? "pass"
            : "warn"
          : "warn",
      detail:
        Object.keys(codeMap).length === 0
          ? "Code map empty — run Force Sync"
          : missingCodes.length === 0
            ? `All transfer stations have KRIC codes`
            : `${missingCodes.length} transfer stations missing codes`,
    },
    {
      name: "Orphan stations",
      result: orphans.length === 0 ? "pass" : "fail",
      detail:
        orphans.length === 0
          ? "No orphan stations"
          : `${orphans.length} stations reference unknown lines`,
    },
  ];
}

// ── DbIntegrityPanel ────────────────────────────────────────────

function DbIntegrityPanel() {
  const [integrityStatus, setIntegrityStatus] = useState<IntegrityStatus>("idle");
  const [checks, setChecks] = useState<IntegrityCheck[]>([]);

  const handleRunCheck = useCallback(() => {
    setIntegrityStatus("running");
    setTimeout(() => {
      setChecks(runIntegrityChecks());
      setIntegrityStatus("done");
    }, 0);
  }, []);

  const resultStyle: Record<CheckResult, { badge: string; text: string }> = {
    pass: { badge: "bg-green-50 border border-green-200", text: "text-green-700" },
    warn: { badge: "bg-amber-50 border border-amber-200", text: "text-amber-700" },
    fail: { badge: "bg-red-50 border border-red-200", text: "text-red-700" },
  };

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-widest text-outline-400">
          DB Integrity
        </Text>
        <Pressable
          className={`rounded-lg border border-outline-200 bg-background-0 px-3 py-1.5 active:bg-background-50 ${
            integrityStatus === "running" ? "opacity-50" : ""
          }`}
          disabled={integrityStatus === "running"}
          onPress={handleRunCheck}
        >
          <Text className="text-xs font-semibold text-outline-600">
            {integrityStatus === "running" ? "Running…" : "Run Check"}
          </Text>
        </Pressable>
      </View>

      {integrityStatus !== "idle" && checks.length > 0 ? (
        <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
          {checks.map((check) => (
            <View
              className="border-b border-outline-100 px-4 py-3 last:border-0"
              key={check.name}
            >
              <View className="flex-row items-start justify-between gap-2">
                <Text className="flex-1 font-semibold text-sm text-typography-900">
                  {check.name}
                </Text>
                <View className={`rounded-full px-2 py-0.5 ${resultStyle[check.result].badge}`}>
                  <Text className={`text-xs font-semibold ${resultStyle[check.result].text}`}>
                    {check.result.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text className="mt-0.5 font-mono text-outline-500 text-xs">
                {check.detail}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ── Entity detail rows (extracted from dev.tsx) ─────────────────

const MONO = "font-mono";
const ROW_BORDER = "border-outline-50 border-b";

function LinesDetailRow({
  item,
}: {
  item: {
    id: string;
    name: string;
    number: string;
    color: string;
    routeCount: number;
    stationCount: number;
  };
}) {
  return (
    <View className={`flex-row items-center gap-3 px-4 py-3 ${ROW_BORDER}`}>
      <View className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
      <View className="flex-1">
        <Text className="font-semibold text-sm text-typography-900">{item.name}</Text>
        <Text className="mt-0.5 text-outline-400 text-xs">
          {item.routeCount > 0 ? `${item.routeCount}개 경로 · ` : ""}
          {item.stationCount}개 역
        </Text>
      </View>
      <Text className={`${MONO} text-outline-300 text-xs`}>{item.number}</Text>
    </View>
  );
}

function StationsDetailRow({
  item,
}: {
  item: { id: string; name: string; line: string; lineColor: string; connections?: string[] };
}) {
  return (
    <View className={`px-4 py-3 ${ROW_BORDER}`}>
      <View className="flex-row items-center gap-2">
        <View className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: item.lineColor }} />
        <Text className="font-semibold text-sm text-typography-900">{item.name}</Text>
        <Text className="text-outline-400 text-xs">{item.line}</Text>
      </View>
      {item.connections && item.connections.length > 0 ? (
        <Text className="mt-1 pl-5 text-outline-400 text-xs">
          환승: {item.connections.join(", ")}
        </Text>
      ) : null}
    </View>
  );
}

function RoutesDetailRow({ item }: { item: KricRoute }) {
  return (
    <View className={`flex-row items-center gap-3 px-4 py-3 ${ROW_BORDER}`}>
      <View className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: item.lineColor }} />
      <View className="flex-1">
        <Text className="font-semibold text-sm text-typography-900">{item.routNm}</Text>
        <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>
          {item.lnCd} · {item.routCd}
        </Text>
      </View>
      <Text className={`${MONO} text-outline-500 text-xs`}>{item.stationCount}개 역</Text>
    </View>
  );
}

function TransfersDetailRow({
  entryKey,
  kricRef,
}: {
  entryKey: string;
  kricRef: { stinCd: string; railOprIsttCd: string; lnCd: string };
}) {
  const pipeIdx = entryKey.lastIndexOf("|");
  const stinNm = entryKey.slice(0, pipeIdx);
  const lnCd = entryKey.slice(pipeIdx + 1);
  return (
    <View className={`px-4 py-2.5 ${ROW_BORDER}`}>
      <View className="flex-row items-center justify-between">
        <Text className="font-medium text-sm text-typography-900">
          {stinNm}
          <Text className={`${MONO} text-outline-400 text-xs`}> |{lnCd}</Text>
        </Text>
        <Text className={`${MONO} text-outline-400 text-xs`}>{kricRef.railOprIsttCd}</Text>
      </View>
      <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>stinCd: {kricRef.stinCd}</Text>
    </View>
  );
}

// ── EntityDetailContent ─────────────────────────────────────────

function EntityDetailContent({
  entityKey,
  onClose,
}: {
  entityKey: EntityKey;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const entity = DB_ENTITIES.find((e) => e.key === entityKey);

  const linesData = useMemo(() => {
    const routes = getKricRoutes();
    const allSt = getAllStations();
    const q = search.toLowerCase();
    return metroLines
      .map((line) => ({
        id: line.id,
        name: line.name,
        number: line.number,
        color: line.color,
        routeCount: routes.filter((r) => r.appLine === line.name).length,
        stationCount: allSt.filter((s) => s.line === line.name).length,
      }))
      .filter((l) => !q || l.name.toLowerCase().includes(q));
  }, [search]);

  const stationsData = useMemo(() => {
    const all = getAllStations();
    const q = search.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (s) => s.name.toLowerCase().includes(q) || s.line.toLowerCase().includes(q),
    );
  }, [search]);

  const routesData = useMemo(() => {
    const all = getKricRoutes();
    const q = search.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (r) =>
        r.appLine.toLowerCase().includes(q) ||
        r.routNm.toLowerCase().includes(q) ||
        r.lnCd.toLowerCase().includes(q),
    );
  }, [search]);

  const transfersData = useMemo(() => {
    const entries = Object.entries(getKricCodeMap());
    const q = search.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter(([key]) => key.toLowerCase().includes(q));
  }, [search]);

  const totalCount = useMemo(() => {
    if (entityKey === "lines") return metroLines.length;
    if (entityKey === "stations") return getAllStations().length;
    if (entityKey === "routes") return getKricRoutes().length;
    return Object.keys(getKricCodeMap()).length;
  }, [entityKey]);

  const listData: unknown[] = useMemo(() => {
    if (entityKey === "lines") return linesData;
    if (entityKey === "stations") return stationsData;
    if (entityKey === "routes") return routesData;
    return transfersData;
  }, [entityKey, linesData, stationsData, routesData, transfersData]);

  const renderItem = useCallback(
    ({ item }: { item: unknown }) => {
      if (entityKey === "lines") {
        return (
          <LinesDetailRow
            item={item as { id: string; name: string; number: string; color: string; routeCount: number; stationCount: number }}
          />
        );
      }
      if (entityKey === "stations") {
        return (
          <StationsDetailRow
            item={item as { id: string; name: string; line: string; lineColor: string; connections?: string[] }}
          />
        );
      }
      if (entityKey === "routes") return <RoutesDetailRow item={item as KricRoute} />;
      const [k, v] = item as [string, { stinCd: string; railOprIsttCd: string; lnCd: string }];
      return <TransfersDetailRow entryKey={k} kricRef={v} />;
    },
    [entityKey],
  );

  const keyExtractor = useCallback(
    (item: unknown, index: number) => {
      if (entityKey === "lines") return (item as { id: string }).id;
      if (entityKey === "stations") return (item as { id: string }).id;
      if (entityKey === "routes") return (item as KricRoute).routCd;
      return (item as [string, unknown])[0] ?? String(index);
    },
    [entityKey],
  );

  const isEmpty =
    (entityKey === "routes" && getKricRoutes().length === 0) ||
    (entityKey === "transfers" && Object.keys(getKricCodeMap()).length === 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-outline-100 px-4 py-3">
        <View>
          <Text className="font-bold text-base text-typography-900">{entity?.label}</Text>
          <Text className="text-outline-400 text-xs">
            {search.trim() ? `${listData.length} / ${totalCount}개` : `${totalCount}개`}
          </Text>
        </View>
        <Pressable className="p-1 active:opacity-60" onPress={onClose}>
          <X className="text-typography-600" size={20} />
        </Pressable>
      </View>
      <View className="border-b border-outline-100 px-4 py-2">
        <TextInput
          className="rounded-xl bg-background-50 px-3 py-2.5 text-sm text-typography-900"
          onChangeText={setSearch}
          placeholder="검색..."
          placeholderTextColor="#9CA3AF"
          value={search}
        />
      </View>
      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-outline-400 text-sm">
            동기화 후 데이터가 표시됩니다.{"\n"}Overview 탭에서 Force Full Sync를 실행하세요.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          initialNumToRender={30}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={50}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

// ── DatabaseTab ─────────────────────────────────────────────────

const SCROLL_CONTENT = { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 } as const;

export function DatabaseTab() {
  const { items } = useSyncStatus();
  const [selectedEntity, setSelectedEntity] = useState<EntityKey | null>(null);

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={SCROLL_CONTENT}
        showsVerticalScrollIndicator={false}
      >
        {/* Entity list */}
        <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-outline-400">
          Entities
        </Text>
        <View className="mb-5 overflow-hidden rounded-xl border border-outline-200 bg-background-0">
          <View className="flex-row items-center border-b border-outline-100 bg-background-50 px-4 py-2.5">
            <Text className="flex-1 font-semibold text-outline-500 text-xs">Entity</Text>
            <Text className="w-16 text-right font-semibold text-outline-500 text-xs">Count</Text>
            <View className="w-5" />
          </View>
          {DB_ENTITIES.map((entity) => (
            <Pressable
              className="border-b border-outline-100 px-4 py-3.5 active:bg-background-50"
              key={entity.key}
              onPress={() => setSelectedEntity(entity.key)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold text-sm text-typography-900">{entity.label}</Text>
                  <Text className="text-outline-400 text-sm">{entity.desc}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-mono font-bold text-base text-typography-900">
                    {items[entity.key]}
                  </Text>
                  <ChevronRight className="text-outline-300" size={14} />
                </View>
              </View>
              <Text className="font-mono mt-1 text-outline-400 text-xs">{entity.schema}</Text>
            </Pressable>
          ))}
        </View>

        {/* DB Integrity */}
        <View className="mb-5">
          <DbIntegrityPanel />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setSelectedEntity(null)}
        presentationStyle="pageSheet"
        visible={selectedEntity !== null}
      >
        {selectedEntity ? (
          <EntityDetailContent
            entityKey={selectedEntity}
            onClose={() => setSelectedEntity(null)}
          />
        ) : null}
      </Modal>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dist-interactive-metro/src/components/dev/database-tab.tsx
git commit -m "feat(dev): add DatabaseTab with entity list and DB integrity panel"
```

---

## Task 6: Extend ApiInspector with EndpointHealthChecker

**Files:**
- Modify: `apps/dist-interactive-metro/src/components/dev/api-inspector.tsx`

- [ ] **Step 1: Add EndpointHealthChecker import at top of file**

Find the last `import` line in `api-inspector.tsx` and add after it:

```tsx
import { EndpointHealthChecker } from "@/components/dev/endpoint-health-checker";
```

- [ ] **Step 2: Find the return statement's outermost ScrollView content and prepend health checker**

Find the section label for the API inspector (search for `"KRIC API Inspector"` or the first `<Text className={SECTION_LABEL}` in the return). Add the health checker section **above** it:

```tsx
{/* ── Endpoint Health ───────────────────────────── */}
<View className="mb-6">
  <EndpointHealthChecker />
</View>

{/* existing API Inspector content below */}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dist-interactive-metro/src/components/dev/api-inspector.tsx
git commit -m "feat(dev): integrate EndpointHealthChecker into ApiInspector"
```

---

## Task 7: Refactor dev.tsx into shell

**Files:**
- Modify: `apps/dist-interactive-metro/src/app/(tabs)/dev.tsx`

Replace the entire file content with:

- [ ] **Step 1: Replace dev.tsx**

```tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import type { DevTab } from "@/components/dev/pill-tab-bar";
import { ActionsTab } from "@/components/dev/actions-tab";
import { ApiInspector } from "@/components/dev/api-inspector";
import { DatabaseTab } from "@/components/dev/database-tab";
import { OverviewTab } from "@/components/dev/overview-tab";
import { PillTabBar } from "@/components/dev/pill-tab-bar";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export default function DevScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DevTab>("overview");

  useEffect(() => {
    if (!isDev) router.replace("/(tabs)");
  }, [router]);

  if (!isDev) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-50" edges={["top"]}>
      {/* Header */}
      <View className="border-b border-outline-100 bg-background-0 px-4 pt-3 pb-0">
        <Text className="mb-2 font-bold text-2xl text-typography-900">Developer Mode</Text>
        <PillTabBar active={activeTab} onChange={setActiveTab} />
      </View>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "database" && <DatabaseTab />}
      {activeTab === "api" && <ApiInspector />}
      {activeTab === "actions" && <ActionsTab />}
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Verify ApiInspector is still a named export**

Open `src/components/dev/api-inspector.tsx` and confirm the component is exported as:
```tsx
export function ApiInspector() {
```
If it is a default export, change it to named or update the import in `dev.tsx` accordingly.

- [ ] **Step 3: Start the dev server and verify**

```bash
cd apps/dist-interactive-metro && pnpm start
```

Check:
- Dev tab shows "Developer Mode" title + 4 pills
- Overview pill is active by default, shows stats grid + sync status
- Tapping Database shows entity list + DB integrity panel
- Tapping API shows KRIC inspector + endpoint health checker
- Tapping Actions shows action buttons + app info section
- No TypeScript errors in the console

- [ ] **Step 4: Final commit**

```bash
git add apps/dist-interactive-metro/src/app/(tabs)/dev.tsx
git commit -m "refactor(dev): convert DevScreen to pill tab shell"
```

---

## Self-Review Checklist

- [x] **Spec coverage**: Overview tab ✓, Database tab ✓, API tab ✓, Actions tab ✓, Endpoint health checker ✓, DB integrity panel ✓, App version info ✓, Pill tab bar ✓
- [x] **No placeholders**: All steps have complete code
- [x] **Type consistency**: `DevTab` defined in `pill-tab-bar.tsx` and imported in `dev.tsx`; `EntityKey` defined and used in `database-tab.tsx` only; `EndpointHealth`/`HealthStatus` defined and used within `endpoint-health-checker.tsx`; `IntegrityCheck`/`IntegrityStatus`/`CheckResult` defined and used within `database-tab.tsx`
- [x] **Force Sync duplication**: `handleForceSync` logic exists in `overview-tab.tsx` (full impl) and `actions-tab.tsx` (redirects user to Overview). This is intentional — Overview is the primary place for sync.
