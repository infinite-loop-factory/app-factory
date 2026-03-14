/**
 * KRIC API Inspector — dev-only component for testing each KRIC endpoint
 * with selectable parameters and formatted result display.
 */

import type { DayCd } from "@/lib/kric-api";
import type { Station } from "@/types/station";

import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { getKricRef } from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import {
  fetchStationTimetable,
  fetchStationTransferInfo,
  fetchSubwayRouteInfo,
  fetchSubwayTimetable,
  fetchTransferMovement,
  getCurrentDayCd,
} from "@/lib/kric-api";

// ── Constants ────────────────────────────────────────────────

const KRIC_LINES = [
  { lnCd: "1", appLine: "1호선", color: "#263C96" },
  { lnCd: "2", appLine: "2호선", color: "#3CB44A" },
  { lnCd: "3", appLine: "3호선", color: "#EF7C1C" },
  { lnCd: "4", appLine: "4호선", color: "#00A2D1" },
  { lnCd: "5", appLine: "5호선", color: "#996CAC" },
  { lnCd: "6", appLine: "6호선", color: "#CD7C2F" },
  { lnCd: "7", appLine: "7호선", color: "#747F00" },
  { lnCd: "8", appLine: "8호선", color: "#E6186C" },
  { lnCd: "9", appLine: "9호선", color: "#BDB092" },
  { lnCd: "A1", appLine: "공항철도", color: "#0090D2" },
  { lnCd: "K1", appLine: "경의중앙선", color: "#77C4A3" },
  { lnCd: "K4", appLine: "경춘선", color: "#0C8E72" },
  { lnCd: "K2", appLine: "수인분당선", color: "#FABE00" },
  { lnCd: "D1", appLine: "신분당선", color: "#D4003B" },
] as const;

type KricLine = (typeof KRIC_LINES)[number];

type EndpointId =
  | "subwayRouteInfo"
  | "subwayTimetable"
  | "stationTimetable"
  | "stationTransferInfo"
  | "transferMovement";

const ENDPOINTS: {
  id: EndpointId;
  label: string;
  path: string;
  desc: string;
  needsStation: boolean;
  needsDay: boolean;
  needsTransferExtras: boolean;
}[] = [
  {
    id: "subwayRouteInfo",
    label: "Route Info",
    path: "trainUseInfo/subwayRouteInfo",
    desc: "All stations on a line in sequence order",
    needsStation: false,
    needsDay: false,
    needsTransferExtras: false,
  },
  {
    id: "subwayTimetable",
    label: "Subway Timetable",
    path: "trainUseInfo/subwayTimetable",
    desc: "Timetable entries for a station on a given day",
    needsStation: true,
    needsDay: true,
    needsTransferExtras: false,
  },
  {
    id: "stationTimetable",
    label: "Station Timetable",
    path: "convenientInfo/stationTimetable",
    desc: "Departures with terminus (direction) info — used by Notifications tab",
    needsStation: true,
    needsDay: true,
    needsTransferExtras: false,
  },
  {
    id: "stationTransferInfo",
    label: "Transfer Info",
    path: "convenientInfo/stationTransferInfo",
    desc: "Transfer distance & platform info — used in route detail cards",
    needsStation: true,
    needsDay: false,
    needsTransferExtras: false,
  },
  {
    id: "transferMovement",
    label: "Transfer Path",
    path: "vulnerableUserInfo/transferMovement",
    desc: "Step-by-step accessible transfer path with elevator status",
    needsStation: true,
    needsDay: false,
    needsTransferExtras: true,
  },
];

const DAY_OPTIONS: { cd: DayCd; label: string }[] = [
  { cd: "8", label: "Weekday" },
  { cd: "7", label: "Saturday" },
  { cd: "9", label: "Sunday" },
];

// ── Sub-components ───────────────────────────────────────────

