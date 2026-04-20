import type { SyncStatus } from "@/types/sync-status";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react-native";
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
    idle: {
      label: "Idle",
      dot: "bg-outline-300",
      text: "text-outline-500",
      Icon: Clock,
    },
    syncing: {
      label: "Syncing…",
      dot: "bg-primary-500",
      text: "text-primary-600",
      Icon: Loader2,
    },
    success: {
      label: "Success",
      dot: "bg-green-500",
      text: "text-green-600",
      Icon: CheckCircle2,
    },
    error: {
      label: "Error",
      dot: "bg-red-500",
      text: "text-red-600",
      Icon: AlertCircle,
    },
  };
  const { label, dot, text } = configs[status];
  return (
    <View className="flex-row items-center gap-2">
      <View className={`h-2 w-2 rounded-full ${dot}`} />
      <Text className={`font-semibold text-sm ${text}`}>{label}</Text>
    </View>
  );
}

// ── StatCard ──────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <View className="flex-1 rounded-xl border border-outline-200 bg-background-0 p-3">
      <Text className="mb-0.5 font-semibold text-outline-400 text-xs uppercase tracking-widest">
        {label}
      </Text>
      <Text className="font-bold text-2xl text-typography-900">{value}</Text>
      <Text className="text-outline-400 text-xs">{sub}</Text>
    </View>
  );
}

// ── OverviewTab ───────────────────────────────────────────────

const SCROLL_CONTENT = {
  paddingHorizontal: 20,
  paddingTop: 16,
  paddingBottom: 40,
} as const;

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
      <Text className="mb-2 font-semibold text-outline-400 text-xs uppercase tracking-widest">
        상태
      </Text>
      <View className="mb-5 overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        <View className="flex-row items-center justify-between border-outline-100 border-b px-4 py-3.5">
          <Text className="text-outline-600 text-sm">Sync Status</Text>
          <SyncStatusBadge status={status} />
        </View>
        <View className="flex-row items-center justify-between px-4 py-3.5">
          <Text className="text-outline-600 text-sm">Last sync</Text>
          <Text className="font-mono text-sm text-typography-800">
            {formatTimestamp(lastSyncTimestamp)}
          </Text>
        </View>
        {lastSyncError ? (
          <View className="border-outline-100 border-t bg-red-50 px-4 py-3">
            <Text className="font-mono text-red-700 text-sm">
              {lastSyncError}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Stats grid */}
      <Text className="mb-2 font-semibold text-outline-400 text-xs uppercase tracking-widest">
        데이터베이스
      </Text>
      <View className="mb-2 flex-row gap-3">
        <StatCard label="Lines" sub="노선" value={items.lines} />
        <StatCard label="Stations" sub="역" value={items.stations} />
      </View>
      <View className="mb-5 flex-row gap-3">
        <StatCard label="Routes" sub="경로 분기" value={items.routes} />
        <StatCard label="KRIC Codes" sub="역코드" value={items.transfers} />
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
        <Text className="font-semibold text-primary-700 text-sm">
          Force Full Sync
        </Text>
      </Pressable>
    </ScrollView>
  );
}
