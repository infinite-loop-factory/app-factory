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

function findTransferPair(
  codeMap: KricCodeMap,
): [KricStationRef, KricStationRef] | null {
  const nameMap = new Map<string, KricStationRef[]>();
  for (const [key, ref] of Object.entries(codeMap)) {
    const name = key.split("|")[0];
    if (name) {
      if (!nameMap.has(name)) nameMap.set(name, []);
      nameMap.get(name)?.push(ref);
    }
  }
  const pair = [...nameMap.values()].find((refs) => refs.length >= 2);
  if (pair?.[0] && pair[1]) {
    return [pair[0], pair[1]];
  }
  return null;
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