interface StationSearchInputProps {
  label: string;
  lineName: string;
  value: string;
  selected: Station | null;
  onChangeText: (t: string) => void;
  onSelect: (s: Station) => void;
  onClear: () => void;
}

function StationSearchInput({
  label,
  lineName,
  value,
  selected,
  onChangeText,
  onSelect,
  onClear,
}: StationSearchInputProps) {
  const suggestions = useMemo(() => {
    if (!value.trim() || selected) return [];
    const lower = value.toLowerCase();
    return getAllStations()
      .filter(
        (s) => s.line === lineName && s.name.toLowerCase().includes(lower),
      )
      .slice(0, 8);
  }, [value, lineName, selected]);

  return (
    <View className="mb-3">
      <Text className="mb-1 text-outline-500 text-xs">{label}</Text>
      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 rounded-lg border border-outline-200 bg-background-50 px-3 py-2 text-sm text-typography-900"
          onChangeText={(t) => {
            if (selected) onClear();
            onChangeText(t);
          }}
          placeholder={`Search ${lineName}…`}
          placeholderTextColor="#9CA3AF"
          value={selected ? selected.name : value}
        />
        {selected && (
          <Pressable
            className="rounded-lg bg-outline-100 p-2"
            onPress={onClear}
          >
            <Text className="text-outline-600 text-xs">✕</Text>
          </Pressable>
        )}
      </View>
      {suggestions.length > 0 && (
        <View className="mt-1 overflow-hidden rounded-lg border border-outline-200 bg-background-0">
          {suggestions.map((s) => (
            <Pressable
              className="border-outline-100 border-b px-3 py-2 active:bg-background-50"
              key={s.id}
              onPress={() => onSelect(s)}
            >
              <Text className="text-sm text-typography-800">{s.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {selected && (
        <View className="mt-1 flex-row items-center gap-1">
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: selected.lineColor }}
          />
          <Text className="text-green-600 text-xs">
            {selected.name} selected
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Result renderers ─────────────────────────────────────────

function formatTime(raw: string): string {
  if (raw.length < 4) return raw;
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
}

function RouteInfoResult({ items }: { items: unknown[] }) {
  const rows = items as {
    stinConsOrdr: string;
    stinNm: string;
    stinCd: string;
    railOprIsttCd: string;
  }[];
  return (
    <>
      {rows.map((r, i) => (
        <View
          className="flex-row items-center gap-3 border-outline-100 border-b px-3 py-2"
          key={`${r.stinCd}-${i}`}
        >
          <Text className="w-8 text-right font-mono text-outline-400 text-xs">
            {r.stinConsOrdr}
          </Text>
          <Text className="flex-1 text-sm text-typography-900">{r.stinNm}</Text>
          <Text className="font-mono text-outline-500 text-xs">{r.stinCd}</Text>
        </View>
      ))}
    </>
  );
}

function TimetableResult({
  items,
  showTerminus,
}: {
  items: unknown[];
  showTerminus: boolean;
}) {
  const rows = items as {
    dptTm: string;
    arvTm: string;
    trnNo: string;
    tmnStinCd?: string;
  }[];
  return (
    <>
      {rows.slice(0, 30).map((r, i) => {
        const time = r.dptTm || r.arvTm;
        return (
          <View
            className="flex-row items-center gap-3 border-outline-100 border-b px-3 py-2"
            key={`${r.trnNo}-${i}`}
          >
            <Text className="w-14 font-mono text-sm text-typography-900">
              {formatTime(time)}
            </Text>
            <Text className="flex-1 font-mono text-outline-500 text-xs">
              #{r.trnNo}
            </Text>
            {showTerminus && r.tmnStinCd && (
              <Text className="text-outline-400 text-xs">→ {r.tmnStinCd}</Text>
            )}
          </View>
        );
      })}
      {rows.length > 30 && (
        <Text className="px-3 py-2 text-center text-outline-400 text-xs">
          + {rows.length - 30} more
        </Text>
      )}
    </>
  );
}

function TransferInfoResult({ items }: { items: unknown[] }) {
  const rows = items as {
    chtnLn: string;
    chtnDst: string;
    stLocCont: string;
    clsLocCont: string;
  }[];
  return (
    <>
      {rows.map((r, i) => (
        <View
          className="gap-1 border-outline-100 border-b px-3 py-3"
          key={`${r.chtnLn}-${i}`}
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-medium text-sm text-typography-900">
              {r.chtnLn}
            </Text>
            <Text className="font-mono text-sm text-typography-800">
              {r.chtnDst}m
              <Text className="text-outline-500 text-xs">
                {" "}
                (~{Math.ceil(Number(r.chtnDst) / 80)} min walk)
              </Text>
            </Text>
          </View>
          {r.stLocCont ? (
            <Text className="text-outline-500 text-xs">
              {r.stLocCont} → {r.clsLocCont}
            </Text>
          ) : null}
        </View>
      ))}
    </>
  );
}

function TransferMovementResult({ items }: { items: unknown[] }) {
  const rows = items as {
    chtnMvTpOrdr: string;
    mvContDtl: string;
    stMovePath: string;
    edMovePath: string;
    elvtTpCd: string;
    elvtSttCd: string;
  }[];
  return (
    <>
      {rows.map((r, i) => {
        const hasElevator = r.elvtTpCd !== "" && r.elvtTpCd !== "0";
        return (
          <View
            className="gap-1 border-outline-100 border-b px-3 py-3"
            key={`${r.chtnMvTpOrdr}-${i}`}
          >
            <View className="flex-row items-center gap-2">
              <View className="h-5 w-5 items-center justify-center rounded-full bg-primary-100">
                <Text className="font-bold text-primary-700 text-xs">
                  {r.chtnMvTpOrdr}
                </Text>
              </View>
              <Text className="flex-1 text-sm text-typography-900">
                {r.mvContDtl}
              </Text>
              {hasElevator && (
                <Text
                  className={`text-xs ${r.elvtSttCd === "1" ? "text-green-600" : "text-red-500"}`}
                >
                  {r.elvtSttCd === "1" ? "🛗 OK" : "🛗 ✕"}
                </Text>
              )}
            </View>
            {r.stMovePath && (
              <Text className="pl-7 text-outline-400 text-xs">
                {r.stMovePath} → {r.edMovePath}
              </Text>
            )}
          </View>
        );
      })}
    </>
  );
}

// ── API call executor (outside component to reduce complexity) ─

import type { KricStationRef } from "@/data/kric-station-sync";

function executeApiCall(
  endpoint: EndpointId,
  selectedLine: KricLine,
  dayCd: DayCd,
  kricRef: KricStationRef | null,
  prevRef: KricStationRef | null,
  nextRef: KricStationRef | null,
  targetLnCd: string,
): Promise<unknown[]> {
  if (endpoint === "subwayRouteInfo") {
    return fetchSubwayRouteInfo({ mreaWideCd: "01", lnCd: selectedLine.lnCd });
  }
  if (endpoint === "subwayTimetable") {
    if (!kricRef) throw new Error("Station not synced");
    return fetchSubwayTimetable({
      railOprIsttCd: kricRef.railOprIsttCd,
      dayCd,
      lnCd: kricRef.lnCd,
      stinCd: kricRef.stinCd,
    });
  }
  if (endpoint === "stationTimetable") {
    if (!kricRef) throw new Error("Station not synced");
    return fetchStationTimetable({
      railOprIsttCd: kricRef.railOprIsttCd,
      dayCd,
      lnCd: kricRef.lnCd,
      stinCd: kricRef.stinCd,
    });
  }
  if (endpoint === "stationTransferInfo") {
    if (!kricRef) throw new Error("Station not synced");
    return fetchStationTransferInfo({
      railOprIsttCd: kricRef.railOprIsttCd,
      lnCd: kricRef.lnCd,
      stinCd: kricRef.stinCd,
    });
  }
  // transferMovement
  if (!(kricRef && prevRef && nextRef))
    throw new Error("All stations must be set");
  return fetchTransferMovement({
    railOprIsttCd: kricRef.railOprIsttCd,
    lnCd: kricRef.lnCd,
    stinCd: kricRef.stinCd,
    prevStinCd: prevRef.stinCd,
    chthTgtLn: targetLnCd,
    chtnNextStinCd: nextRef.stinCd,
  });
}

// ── Transfer extras sub-component ────────────────────────────

interface TransferExtrasProps {
  fromLineName: string;
  targetLine: KricLine;
  prevQuery: string;
  prevStation: Station | null;
  nextQuery: string;
  nextStation: Station | null;
  onPrevQueryChange: (t: string) => void;
  onPrevSelect: (s: Station) => void;
  onPrevClear: () => void;
  onTargetLineChange: (l: KricLine) => void;
  onNextQueryChange: (t: string) => void;
  onNextSelect: (s: Station) => void;
  onNextClear: () => void;
}

function TransferExtras({
  fromLineName,
  targetLine,
  prevQuery,
  prevStation,
  nextQuery,
  nextStation,
  onPrevQueryChange,
  onPrevSelect,
  onPrevClear,
  onTargetLineChange,
  onNextQueryChange,
  onNextSelect,
  onNextClear,
}: TransferExtrasProps) {
  return (
    <View className="mb-3 rounded-lg border border-outline-100 bg-background-50 p-3">
      <Text className="mb-3 font-medium text-outline-600 text-xs">
        Transfer details
      </Text>

      <StationSearchInput
        label={`Previous station on ${fromLineName}`}
        lineName={fromLineName}
        onChangeText={onPrevQueryChange}
        onClear={onPrevClear}
        onSelect={onPrevSelect}
        selected={prevStation}
        value={prevQuery}
      />

      <Text className="mb-1 text-outline-500 text-xs">Transfer to line</Text>
      <ScrollView
        className="mb-3"
        contentContainerStyle={{ gap: 6 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {KRIC_LINES.map((line) => (
          <Pressable
            className="rounded-full px-3 py-1"
            key={line.lnCd}
            onPress={() => onTargetLineChange(line)}
            style={{
              backgroundColor:
                targetLine.lnCd === line.lnCd ? line.color : `${line.color}22`,
            }}
          >
            <Text
              className="font-medium text-xs"
              style={{
                color: targetLine.lnCd === line.lnCd ? "#fff" : line.color,
              }}
            >
              {line.appLine}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <StationSearchInput
        label={`Next station on ${targetLine.appLine}`}
        lineName={targetLine.appLine}
        onChangeText={onNextQueryChange}
        onClear={onNextClear}
        onSelect={onNextSelect}
        selected={nextStation}
        value={nextQuery}
      />
    </View>
  );
}

// ── Results sub-component ─────────────────────────────────────

interface InspectorResultsProps {
  endpoint: EndpointId;
  items: unknown[] | null;
  error: string | null;
}

function InspectorResults({ endpoint, items, error }: InspectorResultsProps) {
  if (items === null && !error) return null;
  return (
    <View className="border-outline-100 border-t">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="font-medium text-outline-600 text-xs uppercase tracking-wide">
          Results
        </Text>
        {items !== null && (
          <Text className="font-mono text-outline-500 text-xs">
            {items.length} items
          </Text>
        )}
      </View>
      {error && (
        <View className="mx-4 mb-4 rounded-lg bg-red-50 p-3">
          <Text className="text-red-700 text-xs">{error}</Text>
        </View>
      )}
      {items !== null && items.length === 0 && (
        <Text className="px-4 pb-4 text-outline-400 text-xs">
          No items returned
        </Text>
      )}
      {items !== null && items.length > 0 && (
        <ScrollView className="max-h-80" nestedScrollEnabled>
          {endpoint === "subwayRouteInfo" && <RouteInfoResult items={items} />}
          {endpoint === "subwayTimetable" && (
            <TimetableResult items={items} showTerminus={false} />
          )}
          {endpoint === "stationTimetable" && (
            <TimetableResult items={items} showTerminus />
          )}
          {endpoint === "stationTransferInfo" && (
            <TransferInfoResult items={items} />
          )}
          {endpoint === "transferMovement" && (
            <TransferMovementResult items={items} />
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Main component ───────────────────────────────────────────

export function ApiInspector() {
  const [endpoint, setEndpoint] = useState<EndpointId>("subwayRouteInfo");
  const [selectedLine, setSelectedLine] = useState<KricLine>(KRIC_LINES[0]);

  // Primary station
  const [stationQuery, setStationQuery] = useState("");
  const [station, setStation] = useState<Station | null>(null);

  // Day code
  const [dayCd, setDayCd] = useState<DayCd>(getCurrentDayCd());

  // transferMovement extras
  const [targetLine, setTargetLine] = useState<KricLine>(KRIC_LINES[1]);
  const [prevQuery, setPrevQuery] = useState("");
  const [prevStation, setPrevStation] = useState<Station | null>(null);
  const [nextQuery, setNextQuery] = useState("");
  const [nextStation, setNextStation] = useState<Station | null>(null);

  // Results
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<unknown[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpointDef = ENDPOINTS.find((e) => e.id === endpoint) ?? ENDPOINTS[0];

  // Resolve KRIC refs
  const kricRef = station ? getKricRef(station.name, selectedLine.lnCd) : null;
  const prevRef = prevStation
    ? getKricRef(prevStation.name, selectedLine.lnCd)
    : null;
  const nextRef = nextStation
    ? getKricRef(nextStation.name, targetLine.lnCd)
    : null;

  const canRun = useMemo(() => {
    if (loading) return false;
    if (!endpointDef.needsStation) return true;
    if (!kricRef) return false;
    if (endpointDef.needsTransferExtras) {
      return !!(prevRef && nextRef);
    }
    return true;
  }, [loading, endpointDef, kricRef, prevRef, nextRef]);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError(null);
    setItems(null);
    try {
      const result = await executeApiCall(
        endpoint,
        selectedLine,
        dayCd,
        kricRef,
        prevRef,
        nextRef,
        targetLine.lnCd,
      );
      setItems(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [endpoint, selectedLine, kricRef, dayCd, prevRef, nextRef, targetLine]);

  const handleEndpointChange = (id: EndpointId) => {
    setEndpoint(id);
    setStation(null);
    setStationQuery("");
    setPrevStation(null);
    setPrevQuery("");
    setNextStation(null);
    setNextQuery("");
    setItems(null);
    setError(null);
  };

  const handleLineChange = (line: KricLine) => {
    setSelectedLine(line);
    setStation(null);
    setStationQuery("");
    setItems(null);
    setError(null);
  };

  return (
    <View>
      {/* Section header */}
      <Text className="mb-3 font-semibold text-outline-600 text-sm uppercase tracking-wide">
        KRIC API Inspector
      </Text>

      <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        {/* Endpoint selector */}
        <ScrollView
          className="border-outline-100 border-b"
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 10,
            gap: 6,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {ENDPOINTS.map((ep) => (
            <Pressable
              className={`rounded-full px-3 py-1.5 ${
                endpoint === ep.id
                  ? "bg-primary-600"
                  : "border border-outline-200 bg-background-50"
              }`}
              key={ep.id}
              onPress={() => handleEndpointChange(ep.id)}
            >
              <Text
                className={`text-xs ${
                  endpoint === ep.id
                    ? "font-medium text-white"
                    : "text-typography-700"
                }`}
              >
                {ep.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="p-4">
          {/* Endpoint description */}
          <Text className="mb-4 text-outline-500 text-xs">
            {endpointDef.desc}
          </Text>
          <Text className="mb-4 font-mono text-outline-400 text-xs">
            {endpointDef.path}
          </Text>

          {/* Line picker */}
          <Text className="mb-1 text-outline-500 text-xs">Line</Text>
          <ScrollView
            className="mb-3"
            contentContainerStyle={{ gap: 6 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {KRIC_LINES.map((line) => (
              <Pressable
                className="rounded-full px-3 py-1"
                key={line.lnCd}
                onPress={() => handleLineChange(line)}
                style={{
                  backgroundColor:
                    selectedLine.lnCd === line.lnCd
                      ? line.color
                      : `${line.color}22`,
                }}
              >
                <Text
                  className="font-medium text-xs"
                  style={{
                    color:
                      selectedLine.lnCd === line.lnCd ? "#fff" : line.color,
                  }}
                >
                  {line.appLine}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Station picker */}
          {endpointDef.needsStation && (
            <StationSearchInput
              label="Station"
              lineName={selectedLine.appLine}
              onChangeText={setStationQuery}
              onClear={() => {
                setStation(null);
                setStationQuery("");
              }}
              onSelect={setStation}
              selected={station}
              value={stationQuery}
            />
          )}

          {/* Day picker */}
          {endpointDef.needsDay && (
            <View className="mb-3">
              <Text className="mb-1 text-outline-500 text-xs">Day</Text>
              <View className="flex-row gap-2">
                {DAY_OPTIONS.map((d) => (
                  <Pressable
                    className={`flex-1 items-center rounded-lg py-2 ${
                      dayCd === d.cd
                        ? "bg-primary-600"
                        : "border border-outline-200 bg-background-50"
                    }`}
                    key={d.cd}
                    onPress={() => setDayCd(d.cd)}
                  >
                    <Text
                      className={`text-xs ${
                        dayCd === d.cd
                          ? "font-medium text-white"
                          : "text-typography-700"
                      }`}
                    >
                      {d.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* transferMovement extras */}
          {endpointDef.needsTransferExtras && (
            <TransferExtras
              fromLineName={selectedLine.appLine}
              nextQuery={nextQuery}
              nextStation={nextStation}
              onNextClear={() => {
                setNextStation(null);
                setNextQuery("");
              }}
              onNextQueryChange={setNextQuery}
              onNextSelect={setNextStation}
              onPrevClear={() => {
                setPrevStation(null);
                setPrevQuery("");
              }}
              onPrevQueryChange={setPrevQuery}
              onPrevSelect={setPrevStation}
              onTargetLineChange={(l) => {
                setTargetLine(l);
                setNextStation(null);
                setNextQuery("");
              }}
              prevQuery={prevQuery}
              prevStation={prevStation}
              targetLine={targetLine}
            />
          )}

          {/* KRIC ref badge */}
          {endpointDef.needsStation && station && (
            <View className="mb-3 rounded-lg bg-background-50 p-2">
              {kricRef ? (
                <Text className="font-mono text-green-700 text-xs">
                  stinCd={kricRef.stinCd} · railOprIsttCd=
                  {kricRef.railOprIsttCd}
                </Text>
              ) : (
                <Text className="text-amber-600 text-xs">
                  ⚠ Station not in KRIC code map — sync first
                </Text>
              )}
            </View>
          )}

          {/* Run button */}
          <Pressable
            accessibilityRole="button"
            className={`items-center rounded-xl py-3 ${
              canRun ? "bg-primary-600 active:bg-primary-700" : "bg-outline-200"
            }`}
            disabled={!canRun}
            onPress={handleRun}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text
                className={`font-medium text-sm ${canRun ? "text-white" : "text-outline-400"}`}
              >
                {canRun ? "Run API call" : "Select required params"}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Results */}
        <InspectorResults endpoint={endpoint} error={error} items={items} />
      </View>
    </View>
  );
}
