/**
 * KRIC API Inspector — dev-only component for testing KRIC endpoints.
 * Drop-down parameter selection, request preview panel, formatted results.
 */

import type { KricStationRef } from "@/data/kric-station-sync";
import type { DayCd, SubwayRouteInfoItem } from "@/lib/kric-api";
import type { Station } from "@/types/station";
import type { SyncedItems } from "@/types/sync-status";

import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSyncStatus } from "@/context/sync-status-context";
import {
  getKricCodeMap,
  getKricRef,
  mergeLineRouteInfo,
} from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import {
  fetchStationTimetable,
  fetchStationTransferInfo,
  fetchSubwayRouteInfo,
  fetchSubwayTimetable,
  fetchTransferMovement,
  getCurrentDayCd,
  parseKricJson,
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
    desc: "Departures with terminus (direction) info",
    needsStation: true,
    needsDay: true,
    needsTransferExtras: false,
  },
  {
    id: "stationTransferInfo",
    label: "Transfer Info",
    path: "convenientInfo/stationTransferInfo",
    desc: "Transfer walking distance & platform info",
    needsStation: true,
    needsDay: false,
    needsTransferExtras: false,
  },
  {
    id: "transferMovement",
    label: "Transfer Path",
    path: "vulnerableUserInfo/transferMovement",
    desc: "Step-by-step accessible transfer path",
    needsStation: true,
    needsDay: false,
    needsTransferExtras: true,
  },
];

const DAY_OPTIONS: { cd: DayCd; label: string }[] = [
  { cd: "8", label: "Weekday" },
  { cd: "7", label: "Saturday" },
  { cd: "9", label: "Sun / Holiday" },
];

// ── Helpers ──────────────────────────────────────────────────

function maskKey(key: string): string {
  if (key.length === 0) return "(not set)";
  if (key.length <= 8) return "•".repeat(key.length);
  return `${key.slice(0, 6)}${"•".repeat(Math.min(key.length - 10, 20))}${key.slice(-4)}`;
}

type RequestPreview = { path: string; params: Record<string, string> } | null;

/** Builds the flat request URL exactly as sent by kric-api.ts (serviceKey raw). */
function buildRequestUrl(
  path: string,
  serviceKey: string,
  params: Record<string, string>,
): string {
  const qs = new URLSearchParams({
    format: "json",
    numOfRows: "9999",
    ...params,
  });
  return `https://openapi.kric.go.kr/openapi/${path}?serviceKey=${serviceKey}&${qs.toString()}`;
}

/** Returns each request parameter as a display line. */
function buildParamRows(
  serviceKey: string,
  params: Record<string, string>,
): { key: string; value: string }[] {
  return [
    { key: "serviceKey", value: serviceKey },
    { key: "format", value: "json" },
    ...Object.entries(params).map(([k, v]) => ({ key: k, value: v })),
  ];
}

function buildRequestParams(
  endpoint: EndpointId,
  selectedLine: KricLine,
  dayCd: DayCd,
  kricRef: KricStationRef | null,
  prevRef: KricStationRef | null,
  nextRef: KricStationRef | null,
  targetLnCd: string,
): RequestPreview {
  if (endpoint === "subwayRouteInfo") {
    return {
      path: "trainUseInfo/subwayRouteInfo",
      params: { mreaWideCd: "01", lnCd: selectedLine.lnCd },
    };
  }
  if (endpoint === "subwayTimetable") {
    if (!kricRef) return null;
    return {
      path: "trainUseInfo/subwayTimetable",
      params: {
        railOprIsttCd: kricRef.railOprIsttCd,
        dayCd,
        lnCd: kricRef.lnCd,
        stinCd: kricRef.stinCd,
      },
    };
  }
  if (endpoint === "stationTimetable") {
    if (!kricRef) return null;
    return {
      path: "convenientInfo/stationTimetable",
      params: {
        railOprIsttCd: kricRef.railOprIsttCd,
        dayCd,
        lnCd: kricRef.lnCd,
        stinCd: kricRef.stinCd,
      },
    };
  }
  if (endpoint === "stationTransferInfo") {
    if (!kricRef) return null;
    return {
      path: "convenientInfo/stationTransferInfo",
      params: {
        railOprIsttCd: kricRef.railOprIsttCd,
        lnCd: kricRef.lnCd,
        stinCd: kricRef.stinCd,
      },
    };
  }
  if (!(kricRef && prevRef && nextRef)) return null;
  return {
    path: "vulnerableUserInfo/transferMovement",
    params: {
      railOprIsttCd: kricRef.railOprIsttCd,
      lnCd: kricRef.lnCd,
      stinCd: kricRef.stinCd,
      prevStinCd: prevRef.stinCd,
      chthTgtLn: targetLnCd,
      chtnNextStinCd: nextRef.stinCd,
    },
  };
}

