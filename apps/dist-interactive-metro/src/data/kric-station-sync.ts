/**
 * KRIC station sync
 *
 * Fetches station data for every Seoul Metro line from the KRIC
 * subwayRouteInfo endpoint, normalises it into our Station type,
 * and persists:
 *
 *   1. Dynamic Station objects for lines not in the static bundle
 *      (lines 6, 8, Airport Railroad, Gyeongui-Jungang, Gyeongchun,
 *       Suinbundang).
 *
 *   2. A KRIC code lookup table  { "<stinNm>|<kricLnCd>" → KricStationRef }
 *      used by the timetable and transfer-info hooks.
 *
 * Results are cached in AsyncStorage (TTL = 24 h) so the API is not
 * called on every launch.
 */

import type { Station } from "@/types/station";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchSubwayRouteInfo, type SubwayRouteInfoItem } from "@/lib/kric-api";
import { setDynamicStations } from "./station-store";

// ── KRIC line catalogue ──────────────────────────────────────

interface SyncTarget {
  /** Seoul region code */
  mreaWideCd: "01";
  /** KRIC line code */
  lnCd: string;
  /** App display name (must match lines[] in stations.ts) */
  appLine: string;
  lineNumber: string;
  lineColor: string;
  /** True = not in the static bundle; its stations must be added dynamically */
  dynamic: boolean;
}

const SYNC_TARGETS: SyncTarget[] = [
  {
    mreaWideCd: "01",
    lnCd: "1",
    appLine: "1호선",
    lineNumber: "1",
    lineColor: "#263C96",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "2",
    appLine: "2호선",
    lineNumber: "2",
    lineColor: "#3CB44A",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "3",
    appLine: "3호선",
    lineNumber: "3",
    lineColor: "#EF7C1C",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "4",
    appLine: "4호선",
    lineNumber: "4",
    lineColor: "#00A2D1",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "5",
    appLine: "5호선",
    lineNumber: "5",
    lineColor: "#996CAC",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "6",
    appLine: "6호선",
    lineNumber: "6",
    lineColor: "#CD7C2F",
    dynamic: true,
  },
  {
    mreaWideCd: "01",
    lnCd: "7",
    appLine: "7호선",
    lineNumber: "7",
    lineColor: "#747F00",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "8",
    appLine: "8호선",
    lineNumber: "8",
    lineColor: "#E6186C",
    dynamic: true,
  },
  {
    mreaWideCd: "01",
    lnCd: "9",
    appLine: "9호선",
    lineNumber: "9",
    lineColor: "#BDB092",
    dynamic: false,
  },
  {
    mreaWideCd: "01",
    lnCd: "A1",
    appLine: "공항철도",
    lineNumber: "A",
    lineColor: "#0090D2",
    dynamic: true,
  },
  {
    mreaWideCd: "01",
    lnCd: "K1",
    appLine: "경의중앙선",
    lineNumber: "K",
    lineColor: "#77C4A3",
    dynamic: true,
  },
  {
    mreaWideCd: "01",
    lnCd: "K4",
    appLine: "경춘선",
    lineNumber: "G",
    lineColor: "#0C8E72",
    dynamic: true,
  },
  {
    mreaWideCd: "01",
    lnCd: "K2",
    appLine: "수인분당선",
    lineNumber: "SB",
    lineColor: "#FABE00",
    dynamic: true,
  },
  {
    mreaWideCd: "01",
    lnCd: "D1",
    appLine: "신분당선",
    lineNumber: "S",
    lineColor: "#D4003B",
    dynamic: false,
  },
];

// ── Storage keys ─────────────────────────────────────────────

const STORAGE_DYNAMIC = "@kric/dynamic_stations_v1";
const STORAGE_CODE_MAP = "@kric/station_code_map_v1";
const STORAGE_SYNC_TS = "@kric/last_sync_ts_v1";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Public types ─────────────────────────────────────────────

/** Minimal KRIC identifiers needed to call timetable / transfer APIs. */
export interface KricStationRef {
  stinCd: string;
  railOprIsttCd: string;
  lnCd: string;
}

/** Lookup map: "<stinNm>|<kricLnCd>" → KricStationRef */
export type KricCodeMap = Record<string, KricStationRef>;

// In-memory cache of the lookup map
let _codeMap: KricCodeMap = {};

export function getKricRef(
  stationName: string,
  kricLnCd: string,
): KricStationRef | null {
  return _codeMap[`${stationName}|${kricLnCd}`] ?? null;
}

