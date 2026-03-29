import type { KricRoute } from "@/data/kric-station-sync";
import type { SyncStatus } from "@/types/sync-status";

import { useRouter } from "expo-router";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ApiInspector } from "@/components/dev/api-inspector";
import { useSyncStatus } from "@/context/sync-status-context";
import { useUpdateBanner } from "@/context/update-banner-context";
import {
  checkAndRefreshData,
  getKricCodeMap,
  getKricRoutes,
} from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import { lines as metroLines } from "@/data/stations";

// ── Constants ────────────────────────────────────────────────

const DB_ENTITIES = [
  {
    key: "lines",
    label: "Lines",
    desc: "노선",
    schema: "id, name, number, color",
  },
  {
    key: "stations",
    label: "Stations",
    desc: "역 (전체)",
    schema: "id, name, line, lineColor, connections?",
  },
  {
    key: "routes",
    label: "Routes",
    desc: "노선 경로 (분기 포함)",
    schema: "lnCd, routCd, routNm, stationCount",
  },
  {
    key: "transfers",
    label: "Transfers",
    desc: "KRIC 역코드",
    schema: "stinNm|lnCd → { stinCd, railOprIsttCd, lnCd }",
  },
] as const;

type EntityKey = (typeof DB_ENTITIES)[number]["key"];

const SCROLL_CONTENT = {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 48,
} as const;

// ── Helpers ──────────────────────────────────────────────────

function formatTimestamp(ms: number | null): string {
  if (ms == null) return "—";
  return new Date(ms).toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

// ── Shared style tokens ───────────────────────────────────────

const SECTION_LABEL =
  "mb-3 text-xs font-semibold uppercase tracking-widest text-outline-400";
const CARD = "rounded-xl border border-outline-200 bg-background-0";
const MONO = "font-mono";
const ROW_BORDER = "border-outline-50 border-b";

// ── SyncBadge ─────────────────────────────────────────────────

function SyncBadge({ status }: { status: SyncStatus }) {
  const config = {
    idle: {
      label: "Idle",
      textClass: "text-outline-500",
      dotClass: "bg-outline-300",
      Icon: Clock,
    },
    syncing: {
      label: "Syncing…",
      textClass: "text-primary-600",
      dotClass: "bg-primary-500",
      Icon: Loader2,
    },
    success: {
      label: "Success",
      textClass: "text-green-600",
      dotClass: "bg-green-500",
      Icon: CheckCircle2,
    },
    error: {
      label: "Error",
      textClass: "text-red-600",
      dotClass: "bg-red-500",
      Icon: AlertCircle,
    },
  };
  const { label, textClass, dotClass } = config[status];
  return (
    <View className="flex-row items-center gap-2">
      <View className={`h-2 w-2 rounded-full ${dotClass}`} />
      <Text className={`font-semibold text-sm ${textClass}`}>{label}</Text>
    </View>
  );
}

// ── Sync log type ─────────────────────────────────────────────

interface SyncLogEntry {
  timestamp: number;
  linesChecked: number;
  checksumChanged: boolean;
  totalStations: number;
  totalCodeMap: number;
}

// ── Entity Detail — row renderers ─────────────────────────────

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
      <View
        className="h-3 w-3 flex-shrink-0 rounded-full"
        style={{ backgroundColor: item.color }}
      />
      <View className="flex-1">
        <Text className="font-semibold text-sm text-typography-900">
          {item.name}
        </Text>
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
  item: {
    id: string;
    name: string;
    line: string;
    lineColor: string;
    connections?: string[];
  };
}) {
  return (
    <View className={`px-4 py-3 ${ROW_BORDER}`}>
      <View className="flex-row items-center gap-2">
        <View
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: item.lineColor }}
        />
        <Text className="font-semibold text-sm text-typography-900">
          {item.name}
        </Text>
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
      <View
        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: item.lineColor }}
      />
      <View className="flex-1">
        <Text className="font-semibold text-sm text-typography-900">
          {item.routNm}
        </Text>
        <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>
          {item.lnCd} · {item.routCd}
        </Text>
      </View>
      <Text className={`${MONO} text-outline-500 text-xs`}>
        {item.stationCount}개 역
      </Text>
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
        <Text className={`${MONO} text-outline-400 text-xs`}>
          {kricRef.railOprIsttCd}
        </Text>
      </View>
      <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>
        stinCd: {kricRef.stinCd}
      </Text>
    </View>
  );
}