// ── API call executor ─────────────────────────────────────────

function _executeApiCall(
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

// ── Raw-request runner ────────────────────────────────────────

async function runInspectorRequest(
  preview: NonNullable<RequestPreview>,
  serviceKey: string,
): Promise<{ items: unknown[]; rawText: string; url: string }> {
  const url = buildRequestUrl(preview.path, serviceKey, preview.params);
  const res = await fetch(url);
  const rawText = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  const items = parseKricJson<unknown>(rawText);
  return { items, rawText, url };
}

// ── DB persist helper ─────────────────────────────────────────

async function persistRouteInfoToDB(
  items: unknown[],
  lnCd: string,
  currentItems: SyncedItems,
  setLastSync: (ts: number, items: SyncedItems) => void,
): Promise<void> {
  await mergeLineRouteInfo(items as SubwayRouteInfoItem[], lnCd);
  setLastSync(Date.now(), {
    ...currentItems,
    stations: getAllStations().length,
    transfers: Object.keys(getKricCodeMap()).length,
  });
}

// ── Can-run logic ─────────────────────────────────────────────

function computeCanRun(
  loading: boolean,
  endpointDef: (typeof ENDPOINTS)[number],
  kricRef: KricStationRef | null,
  prevRef: KricStationRef | null,
  nextRef: KricStationRef | null,
): boolean {
  if (loading) return false;
  if (!endpointDef.needsStation) return true;
  if (!kricRef) return false;
  if (endpointDef.needsTransferExtras) return !!(prevRef && nextRef);
  return true;
}

// ── Shared style constants ────────────────────────────────────

const SECTION_LABEL =
  "mb-2 text-xs font-semibold uppercase tracking-widest text-outline-400";
const CARD = "rounded-xl border border-outline-200 bg-background-0";
const ROW_DIVIDER = "border-outline-100 border-b";
const MONO = "font-mono";

// ── Dropdown component ────────────────────────────────────────

interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  color?: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <View className="mb-4">
      <Text className={SECTION_LABEL}>{label}</Text>
      <Pressable
        className={
          "flex-row items-center justify-between rounded-xl border border-outline-200 bg-background-50 px-4 py-3 active:bg-background-100"
        }
        onPress={() => setOpen(true)}
      >
        <View className="flex-row items-center gap-3">
          {selected?.color ? (
            <View
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: selected.color }}
            />
          ) : null}
          <Text className="font-medium text-sm text-typography-900">
            {selected?.label ?? "—"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {selected?.sublabel ? (
            <Text className={`${MONO} text-outline-400 text-xs`}>
              {selected.sublabel}
            </Text>
          ) : null}
          <Text className="text-outline-300 text-sm">▾</Text>
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        presentationStyle="pageSheet"
        transparent={false}
        visible={open}
      >
        <View className="flex-1 bg-background-0">
          <View className="flex-row items-center justify-between border-outline-100 border-b px-6 py-4">
            <Text className="font-semibold text-base text-typography-900">
              {label}
            </Text>
            <Pressable
              className="rounded-lg bg-background-100 px-3 py-1.5"
              onPress={() => setOpen(false)}
            >
              <Text className="text-outline-600 text-sm">Done</Text>
            </Pressable>
          </View>
          <ScrollView>
            {options.map((opt) => (
              <Pressable
                className={`flex-row items-center gap-4 px-6 py-4 ${ROW_DIVIDER} active:bg-background-50`}
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
              >
                {opt.color ? (
                  <View
                    className="h-4 w-4 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                ) : null}
                <View className="flex-1">
                  <Text className="text-base text-typography-900">
                    {opt.label}
                  </Text>
                  {opt.sublabel ? (
                    <Text className={`${MONO} mt-0.5 text-outline-400 text-xs`}>
                      {opt.sublabel}
                    </Text>
                  ) : null}
                </View>
                {value === opt.value ? (
                  <Text className="text-base text-primary-600">✓</Text>
                ) : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ── Request debug panel ───────────────────────────────────────

interface RequestDebugPanelProps {
  preview: RequestPreview;
}

function RequestDebugPanel({ preview }: RequestDebugPanelProps) {
  const [revealed, setRevealed] = useState(false);
  const rawKey = process.env.EXPO_PUBLIC_KRIC_SERVICE_KEY ?? "";
  const toggle = useCallback(() => setRevealed((r) => !r), []);
  const isKeySet = rawKey.length > 0;

  const paramRows =
    preview && isKeySet ? buildParamRows(rawKey, preview.params) : null;
  const requestUrl =
    preview && isKeySet
      ? buildRequestUrl(preview.path, rawKey, preview.params)
      : null;

  return (
    <View className={`${CARD} mb-5 overflow-hidden`}>
      {/* Key status row */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <View
            className={`h-2 w-2 rounded-full ${isKeySet ? "bg-green-500" : "bg-red-400"}`}
          />
          <Text className="font-medium text-sm text-typography-900">
            Service Key
          </Text>
          {!isKeySet ? (
            <Text className="text-red-500 text-xs">not set</Text>
          ) : null}
        </View>
        <Pressable
          className="rounded-md bg-background-100 px-3 py-1"
          onPress={toggle}
        >
          <Text className="text-outline-600 text-xs">
            {revealed ? "Hide" : "Reveal"}
          </Text>
        </Pressable>
      </View>

      {/* Key value */}
      <View className="border-outline-100 border-t bg-background-50 px-4 py-3">
        <Text className={`${MONO} text-typography-800 text-xs`} selectable>
          {revealed ? rawKey : maskKey(rawKey)}
        </Text>
      </View>

      {/* Params table */}
      {paramRows ? (
        <>
          <View className="border-outline-100 border-t px-4 pt-3 pb-1">
            <Text className={SECTION_LABEL}>Request params</Text>
          </View>
          {paramRows.map((row) => (
            <View
              className={`flex-row items-start gap-4 px-4 py-2.5 ${ROW_DIVIDER}`}
              key={row.key}
            >
              <Text
                className={`${MONO} w-36 flex-shrink-0 text-outline-500 text-xs`}
              >
                {row.key}
              </Text>
              <Text
                className={`${MONO} flex-1 text-typography-800 text-xs`}
                selectable
              >
                {row.value}
              </Text>
            </View>
          ))}

          {/* Full URL */}
          <View className="border-outline-100 border-t px-4 pt-3 pb-3">
            <Text className={`${SECTION_LABEL} mb-2`}>Full URL</Text>
            <ScrollView
              bounces={false}
              horizontal
              showsHorizontalScrollIndicator
            >
              <Text className={`${MONO} text-outline-600 text-xs`} selectable>
                {requestUrl}
              </Text>
            </ScrollView>
          </View>
        </>
      ) : (
        <View className="border-outline-100 border-t px-4 py-3">
          <Text className="text-outline-400 text-sm">
            {isKeySet
              ? "Select all required params to see the request"
              : "Set EXPO_PUBLIC_KRIC_SERVICE_KEY in .env"}
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Station search input ──────────────────────────────────────

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
    <View className="mb-4">
      <Text className={SECTION_LABEL}>{label}</Text>
      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 rounded-xl border border-outline-200 bg-background-50 px-4 py-3 text-sm text-typography-900"
          onChangeText={(t) => {
            if (selected) onClear();
            onChangeText(t);
          }}
          placeholder={`Search ${lineName} stations…`}
          placeholderTextColor="#9CA3AF"
          value={selected ? selected.name : value}
        />
        {selected ? (
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-xl border border-outline-200 bg-background-50"
            onPress={onClear}
          >
            <Text className="text-outline-500">✕</Text>
          </Pressable>
        ) : null}
      </View>
      {suggestions.length > 0 ? (
        <View
          className={
            "mt-1 overflow-hidden rounded-xl border border-outline-200 bg-background-0"
          }
        >
          {suggestions.map((s) => (
            <Pressable
              className={`flex-row items-center gap-3 px-4 py-3 ${ROW_DIVIDER} active:bg-background-50`}
              key={s.id}
              onPress={() => onSelect(s)}
            >
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.lineColor }}
              />
              <Text className="text-sm text-typography-900">{s.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {selected ? (
        <View className="mt-2 flex-row items-center gap-2">
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: selected.lineColor }}
          />
          <Text className={`${MONO} text-green-600 text-xs`}>
            {selected.name} · synced
          </Text>
        </View>
      ) : null}
    </View>
  );
}

// ── Result renderers ─────────────────────────────────────────

function formatTime(raw: string): string {
  if (raw.length < 4) return raw;
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
}

function ResultSectionHeader({ count }: { count: number }) {
  return (
    <View className="flex-row items-center justify-between bg-background-50 px-4 py-3">
      <Text className={SECTION_LABEL}>Results</Text>
      <Text className={`${MONO} text-outline-500 text-xs`}>
        {count} {count === 1 ? "item" : "items"}
      </Text>
    </View>
  );
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
      <View
        className={`flex-row items-center gap-4 bg-background-50 px-4 py-2 ${ROW_DIVIDER}`}
      >
        <Text className={`${MONO} w-8 text-right text-outline-400 text-xs`}>
          #
        </Text>
        <Text className="flex-1 font-semibold text-outline-500 text-xs">
          Station
        </Text>
        <Text className={`${MONO} font-semibold text-outline-500 text-xs`}>
          Code
        </Text>
      </View>
      {rows.map((r, i) => (
        <View
          className={`flex-row items-center gap-4 px-4 py-3 ${ROW_DIVIDER}`}
          key={`${r.stinCd}-${i}`}
        >
          <Text className={`${MONO} w-8 text-right text-outline-400 text-sm`}>
            {r.stinConsOrdr}
          </Text>
          <Text className="flex-1 text-sm text-typography-900">{r.stinNm}</Text>
          <Text className={`${MONO} text-outline-500 text-sm`}>{r.stinCd}</Text>
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
      <View
        className={`flex-row items-center gap-4 bg-background-50 px-4 py-2 ${ROW_DIVIDER}`}
      >
        <Text className={`${MONO} w-16 font-semibold text-outline-500 text-xs`}>
          Depart
        </Text>
        <Text
          className={`${MONO} flex-1 font-semibold text-outline-500 text-xs`}
        >
          Train #
        </Text>
        {showTerminus ? (
          <Text className="font-semibold text-outline-500 text-xs">
            Terminus
          </Text>
        ) : null}
      </View>
      {rows.slice(0, 30).map((r, i) => {
        const time = r.dptTm || r.arvTm;
        return (
          <View
            className={`flex-row items-center gap-4 px-4 py-3 ${ROW_DIVIDER}`}
            key={`${r.trnNo}-${i}`}
          >
            <Text
              className={`${MONO} w-16 font-semibold text-sm text-typography-900`}
            >
              {formatTime(time)}
            </Text>
            <Text className={`${MONO} flex-1 text-outline-500 text-sm`}>
              #{r.trnNo}
            </Text>
            {showTerminus && r.tmnStinCd ? (
              <Text className={`${MONO} text-outline-400 text-sm`}>
                → {r.tmnStinCd}
              </Text>
            ) : null}
          </View>
        );
      })}
      {rows.length > 30 ? (
        <View className="items-center px-4 py-3">
          <Text className="text-outline-400 text-sm">
            + {rows.length - 30} more entries
          </Text>
        </View>
      ) : null}
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
        <View className={`px-4 py-4 ${ROW_DIVIDER}`} key={`${r.chtnLn}-${i}`}>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-sm text-typography-900">
              {r.chtnLn}
            </Text>
            <View className="flex-row items-center gap-3">
              <Text
                className={`${MONO} font-semibold text-sm text-typography-900`}
              >
                {r.chtnDst} m
              </Text>
              <Text className="text-outline-400 text-sm">
                ~{Math.ceil(Number(r.chtnDst) / 80)} min walk
              </Text>
            </View>
          </View>
          {r.stLocCont ? (
            <Text className="text-outline-500 text-sm">
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
        const elevatorOk = r.elvtSttCd === "1";
        return (
          <View
            className={`px-4 py-4 ${ROW_DIVIDER}`}
            key={`${r.chtnMvTpOrdr}-${i}`}
          >
            <View className="flex-row items-start gap-3">
              <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                <Text className="font-bold text-primary-700 text-xs">
                  {r.chtnMvTpOrdr}
                </Text>
              </View>
              <Text className="flex-1 text-sm text-typography-900">
                {r.mvContDtl}
              </Text>
              {hasElevator ? (
                <Text
                  className={`text-sm ${elevatorOk ? "text-green-600" : "text-red-500"}`}
                >
                  {elevatorOk ? "🛗 OK" : "🛗 ✕"}
                </Text>
              ) : null}
            </View>
            {r.stMovePath ? (
              <Text className="mt-1.5 pl-9 text-outline-400 text-sm">
                {r.stMovePath} → {r.edMovePath}
              </Text>
            ) : null}
          </View>
        );
      })}
    </>
  );
}

// ── Inspector results panel ───────────────────────────────────

function renderResultRows(endpoint: EndpointId, items: unknown[]) {
  if (endpoint === "subwayRouteInfo") return <RouteInfoResult items={items} />;
  if (endpoint === "subwayTimetable")
    return <TimetableResult items={items} showTerminus={false} />;
  if (endpoint === "stationTimetable")
    return <TimetableResult items={items} showTerminus />;
  if (endpoint === "stationTransferInfo")
    return <TransferInfoResult items={items} />;
  return <TransferMovementResult items={items} />;
}

interface InspectorResultsProps {
  endpoint: EndpointId;
  items: unknown[] | null;
  error: string | null;
  rawBody: string | null;
  savedToDB: boolean;
}

function InspectorResults({
  endpoint,
  items,
  error,
  rawBody,
  savedToDB,
}: InspectorResultsProps) {
  const [rawExpanded, setRawExpanded] = useState(false);

  if (items === null && !error && rawBody === null && !savedToDB) return null;
  const hasItems = items !== null && items.length > 0;
  const isEmpty = items !== null && items.length === 0;
  return (
    <View className={`${CARD} mt-4 overflow-hidden`}>
      {hasItems ? (
        <ResultSectionHeader count={(items as unknown[]).length} />
      ) : null}
      {savedToDB && hasItems ? (
        <View className="flex-row items-center gap-2 border-outline-100 border-b bg-green-50 px-4 py-2">
          <View className="h-2 w-2 rounded-full bg-green-500" />
          <Text className="font-medium text-green-700 text-xs">
            Saved to DB
          </Text>
        </View>
      ) : null}
      {error ? (
        <View className="px-4 py-4">
          <Text className="mb-1 font-semibold text-red-500 text-xs">Error</Text>
          <Text className={`${MONO} text-red-700 text-sm`}>{error}</Text>
        </View>
      ) : null}
      {isEmpty ? (
        <View className="items-center px-4 py-8">
          <Text className="text-outline-400 text-sm">No items returned</Text>
        </View>
      ) : null}
      {hasItems ? (
        <ScrollView nestedScrollEnabled>
          {renderResultRows(endpoint, items as unknown[])}
        </ScrollView>
      ) : null}
      {rawBody !== null ? (
        <View className="border-outline-100 border-t">
          <Pressable
            className="flex-row items-center justify-between px-4 py-3 active:bg-background-50"
            onPress={() => setRawExpanded((v) => !v)}
          >
            <Text className="font-medium text-outline-600 text-xs">
              Raw Response {rawExpanded ? "▴" : "▾"}
            </Text>
          </Pressable>
          {rawExpanded ? (
            <ScrollView
              className="max-h-48 bg-background-50 px-4 pb-3"
              horizontal
              maximumZoomScale={1}
              nestedScrollEnabled
              showsHorizontalScrollIndicator
            >
              <Text className={`${MONO} text-outline-700 text-xs`} selectable>
                {rawBody}
              </Text>
            </ScrollView>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

// ── Transfer extras ───────────────────────────────────────────

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
  onTargetLineChange: (lnCd: string) => void;
  onNextQueryChange: (t: string) => void;
  onNextSelect: (s: Station) => void;
  onNextClear: () => void;
}

const LINE_DROPDOWN_OPTIONS: DropdownOption[] = KRIC_LINES.map((l) => ({
  value: l.lnCd,
  label: l.appLine,
  color: l.color,
}));

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
    <View className={`${CARD} mb-4 overflow-hidden p-4`}>
      <Text className={`${SECTION_LABEL} mb-3`}>Transfer details</Text>
      <StationSearchInput
        label={`Prev station  ·  ${fromLineName}`}
        lineName={fromLineName}
        onChangeText={onPrevQueryChange}
        onClear={onPrevClear}
        onSelect={onPrevSelect}
        selected={prevStation}
        value={prevQuery}
      />
      <Dropdown
        label="Transfer to line"
        onChange={onTargetLineChange}
        options={LINE_DROPDOWN_OPTIONS}
        value={targetLine.lnCd}
      />
      <StationSearchInput
        label={`Next station  ·  ${targetLine.appLine}`}
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

// ── Static dropdown option arrays ────────────────────────────

const ENDPOINT_OPTIONS: DropdownOption[] = ENDPOINTS.map((ep) => ({
  value: ep.id,
  label: ep.label,
  sublabel: ep.path,
}));

const DAY_DROPDOWN_OPTIONS: DropdownOption[] = DAY_OPTIONS.map((d) => ({
  value: d.cd,
  label: d.label,
}));

// ── Station ref badge ─────────────────────────────────────────

function StationRefBadge({ kricRef }: { kricRef: KricStationRef | null }) {
  if (kricRef) {
    return (
      <View className="mb-4 gap-1.5 rounded-lg border border-outline-100 bg-background-50 px-4 py-3">
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-green-500" />
          <Text className="font-semibold text-green-600 text-xs">
            Station resolved
          </Text>
        </View>
        <Text className={`${MONO} text-outline-600 text-xs`}>
          stinCd = {kricRef.stinCd}
        </Text>
        <Text className={`${MONO} text-outline-600 text-xs`}>
          railOprIsttCd = {kricRef.railOprIsttCd}
        </Text>
      </View>
    );
  }
  return (
    <View className="mb-4 flex-row items-center gap-2 rounded-lg border border-outline-100 bg-background-50 px-4 py-3">
      <Text className="text-amber-500">⚠</Text>
      <Text className="text-amber-600 text-sm">
        Station not in KRIC code map — run sync first
      </Text>
    </View>
  );
}

// ── Run button ────────────────────────────────────────────────

function RunButton({
  canRun,
  loading,
  onPress,
}: {
  canRun: boolean;
  loading: boolean;
  onPress: () => void;
}) {
  const bgClass = canRun
    ? "bg-primary-600 active:bg-primary-700"
    : "bg-outline-100";
  const textClass = canRun ? "text-white" : "text-outline-400";
  const label = canRun ? "Send Request" : "Select required params";
  return (
    <Pressable
      accessibilityRole="button"
      className={`items-center rounded-xl py-4 ${bgClass}`}
      disabled={!canRun}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text className={`font-semibold text-sm ${textClass}`}>{label}</Text>
      )}
    </Pressable>
  );
}

// ── Main component ───────────────────────────────────────────

export function ApiInspector() {
  const [endpoint, setEndpoint] = useState<EndpointId>("subwayRouteInfo");
  const [selectedLine, setSelectedLine] = useState<KricLine>(KRIC_LINES[0]);

  const [stationQuery, setStationQuery] = useState("");
  const [station, setStation] = useState<Station | null>(null);

  const [dayCd, setDayCd] = useState<DayCd>(getCurrentDayCd());

  const [targetLine, setTargetLine] = useState<KricLine>(KRIC_LINES[1]);
  const [prevQuery, setPrevQuery] = useState("");
  const [prevStation, setPrevStation] = useState<Station | null>(null);
  const [nextQuery, setNextQuery] = useState("");
  const [nextStation, setNextStation] = useState<Station | null>(null);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<unknown[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawBody, setRawBody] = useState<string | null>(null);

  const { setLastSync, items: syncItems } = useSyncStatus();
  const [savedToDB, setSavedToDB] = useState(false);

  // biome-ignore lint/style/noNonNullAssertion: ENDPOINTS is a non-empty constant
  const endpointDef = (ENDPOINTS.find((e) => e.id === endpoint) ??
    ENDPOINTS[0])!;

  const kricRef = station ? getKricRef(station.name, selectedLine.lnCd) : null;
  const prevRef = prevStation
    ? getKricRef(prevStation.name, selectedLine.lnCd)
    : null;
  const nextRef = nextStation
    ? getKricRef(nextStation.name, targetLine.lnCd)
    : null;

  const requestPreview = useMemo(
    () =>
      buildRequestParams(
        endpoint,
        selectedLine,
        dayCd,
        kricRef,
        prevRef,
        nextRef,
        targetLine.lnCd,
      ),
    [endpoint, selectedLine, dayCd, kricRef, prevRef, nextRef, targetLine.lnCd],
  );

  const canRun = computeCanRun(loading, endpointDef, kricRef, prevRef, nextRef);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError(null);
    setItems(null);
    setRawBody(null);
    setSavedToDB(false);
    const rawKey = process.env.EXPO_PUBLIC_KRIC_SERVICE_KEY ?? "";
    try {
      // biome-ignore lint/style/noNonNullAssertion: canRun guard ensures requestPreview is set
      const result = await runInspectorRequest(requestPreview!, rawKey);
      setItems(result.items);
      setRawBody(result.rawText);
      if (endpoint === "subwayRouteInfo" && result.items.length > 0) {
        await persistRouteInfoToDB(
          result.items,
          selectedLine.lnCd,
          syncItems,
          setLastSync,
        );
        setSavedToDB(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setRawBody(null);
    } finally {
      setLoading(false);
    }
  }, [requestPreview, endpoint, selectedLine.lnCd, syncItems, setLastSync]);

  const handleEndpointChange = (id: string) => {
    setEndpoint(id as EndpointId);
    setStation(null);
    setStationQuery("");
    setPrevStation(null);
    setPrevQuery("");
    setNextStation(null);
    setNextQuery("");
    setItems(null);
    setError(null);
    setSavedToDB(false);
  };

  const handleLineChange = (lnCd: string) => {
    const line = KRIC_LINES.find((l) => l.lnCd === lnCd) ?? KRIC_LINES[0];
    setSelectedLine(line);
    setStation(null);
    setStationQuery("");
    setItems(null);
    setError(null);
  };

  const handleTargetLineChange = (lnCd: string) => {
    const line = KRIC_LINES.find((l) => l.lnCd === lnCd) ?? KRIC_LINES[1];
    setTargetLine(line);
    setNextStation(null);
    setNextQuery("");
  };

  return (
    <View>
      <Text className="mb-4 font-semibold text-lg text-typography-900">
        API Inspector
      </Text>

      {/* Auth / Request debug panel */}
      <RequestDebugPanel preview={requestPreview} />

      {/* Parameters */}
      <Text className={`${SECTION_LABEL} mb-3`}>Parameters</Text>
      <View className={`${CARD} mb-4 p-4`}>
        <Dropdown
          label="Endpoint"
          onChange={handleEndpointChange}
          options={ENDPOINT_OPTIONS}
          value={endpoint}
        />
        <Text className="mb-4 text-outline-500 text-sm">
          {endpointDef.desc}
        </Text>

        <Dropdown
          label="Line"
          onChange={handleLineChange}
          options={LINE_DROPDOWN_OPTIONS}
          value={selectedLine.lnCd}
        />

        {endpointDef.needsStation ? (
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
        ) : null}

        {endpointDef.needsDay ? (
          <Dropdown
            label="Day"
            onChange={(v) => setDayCd(v as DayCd)}
            options={DAY_DROPDOWN_OPTIONS}
            value={dayCd}
          />
        ) : null}

        {/* KRIC ref badge */}
        {endpointDef.needsStation && station ? (
          <StationRefBadge kricRef={kricRef} />
        ) : null}
      </View>

      {/* Transfer extras */}
      {endpointDef.needsTransferExtras ? (
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
          onTargetLineChange={handleTargetLineChange}
          prevQuery={prevQuery}
          prevStation={prevStation}
          targetLine={targetLine}
        />
      ) : null}

      {/* Run */}
      <RunButton canRun={canRun} loading={loading} onPress={handleRun} />

      {/* Results */}
      <InspectorResults
        endpoint={endpoint}
        error={error}
        items={items}
        rawBody={rawBody}
        savedToDB={savedToDB}
      />
    </View>
  );
}
