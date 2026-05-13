import type { KricRoute, KricStationRef } from "@/data/kric-station-sync";
import type { Station } from "@/types/station";

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
import {
  APP_LINE_TO_LN_CD,
  getKricCodeMap,
  getKricRoutes,
} from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import { lines as metroLines } from "@/data/stations";
import { fetchSubwayRouteInfo } from "@/lib/kric-api";

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
  const missingCodes = stationsWithConnections.filter((s) => {
    const lnCd = APP_LINE_TO_LN_CD[s.line];
    if (!lnCd) return false;
    return !codeMap[`${s.name}|${lnCd}`];
  });

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
      result: (() => {
        if (routes.length === 0) return "warn" as CheckResult;
        return missingRoutes.length === 0 ? "pass" : ("warn" as CheckResult);
      })(),
      detail: (() => {
        if (routes.length === 0) return "Route data empty — run Force Sync";
        if (missingRoutes.length === 0)
          return `All ${metroLines.length} lines have routes`;
        return `${missingRoutes.length} lines missing routes: ${missingRoutes.map((l) => l.name).join(", ")}`;
      })(),
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

// ── KricCoverageDiagnostic ──────────────────────────────────────

interface CoverageMismatch {
  stationName: string;
  appLine: string;
  lnCd: string;
  lookupKey: string;
  /** Closest name found in API for the same line, null if line had 0 results */
  apiHint: string | null;
}

interface LineFetchSummary {
  appLine: string;
  lnCd: string;
  count: number;
  failed: boolean;
}

interface DiagnosticResult {
  totalChecked: number;
  matched: number;
  mismatches: CoverageMismatch[];
  failedLines: string[];
  lineSummary: LineFetchSummary[];
}

function KricCoverageDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const targets = Object.entries(APP_LINE_TO_LN_CD).map(
        ([appLine, lnCd]) => ({ appLine, lnCd }),
      );

      const settled = await Promise.allSettled(
        targets.map(async ({ lnCd }) => {
          const items = await fetchSubwayRouteInfo({
            mreaWideCd: "01",
            lnCd,
          });
          return { lnCd, items };
        }),
      );

      // Build live lookup set and per-line name map for hint resolution
      const liveKeys = new Set<string>();
      const apiNamesByLine = new Map<string, string[]>();
      const failedLines: string[] = [];
      const lineSummary: LineFetchSummary[] = [];

      targets.forEach(({ appLine, lnCd }, i) => {
        const r = settled[i];
        if (r?.status === "fulfilled") {
          const names = r.value.items.map((item) => item.stinNm);
          for (const nm of names) liveKeys.add(`${nm}|${lnCd}`);
          apiNamesByLine.set(lnCd, names);
          lineSummary.push({
            appLine,
            lnCd,
            count: names.length,
            failed: false,
          });
        } else {
          failedLines.push(appLine);
          lineSummary.push({ appLine, lnCd, count: 0, failed: true });
        }
      });

      // Compare against transfer stations in static data
      const stations = getAllStations();
      const transferStations = stations.filter(
        (s) => s.connections && s.connections.length > 0,
      );

      const mismatches: CoverageMismatch[] = [];
      for (const s of transferStations) {
        const lnCd = APP_LINE_TO_LN_CD[s.line];
        if (!lnCd) continue;
        const key = `${s.name}|${lnCd}`;
        if (!liveKeys.has(key)) {
          const apiNames = apiNamesByLine.get(lnCd) ?? [];
          // Find closest match: exact with 역 suffix, or partial containment
          const hint =
            apiNames.find(
              (n) =>
                n === `${s.name}역` ||
                n.replace("역", "") === s.name ||
                n.includes(s.name) ||
                s.name.includes(n),
            ) ?? null;
          mismatches.push({
            stationName: s.name,
            appLine: s.line,
            lnCd,
            lookupKey: key,
            apiHint: hint,
          });
        }
      }

      setResult({
        totalChecked: transferStations.length,
        matched: transferStations.length - mismatches.length,
        mismatches,
        failedLines,
        lineSummary,
      });
    } finally {
      setIsRunning(false);
    }
  }, []);

  return (
    <View className="mt-5">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-semibold text-outline-400 text-xs uppercase tracking-widest">
          KRIC API Coverage Diagnostic
        </Text>
        <Pressable
          className={`rounded-lg border border-outline-200 bg-background-0 px-3 py-1.5 active:bg-background-50 ${
            isRunning ? "opacity-50" : ""
          }`}
          disabled={isRunning}
          onPress={handleRun}
        >
          <Text className="font-semibold text-outline-600 text-xs">
            {isRunning ? "Fetching…" : "Compare Live API"}
          </Text>
        </Pressable>
      </View>

      {result ? (
        <View className="gap-3">
          {/* Summary row */}
          <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
            <View className="flex-row items-center gap-3 border-outline-100 border-b bg-background-50 px-4 py-2.5">
              <Text className="flex-1 font-semibold text-sm text-typography-900">
                {result.matched} / {result.totalChecked} matched
              </Text>
              {result.mismatches.length === 0 ? (
                <View className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5">
                  <Text className="font-semibold text-green-700 text-xs">
                    ALL PASS
                  </Text>
                </View>
              ) : (
                <View className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5">
                  <Text className="font-semibold text-amber-700 text-xs">
                    {result.mismatches.length} MISSING
                  </Text>
                </View>
              )}
            </View>

            {/* Per-line fetch summary */}
            {result.lineSummary.map((ls) => (
              <View
                className="flex-row items-center border-outline-100 border-b px-4 py-2"
                key={ls.lnCd}
              >
                <Text className="w-24 font-mono text-outline-500 text-xs">
                  {ls.lnCd}
                </Text>
                <Text className="flex-1 text-outline-700 text-xs">
                  {ls.appLine}
                </Text>
                {ls.failed ? (
                  <Text className="font-semibold text-red-500 text-xs">
                    FAIL
                  </Text>
                ) : (
                  <Text
                    className={`font-mono text-xs ${ls.count === 0 ? "text-amber-500" : "text-green-600"}`}
                  >
                    {ls.count} stations
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Mismatch list */}
          {result.mismatches.length > 0 ? (
            <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
              <View className="border-outline-100 border-b bg-background-50 px-4 py-2">
                <Text className="font-semibold text-outline-500 text-xs uppercase tracking-widest">
                  Missing stations
                </Text>
              </View>
              {result.mismatches.map((m) => (
                <View
                  className="border-outline-100 border-b px-4 py-2.5"
                  key={m.lookupKey}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-sm text-typography-900">
                      {m.stationName}
                    </Text>
                    <Text className="font-mono text-outline-400 text-xs">
                      {m.appLine}
                    </Text>
                  </View>
                  <Text className="mt-0.5 font-mono text-amber-600 text-xs">
                    expected: {m.lookupKey}
                  </Text>
                  {m.apiHint !== null ? (
                    <Text className="mt-0.5 font-mono text-blue-500 text-xs">
                      API has: "{m.apiHint}"
                    </Text>
                  ) : (
                    <Text className="mt-0.5 font-mono text-red-400 text-xs">
                      not found in line {m.lnCd} API data
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : null}

          {result.mismatches.length === 0 && result.failedLines.length === 0 ? (
            <View className="rounded-xl border border-outline-200 bg-background-0 px-4 py-3">
              <Text className="text-center text-outline-400 text-sm">
                All transfer stations found in live API
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

// ── Entity list item types ──────────────────────────────────────

/** Section header showing which API call produced the items below. */
type SectionHeaderItem = {
  _t: "h";
  id: string;
  appLine: string;
  lnCd: string;
  lineColor: string;
  /** Null = comes from the static bundle, not an API call. */
  apiCall: string | null;
  count: number;
};

type LineItem = {
  _t: "ln";
  id: string;
  name: string;
  number: string;
  color: string;
  lnCd: string;
  routeCount: number;
  stationCount: number;
};

type StationItem = { _t: "st"; station: Station };
type RouteItem = { _t: "rt"; route: KricRoute };
type TransferItem = {
  _t: "tr";
  stinNm: string;
  lnCd: string;
  ref: KricStationRef;
};

type EntityListItem =
  | SectionHeaderItem
  | LineItem
  | StationItem
  | RouteItem
  | TransferItem;

// ── Helper: reverse map lnCd → appLine ─────────────────────────

const LN_CD_TO_APP_LINE: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(APP_LINE_TO_LN_CD).map(([app, ln]) => [ln, app]),
);

// ── Shared sub-components ───────────────────────────────────────

const MONO = "font-mono";
const ROW_BORDER = "border-outline-50 border-b";

function ApiSectionHeader({ item }: { item: SectionHeaderItem }) {
  return (
    <View className="border-outline-200 border-b bg-background-50 px-4 py-2.5">
      <View className="flex-row items-center gap-2">
        <View
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: item.lineColor }}
        />
        <Text className="flex-1 font-semibold text-sm text-typography-900">
          {item.appLine}
        </Text>
        <Text className={`${MONO} text-outline-500 text-xs`}>
          {item.count}개
        </Text>
      </View>
      <Text
        className={`mt-0.5 pl-4 ${MONO} text-xs ${item.apiCall ? "text-blue-500" : "text-outline-400"}`}
      >
        {item.apiCall
          ? `GET subwayRouteInfo?mreaWideCd=01&lnCd=${item.lnCd}`
          : "static bundle"}
      </Text>
    </View>
  );
}

// ── Group-to-items helpers (extracted to stay under complexity limit) ──

function flattenStationGroups(
  groups: Map<string, Station[]>,
  lineColorMap: Record<string, string>,
): EntityListItem[] {
  const items: EntityListItem[] = [];
  for (const [appLine, stations] of groups) {
    const lnCd = APP_LINE_TO_LN_CD[appLine] ?? "";
    items.push({
      _t: "h",
      id: `h_st_${appLine}`,
      appLine,
      lnCd,
      lineColor: lineColorMap[appLine] ?? "#999",
      apiCall: lnCd,
      count: stations.length,
    });
    for (const st of stations) items.push({ _t: "st", station: st });
  }
  return items;
}

function flattenRouteGroups(
  groups: Map<string, KricRoute[]>,
): EntityListItem[] {
  const items: EntityListItem[] = [];
  for (const [appLine, routes] of groups) {
    const lnCd = routes[0]?.lnCd ?? "";
    items.push({
      _t: "h",
      id: `h_rt_${appLine}`,
      appLine,
      lnCd,
      lineColor: routes[0]?.lineColor ?? "#999",
      apiCall: lnCd,
      count: routes.length,
    });
    for (const r of routes) items.push({ _t: "rt", route: r });
  }
  return items;
}

function flattenTransferGroups(
  groups: Map<string, TransferItem[]>,
  lineColorMap: Record<string, string>,
): EntityListItem[] {
  const items: EntityListItem[] = [];
  for (const [lnCd, transfers] of groups) {
    const appLine = LN_CD_TO_APP_LINE[lnCd] ?? lnCd;
    items.push({
      _t: "h",
      id: `h_tr_${lnCd}`,
      appLine,
      lnCd,
      lineColor: lineColorMap[appLine] ?? "#999",
      apiCall: lnCd,
      count: transfers.length,
    });
    for (const tr of transfers) items.push(tr);
  }
  return items;
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

  const lineColorMap = useMemo(
    () => Object.fromEntries(metroLines.map((l) => [l.name, l.color])),
    [],
  );

  // ── Lines: flat list with lnCd badge per row ──────────────────
  const linesItems = useMemo((): EntityListItem[] => {
    const routes = getKricRoutes();
    const allSt = getAllStations();
    const q = search.toLowerCase();
    return metroLines
      .filter((l) => !q || l.name.toLowerCase().includes(q))
      .map((l) => ({
        _t: "ln" as const,
        id: l.id,
        name: l.name,
        number: l.number,
        color: l.color,
        lnCd: APP_LINE_TO_LN_CD[l.name] ?? "",
        routeCount: routes.filter((r) => r.appLine === l.name).length,
        stationCount: allSt.filter((s) => s.line === l.name).length,
      }));
  }, [search]);

  // ── Stations: grouped by line with API section headers ─────────
  const stationsItems = useMemo((): EntityListItem[] => {
    const all = getAllStations();
    const q = search.toLowerCase().trim();
    const groups = new Map<string, Station[]>();
    for (const s of all) {
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.line.toLowerCase().includes(q)
      )
        continue;
      let arr = groups.get(s.line);
      if (!arr) {
        arr = [];
        groups.set(s.line, arr);
      }
      arr.push(s);
    }
    return flattenStationGroups(groups, lineColorMap);
  }, [search, lineColorMap]);

  // ── Routes: grouped by appLine with API section headers ────────
  const routesItems = useMemo((): EntityListItem[] => {
    const all = getKricRoutes();
    const q = search.toLowerCase().trim();
    const groups = new Map<string, KricRoute[]>();
    for (const r of all) {
      if (
        q &&
        !r.appLine.toLowerCase().includes(q) &&
        !r.routNm.toLowerCase().includes(q) &&
        !r.routCd.toLowerCase().includes(q)
      )
        continue;
      let arr = groups.get(r.appLine);
      if (!arr) {
        arr = [];
        groups.set(r.appLine, arr);
      }
      arr.push(r);
    }
    return flattenRouteGroups(groups);
  }, [search]);

  // ── Transfers: grouped by lnCd with API section headers ────────
  const transfersItems = useMemo((): EntityListItem[] => {
    const q = search.toLowerCase().trim();
    const groups = new Map<string, TransferItem[]>();
    for (const [key, ref] of Object.entries(getKricCodeMap())) {
      if (q && !key.toLowerCase().includes(q)) continue;
      const pipe = key.lastIndexOf("|");
      const stinNm = key.slice(0, pipe);
      const lnCd = key.slice(pipe + 1);
      let arr = groups.get(lnCd);
      if (!arr) {
        arr = [];
        groups.set(lnCd, arr);
      }
      arr.push({ _t: "tr", stinNm, lnCd, ref });
    }
    return flattenTransferGroups(groups, lineColorMap);
  }, [search, lineColorMap]);

  const listItems = useMemo((): EntityListItem[] => {
    if (entityKey === "lines") return linesItems;
    if (entityKey === "stations") return stationsItems;
    if (entityKey === "routes") return routesItems;
    return transfersItems;
  }, [entityKey, linesItems, stationsItems, routesItems, transfersItems]);

  const totalCount = useMemo(() => {
    if (entityKey === "lines") return metroLines.length;
    if (entityKey === "stations") return getAllStations().length;
    if (entityKey === "routes") return getKricRoutes().length;
    return Object.keys(getKricCodeMap()).length;
  }, [entityKey]);

  const rowCount = useMemo(
    () => listItems.filter((i) => i._t !== "h").length,
    [listItems],
  );

  const renderItem = useCallback(({ item }: { item: EntityListItem }) => {
    if (item._t === "h") return <ApiSectionHeader item={item} />;

    if (item._t === "ln") {
      return (
        <View className={`px-4 py-3 ${ROW_BORDER}`}>
          <View className="flex-row items-center gap-3">
            <View
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <Text className="flex-1 font-semibold text-sm text-typography-900">
              {item.name}
            </Text>
            <Text
              className={`${MONO} rounded bg-background-50 px-1.5 py-0.5 text-outline-500 text-xs`}
            >
              lnCd: {item.lnCd}
            </Text>
          </View>
          <View className="mt-1 flex-row gap-3 pl-6">
            <Text className="text-outline-400 text-xs">
              경로 {item.routeCount}개
            </Text>
            <Text className="text-outline-400 text-xs">
              역 {item.stationCount}개
            </Text>
            <Text className={`${MONO} text-outline-300 text-xs`}>
              #{item.number}
            </Text>
          </View>
        </View>
      );
    }

    if (item._t === "st") {
      const s = item.station;
      return (
        <View className={`px-4 py-2.5 ${ROW_BORDER}`}>
          <View className="flex-row items-center gap-2">
            <View
              className="h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: s.lineColor }}
            />
            <Text className="font-semibold text-sm text-typography-900">
              {s.name}
            </Text>
          </View>
          {s.connections && s.connections.length > 0 ? (
            <Text className="mt-0.5 pl-4 text-outline-400 text-xs">
              환승: {s.connections.join(" · ")}
            </Text>
          ) : null}
        </View>
      );
    }

    if (item._t === "rt") {
      const r = item.route;
      return (
        <View className={`px-4 py-2.5 ${ROW_BORDER}`}>
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-sm text-typography-900">
              {r.routNm}
            </Text>
            <Text className={`${MONO} text-outline-500 text-xs`}>
              {r.stationCount}개 역
            </Text>
          </View>
          <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>
            routCd: {r.routCd}
          </Text>
        </View>
      );
    }

    // _t === "tr"
    return (
      <View className={`px-4 py-2.5 ${ROW_BORDER}`}>
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-sm text-typography-900">
            {item.stinNm}
          </Text>
          <Text className={`${MONO} text-outline-400 text-xs`}>
            {item.ref.railOprIsttCd}
          </Text>
        </View>
        <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>
          stinCd: {item.ref.stinCd}
        </Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback(
    (item: EntityListItem, index: number): string => {
      if (item._t === "h") return item.id;
      if (item._t === "ln") return item.id;
      if (item._t === "st") return item.station.id;
      if (item._t === "rt") return item.route.routCd;
      return `${item.stinNm}|${item.lnCd}` || String(index);
    },
    [],
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
              ? `${rowCount} / ${totalCount}개`
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
          data={listItems}
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

        <View className="mb-5">
          <KricCoverageDiagnostic />
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
