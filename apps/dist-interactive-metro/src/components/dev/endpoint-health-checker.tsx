import type { KricCodeMap, KricStationRef } from "@/data/kric-station-sync";
import type { DayCd } from "@/lib/kric-api";

import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { getKricCodeMap } from "@/data/kric-station-sync";
import {
  fetchStationTimetable,
  fetchStationTransferInfo,
  fetchSubwayRouteInfo,
  fetchSubwayTimetable,
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
  {
    id: "subwayRouteInfo",
    label: "Route Info",
    path: "trainUseInfo/subwayRouteInfo",
  },
  {
    id: "subwayTimetable",
    label: "Subway Timetable",
    path: "trainUseInfo/subwayTimetable",
  },
  {
    id: "stationTimetable",
    label: "Station Timetable",
    path: "convenientInfo/stationTimetable",
  },
  {
    id: "stationTransferInfo",
    label: "Transfer Info",
    path: "convenientInfo/stationTransferInfo",
  },
  {
    id: "transferMovement",
    label: "Transfer Movement",
    path: "vulnerableUserInfo/transferMovement",
  },
];

// ── Param builders ─────────────────────────────────────────────

async function testDirection(
  fromRef: KricStationRef,
  toRef: KricStationRef,
  prevStinCd: string | undefined,
  nextStinCd: string | undefined,
) {
  if (!(prevStinCd && nextStinCd)) return null;
  try {
    const items = await fetchTransferMovement({
      railOprIsttCd: fromRef.railOprIsttCd,
      lnCd: fromRef.lnCd,
      stinCd: fromRef.stinCd,
      prevStinCd,
      chthTgtLn: toRef.lnCd,
      chtnNextStinCd: nextStinCd,
    });
    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

async function testHubCombination(
  fromRef: KricStationRef,
  toRef: KricStationRef,
) {
  try {
    const fromLineItems = await fetchSubwayRouteInfo({
      mreaWideCd: "01",
      lnCd: fromRef.lnCd,
    });
    const toLineItems = await fetchSubwayRouteInfo({
      mreaWideCd: "01",
      lnCd: toRef.lnCd,
    });

    const fromIdx = fromLineItems.findIndex((i) => i.stinCd === fromRef.stinCd);
    const toIdx = toLineItems.findIndex((i) => i.stinCd === toRef.stinCd);
    if (fromIdx === -1 || toIdx === -1) return null;

    const res1 = await testDirection(
      fromRef,
      toRef,
      fromLineItems[fromIdx - 1]?.stinCd,
      toLineItems[toIdx + 1]?.stinCd,
    );
    if (res1) return res1;

    return await testDirection(
      fromRef,
      toRef,
      fromLineItems[fromIdx + 1]?.stinCd,
      toLineItems[toIdx - 1]?.stinCd,
    );
  } catch {
    return null;
  }
}

async function testHub(hub: string, codeMap: KricCodeMap) {
  const refs = Object.entries(codeMap)
    .filter(([key]) => key.startsWith(`${hub}|`))
    .map(([_, ref]) => ref);

  if (refs.length < 2) return null;

  for (let i = 0; i < refs.length; i++) {
    for (let j = 0; j < refs.length; j++) {
      if (i === j) continue;
      const fromRef = refs[i];
      const toRef = refs[j];
      if (!(fromRef && toRef)) continue;

      const result = await testHubCombination(fromRef, toRef);
      if (result) return result;
    }
  }
  return null;
}

async function testTransferMovement(codeMap: KricCodeMap) {
  const CANDIDATES = ["서울역", "신도림", "고속터미널", "동대문역사문화공원"];

  for (const hub of CANDIDATES) {
    const result = await testHub(hub, codeMap);
    if (result) return { items: result };
  }

  return { items: [] };
}

async function checkEndpoint(
  id: string,
  codeMap: KricCodeMap,
  dayCd: DayCd,
): Promise<{ items: unknown[]; skipped?: boolean }> {
  const firstEntry = Object.values(codeMap)[0];

  try {
    switch (id) {
      case "subwayRouteInfo": {
        const items = await fetchSubwayRouteInfo({
          mreaWideCd: "01",
          lnCd: "2",
        });
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
      case "transferMovement":
        return await testTransferMovement(codeMap);
      default:
        return { items: [], skipped: true };
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("error 03")) {
      return { items: [] };
    }
    throw err;
  }
}

// ── HealthRow ──────────────────────────────────────────────────

function HealthRow({ entry }: { entry: EndpointHealth }) {
  const isChecking = entry.status === "checking";

  const badges: Record<HealthStatus, { label: string; cls: string }> = {
    untested: { label: "—", cls: "text-outline-400" },
    checking: { label: "…", cls: "text-primary-500" },
    ok: { label: "✓ OK", cls: "text-green-600" },
    error: { label: "✗ Error", cls: "text-red-600" },
    skipped: { label: "Skip", cls: "text-outline-400" },
  };
  const badge = badges[entry.status];

  return (
    <View className="border-outline-100 border-b px-4 py-3 last:border-0">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-semibold text-sm text-typography-900">
            {entry.label}
          </Text>
          <Text className="font-mono text-outline-400 text-xs">
            {entry.path}
          </Text>
        </View>
        {isChecking ? (
          <ActivityIndicator size="small" />
        ) : (
          <View className="items-end">
            <Text className={`font-semibold text-sm ${badge.cls}`}>
              {badge.label}
            </Text>
            {entry.status === "ok" && entry.responseTimeMs !== undefined ? (
              <Text className="font-mono text-outline-400 text-xs">
                {entry.responseTimeMs}ms · {entry.itemCount} items
              </Text>
            ) : null}
            {entry.status === "error" && entry.errorMessage ? (
              <Text
                className="font-mono text-red-400 text-xs"
                numberOfLines={2}
              >
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
    setResults(ENDPOINT_DEFS.map((d) => ({ ...d, status: "checking" })));

    try {
      const checks = ENDPOINT_DEFS.map(async (def) => {
        const start = Date.now();
        try {
          const { items, skipped } = await checkEndpoint(
            def.id,
            codeMap,
            dayCd,
          );
          const responseTimeMs = Date.now() - start;
          if (skipped) {
            return { ...def, status: "skipped" as HealthStatus };
          }
          return {
            ...def,
            status: "ok" as HealthStatus,
            responseTimeMs,
            itemCount: Array.isArray(items) ? items.length : 0,
          };
        } catch (err) {
          return {
            ...def,
            status: "error" as HealthStatus,
            responseTimeMs: Date.now() - start,
            errorMessage:
              err instanceof Error ? err.message.slice(0, 120) : String(err),
          };
        }
      });

      const settled = await Promise.allSettled(checks);
      setResults(
        ENDPOINT_DEFS.map((def, i) => {
          const res = settled[i];
          if (res?.status === "fulfilled") {
            return res.value;
          }
          return {
            ...def,
            status: "error" as HealthStatus,
            errorMessage: "Unexpected failure",
          };
        }),
      );
    } finally {
      setIsRunning(false);
    }
  }, []);

  const hasCodeMap = Object.keys(getKricCodeMap()).length > 0;
  const isDisabled = isRunning || !hasCodeMap;

  let buttonLabel = "Check All";
  if (isRunning) buttonLabel = "Checking…";
  else if (!hasCodeMap) buttonLabel = "Sync required";

  return (
    <View>
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-semibold text-outline-400 text-xs uppercase tracking-widest">
          Endpoint Health
        </Text>
        <Pressable
          className={`rounded-lg px-3 py-1.5 ${
            isDisabled
              ? "bg-background-100 opacity-50"
              : "border border-primary-200 bg-primary-50 active:bg-primary-100"
          }`}
          disabled={isDisabled}
          onPress={handleCheckAll}
        >
          <Text
            className={`font-semibold text-xs ${
              isDisabled ? "text-outline-400" : "text-primary-700"
            }`}
          >
            {buttonLabel}
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