export function getKricCodeMap(): KricCodeMap {
  return _codeMap;
}

// ── Sync result ───────────────────────────────────────────────

export interface SyncResult {
  dynamicStationsAdded: number;
  codeMapEntries: number;
  linesSucceeded: number;
  linesFailed: number;
  errors: string[];
}

// ── Core sync logic ──────────────────────────────────────────

function buildStationId(railOprIsttCd: string, stinCd: string): string {
  return `kric_${railOprIsttCd}_${stinCd}`;
}

function itemsToStation(
  items: SubwayRouteInfoItem[],
  target: SyncTarget,
): Station[] {
  return items
    .slice()
    .sort((a, b) => Number(a.stinConsOrdr) - Number(b.stinConsOrdr))
    .map((item) => ({
      id: buildStationId(item.railOprIsttCd, item.stinCd),
      name: item.stinNm,
      line: target.appLine,
      lineNumber: target.lineNumber,
      lineColor: target.lineColor,
    }));
}

function buildCodeMapEntries(
  items: SubwayRouteInfoItem[],
  kricLnCd: string,
): KricCodeMap {
  const map: KricCodeMap = {};
  for (const item of items) {
    const key = `${item.stinNm}|${kricLnCd}`;
    map[key] = {
      stinCd: item.stinCd,
      railOprIsttCd: item.railOprIsttCd,
      lnCd: item.lnCd,
    };
  }
  return map;
}

async function isCacheValid(): Promise<boolean> {
  try {
    const ts = await AsyncStorage.getItem(STORAGE_SYNC_TS);
    if (!ts) return false;
    return Date.now() - Number(ts) < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

async function loadFromCache(): Promise<boolean> {
  try {
    const [dynRaw, mapRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_DYNAMIC),
      AsyncStorage.getItem(STORAGE_CODE_MAP),
    ]);
    if (!(dynRaw && mapRaw)) return false;
    const dynamic = JSON.parse(dynRaw) as Station[];
    const map = JSON.parse(mapRaw) as KricCodeMap;
    setDynamicStations(dynamic);
    _codeMap = map;
    return true;
  } catch {
    return false;
  }
}

async function saveToCache(
  dynamic: Station[],
  map: KricCodeMap,
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(STORAGE_DYNAMIC, JSON.stringify(dynamic)),
    AsyncStorage.setItem(STORAGE_CODE_MAP, JSON.stringify(map)),
    AsyncStorage.setItem(STORAGE_SYNC_TS, String(Date.now())),
  ]);
}

/**
 * Sync all Seoul Metro lines from the KRIC API.
 *
 * - Skips if the cache is still valid (< 24 h old) unless `force` is true.
 * - Fetches each line independently so a single failure doesn't abort others.
 * - Updates the in-memory station store and KRIC code map.
 */
export async function syncKricStations(
  opts: { force?: boolean } = {},
): Promise<SyncResult> {
  if (!opts.force && (await isCacheValid())) {
    await loadFromCache();
    return {
      dynamicStationsAdded: 0,
      codeMapEntries: Object.keys(_codeMap).length,
      linesSucceeded: 0,
      linesFailed: 0,
      errors: [],
    };
  }

  const dynamicStations: Station[] = [];
  const codeMap: KricCodeMap = {};
  let linesSucceeded = 0;
  let linesFailed = 0;
  const errors: string[] = [];

  for (const target of SYNC_TARGETS) {
    try {
      const items = await fetchSubwayRouteInfo({
        mreaWideCd: target.mreaWideCd,
        lnCd: target.lnCd,
      });

      if (items.length === 0) continue;

      // Build KRIC code map entries for every line (needed for timetable API)
      Object.assign(codeMap, buildCodeMapEntries(items, target.lnCd));

      // Only add to dynamic station store for lines missing from static bundle
      if (target.dynamic) {
        dynamicStations.push(...itemsToStation(items, target));
      }

      linesSucceeded++;
    } catch (err) {
      linesFailed++;
      errors.push(
        `${target.appLine}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  setDynamicStations(dynamicStations);
  _codeMap = codeMap;
  await saveToCache(dynamicStations, codeMap);

  return {
    dynamicStationsAdded: dynamicStations.length,
    codeMapEntries: Object.keys(codeMap).length,
    linesSucceeded,
    linesFailed,
    errors,
  };
}

/** Load persisted data into memory without hitting the API. */
export async function loadCachedKricData(): Promise<void> {
  await loadFromCache();
}