// ── Entity Detail Content ─────────────────────────────────────

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
      (s) =>
        s.name.toLowerCase().includes(q) || s.line.toLowerCase().includes(q),
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
            item={
              item as {
                id: string;
                name: string;
                number: string;
                color: string;
                routeCount: number;
                stationCount: number;
              }
            }
          />
        );
      }
      if (entityKey === "stations") {
        return (
          <StationsDetailRow
            item={
              item as {
                id: string;
                name: string;
                line: string;
                lineColor: string;
                connections?: string[];
              }
            }
          />
        );
      }
      if (entityKey === "routes") {
        return <RoutesDetailRow item={item as KricRoute} />;
      }
      const [k, v] = item as [
        string,
        { stinCd: string; railOprIsttCd: string; lnCd: string },
      ];
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
      {/* Header */}
      <View className="flex-row items-center justify-between border-outline-100 border-b px-4 py-3">
        <View>
          <Text className="font-bold text-base text-typography-900">
            {entity?.label}
          </Text>
          <Text className="text-outline-400 text-xs">
            {search.trim()
              ? `${listData.length} / ${totalCount}개`
              : `${totalCount}개`}
          </Text>
        </View>
        <Pressable className="p-1 active:opacity-60" onPress={onClose}>
          <X className="text-typography-600" size={20} />
        </Pressable>
      </View>

      {/* Search */}
      <View className="border-outline-100 border-b px-4 py-2">
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
            동기화 후 데이터가 표시됩니다.{"\n"}Dev 탭에서 Force Full Sync를
            실행하세요.
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

// ── Entity Detail Modal ───────────────────────────────────────

function EntityDetailModal({
  entityKey,
  onClose,
}: {
  entityKey: EntityKey | null;
  onClose: () => void;
}) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      visible={entityKey !== null}
    >
      {entityKey ? (
        <EntityDetailContent entityKey={entityKey} onClose={onClose} />
      ) : null}
    </Modal>
  );
}

// ── Dev guard ─────────────────────────────────────────────────

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

// ── Screen ───────────────────────────────────────────────────

