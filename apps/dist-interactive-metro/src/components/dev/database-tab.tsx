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

  const storeCount = stations.length;

  const linesWithRoutes = new Set(routes.map((r) => r.appLine));
  const missingRoutes = metroLines.filter((l) => !linesWithRoutes.has(l.name));

  const stationsWithConnections = stations.filter(
    (s) => s.connections && s.connections.length > 0,
  );
  const missingCodes = stationsWithConnections.filter(
    (s) => !codeMap[`${s.name}|${s.line}`],
  );

  const orphans = stations.filter((s) => !lineNames.has(s.line));

  return [
    {
      name: "Station count",
      result: storeCount > 0 ? "pass" : "warn",
      detail:
        storeCount > 0
          ? `${storeCount} stations in store`
          : "Store is empty — run Force Sync",
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
      result: (() => {
        if (Object.keys(codeMap).length === 0) return "warn" as CheckResult;
        if (missingCodes.length === 0) return "pass" as CheckResult;
        return "warn" as CheckResult;
      })(),
      detail: (() => {
        if (Object.keys(codeMap).length === 0)
          return "Code map empty — run Force Sync";
        if (missingCodes.length === 0)
          return "All transfer stations have KRIC codes";
        return `${missingCodes.length} transfer stations missing codes`;
      })(),
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
  const [integrityStatus, setIntegrityStatus] =
    useState<IntegrityStatus>("idle");
  const [checks, setChecks] = useState<IntegrityCheck[]>([]);

  const handleRunCheck = useCallback(() => {
    setIntegrityStatus("running");
    setTimeout(() => {
      setChecks(runIntegrityChecks());
      setIntegrityStatus("done");
    }, 0);
  }, []);

  const resultStyle: Record<CheckResult, { badge: string; text: string }> = {
    pass: {
      badge: "bg-green-50 border border-green-200",
      text: "text-green-700",
    },
    warn: {
      badge: "bg-amber-50 border border-amber-200",
      text: "text-amber-700",
    },
    fail: { badge: "bg-red-50 border border-red-200", text: "text-red-700" },
  };

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-semibold text-outline-400 text-xs uppercase tracking-widest">
          DB Integrity
        </Text>
        <Pressable
          className={`rounded-lg border border-outline-200 bg-background-0 px-3 py-1.5 active:bg-background-50 ${
            integrityStatus === "running" ? "opacity-50" : ""
          }`}
          disabled={integrityStatus === "running"}
          onPress={handleRunCheck}
        >
          <Text className="font-semibold text-outline-600 text-xs">
            {integrityStatus === "running" ? "Running…" : "Run Check"}
          </Text>
        </Pressable>
      </View>

      {integrityStatus !== "idle" && checks.length > 0 ? (
        <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
          {checks.map((check) => (
            <View
              className="border-outline-100 border-b px-4 py-3 last:border-0"
              key={check.name}
            >
              <View className="flex-row items-start justify-between gap-2">
                <Text className="flex-1 font-semibold text-sm text-typography-900">
                  {check.name}
                </Text>
                <View
                  className={`rounded-full px-2 py-0.5 ${resultStyle[check.result].badge}`}
                >
                  <Text
                    className={`font-semibold text-xs ${resultStyle[check.result].text}`}
                  >
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

// ── Entity detail rows ─────────────────────────────────────────

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
      if (entityKey === "routes")
        return <RoutesDetailRow item={item as KricRoute} />;
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
            동기화 후 데이터가 표시됩니다.{"\n"}Overview 탭에서 Force Full
            Sync를 실행하세요.
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

const SCROLL_CONTENT = {
  paddingHorizontal: 20,
  paddingTop: 16,
  paddingBottom: 40,
} as const;

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
        <Text className="mb-2 font-semibold text-outline-400 text-xs uppercase tracking-widest">
          Entities
        </Text>
        <View className="mb-5 overflow-hidden rounded-xl border border-outline-200 bg-background-0">
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
                  <Text className="font-bold font-mono text-base text-typography-900">
                    {items[entity.key]}
                  </Text>
                  <ChevronRight className="text-outline-300" size={14} />
                </View>
              </View>
              <Text className="mt-1 font-mono text-outline-400 text-xs">
                {entity.schema}
              </Text>
            </Pressable>
          ))}
        </View>

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