export default function DevScreen() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [syncLog, setSyncLog] = useState<SyncLogEntry | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityKey | null>(null);

  useEffect(() => {
    if (!isDev) router.replace("/(tabs)");
  }, [router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const {
    status,
    lastSyncTimestamp,
    lastSyncError,
    items,
    setSyncStatus,
    setLastSync,
    resetSyncState,
  } = useSyncStatus();

  const { showBanner } = useUpdateBanner();

  // ── Force full sync ─────────────────────────────────────────

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

        setSyncLog({
          timestamp: Date.now(),
          linesChecked: result.linesChecked,
          checksumChanged: result.updated,
          totalStations,
          totalCodeMap,
        });

        const bannerMsg = result.updated
          ? `데이터 변경 감지 · ${totalCodeMap}개 역 코드`
          : `데이터 최신 상태 · ${totalCodeMap}개 역 코드`;
        showBanner(bannerMsg, result.updated ? "success" : "info");
      })
      .catch((err: unknown) => {
        setLastSync(
          Date.now(),
          items,
          err instanceof Error ? err.message : "Sync failed",
        );
      });
  }, [setSyncStatus, setLastSync, items, showBanner]);

  // ── Simulate error ──────────────────────────────────────────

  const handleSimulateError = useCallback(() => {
    setSyncStatus("syncing");
    timerRef.current = setTimeout(() => {
      setLastSync(Date.now(), items, "Network error (simulated)");
    }, 1000);
  }, [setSyncStatus, setLastSync, items]);

  // ── Test banner ─────────────────────────────────────────────

  const handleTestBanner = useCallback(() => {
    showBanner("배너 테스트 · 4.5초 후 자동 닫힘", "info");
  }, [showBanner]);

  if (!isDev) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={SCROLL_CONTENT}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text className="mb-6 font-bold text-2xl text-typography-900">
          Developer Mode
        </Text>

        {/* ── Database Entities ─────────────────────── */}
        <Text className={SECTION_LABEL}>Database entities</Text>
        <View className={`${CARD} mb-8 overflow-hidden`}>
          {/* Header */}
          <View className="flex-row items-center border-outline-100 border-b bg-background-50 px-4 py-2.5">
            <Text className="flex-1 font-semibold text-outline-500 text-xs">
              Entity
            </Text>
            <Text className="w-16 text-right font-semibold text-outline-500 text-xs">
              Count
            </Text>
            <View className="w-5" />
          </View>
          {DB_ENTITIES.map((entity) => (
            <Pressable
              className="border-outline-100 border-b px-4 py-3.5 active:bg-background-50"
              key={entity.key}
              onPress={() => setSelectedEntity(entity.key)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="font-semibold text-sm text-typography-900">
                    {entity.label}
                  </Text>
                  <Text className="text-outline-400 text-sm">
                    {entity.desc}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text
                    className={`${MONO} font-bold text-base text-typography-900`}
                  >
                    {items[entity.key]}
                  </Text>
                  <ChevronRight className="text-outline-300" size={14} />
                </View>
              </View>
              <Text className={`${MONO} mt-1 text-outline-400 text-xs`}>
                {entity.schema}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Sync Status ───────────────────────────── */}
        <Text className={SECTION_LABEL}>Sync status</Text>
        <View className={`${CARD} mb-8 overflow-hidden`}>
          <View className="flex-row items-center justify-between border-outline-100 border-b px-4 py-4">
            <Text className="text-outline-600 text-sm">Status</Text>
            <SyncBadge status={status} />
          </View>

          <View className="flex-row items-center justify-between border-outline-100 border-b px-4 py-3.5">
            <Text className="text-outline-600 text-sm">Last sync</Text>
            <Text className={`${MONO} text-sm text-typography-800`}>
              {formatTimestamp(lastSyncTimestamp)}
            </Text>
          </View>

          {DB_ENTITIES.map((entity, i) => (
            <View
              className={`flex-row items-center justify-between px-4 py-3 ${i < DB_ENTITIES.length - 1 ? "border-outline-50 border-b" : ""}`}
              key={entity.key}
            >
              <Text className="text-outline-500 text-sm">{entity.label}</Text>
              <Text
                className={`${MONO} font-semibold text-sm text-typography-800`}
              >
                {items[entity.key]}
              </Text>
            </View>
          ))}

          {syncLog ? (
            <View className="border-outline-100 border-t bg-background-50 px-4 py-3">
              <Text className="mb-2 font-semibold text-outline-400 text-xs uppercase tracking-widest">
                Last force sync
              </Text>
              <View className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-outline-500 text-xs">Time</Text>
                  <Text className={`${MONO} text-outline-700 text-xs`}>
                    {formatTimestamp(syncLog.timestamp)}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-outline-500 text-xs">
                    Lines checked
                  </Text>
                  <Text className={`${MONO} text-outline-700 text-xs`}>
                    {syncLog.linesChecked}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-outline-500 text-xs">Checksum</Text>
                  <View className="flex-row items-center gap-1.5">
                    <View
                      className={`h-2 w-2 rounded-full ${syncLog.checksumChanged ? "bg-amber-400" : "bg-green-400"}`}
                    />
                    <Text
                      className={`${MONO} text-xs ${syncLog.checksumChanged ? "text-amber-600" : "text-green-600"}`}
                    >
                      {syncLog.checksumChanged ? "changed" : "unchanged"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-outline-500 text-xs">
                    Total stations
                  </Text>
                  <Text className={`${MONO} text-outline-700 text-xs`}>
                    {syncLog.totalStations}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-outline-500 text-xs">Code map</Text>
                  <Text className={`${MONO} text-outline-700 text-xs`}>
                    {syncLog.totalCodeMap} entries
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {lastSyncError ? (
            <View className="border-outline-100 border-t bg-red-50 px-4 py-3">
              <Text className="mb-1 font-semibold text-red-500 text-xs">
                Error
              </Text>
              <Text className={`${MONO} text-red-700 text-sm`}>
                {lastSyncError}
              </Text>
            </View>
          ) : null}
        </View>

        {/* ── API Inspector ─────────────────────────── */}
        <View className="mb-8">
          <ApiInspector />
        </View>

        {/* ── Dev Actions ───────────────────────────── */}
        <Text className={SECTION_LABEL}>Actions</Text>
        <View className="gap-3">
          <Pressable
            accessibilityLabel="Force full sync"
            accessibilityRole="button"
            accessibilityState={{ disabled: status === "syncing" }}
            className={`flex-row items-center justify-center gap-3 rounded-xl border border-primary-200 bg-primary-50 py-4 ${status === "syncing" ? "opacity-50" : "active:bg-primary-100"}`}
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

          <Pressable
            accessibilityLabel="Test update banner"
            accessibilityRole="button"
            className="flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 bg-background-0 py-4 active:bg-background-50"
            onPress={handleTestBanner}
          >
            <Bell className="text-typography-700" size={18} />
            <Text className="font-semibold text-sm text-typography-900">
              Test Update Banner
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Simulate sync error"
            accessibilityRole="button"
            accessibilityState={{ disabled: status === "syncing" }}
            className={`flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 bg-background-0 py-4 ${status === "syncing" ? "opacity-50" : "active:bg-background-50"}`}
            disabled={status === "syncing"}
            onPress={handleSimulateError}
          >
            <AlertCircle className="text-red-500" size={18} />
            <Text className="font-semibold text-red-600 text-sm">
              Simulate Sync Error
            </Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Reset sync state"
            accessibilityRole="button"
            className="flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 border-dashed bg-background-50 py-4 active:bg-background-100"
            onPress={resetSyncState}
          >
            <Text className="font-medium text-outline-500 text-sm">
              Reset Sync State
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Entity Detail Modal */}
      <EntityDetailModal
        entityKey={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />
    </SafeAreaView>
  );
}
