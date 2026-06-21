/**
 * KRIC station sync
 *
 * Fetches station data for every Seoul Metro line from the KRIC
 * subwayRouteInfo endpoint, normalises it into our Station type,
 * and persists:
 *
 *   1. Dynamic Station objects for lines not in the static bundle
 *      (lines 6, 8, 신분당선, Airport Railroad, Gyeongui-Jungang,
 *       Gyeongchun, Suinbundang).
 *
 *   2. A KRIC code lookup table  { "<stinNm>|<kricLnCd>" → KricStationRef }
 *      used by the timetable and transfer-info hooks.
 *
 *   3. A routes list per line  (routCd / routNm / stationCount) that
 *      captures branch lines (e.g. 5호선 방화지선).
 *
 *   4. Station coordinates (latitude/longitude) fetched from the stationInfo endpoint.
 *
 * Results are cached in AsyncStorage (TTL = 24 h) so the API is not
 * called on every launch.
 */

import type { Station } from "@/types/station";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchStationInfo,
  fetchSubwayRouteInfo,
  type SubwayRouteInfoItem,
} from "@/lib/kric-api";
import {
  getAllStations,
  getDynamicStations,
  setDynamicStations,
} from "./station-store";

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
    dynamic: true,
  },
];

/** Maps app-facing line name → KRIC lnCd (e.g. "1호선" → "1", "공항철도" → "A1"). */
export const APP_LINE_TO_LN_CD: Readonly<Record<string, string>> =
  Object.fromEntries(SYNC_TARGETS.map((t) => [t.appLine, t.lnCd]));

// ── Storage keys ─────────────────────────────────────────────

const STORAGE_DYNAMIC = "@kric/dynamic_stations_v1";
const STORAGE_CODE_MAP = "@kric/station_code_map_v2"; // v2: added stinConsOrdr
const STORAGE_ROUTES = "@kric/routes_v1";
const STORAGE_SYNC_TS = "@kric/last_sync_ts_v1";
const STORAGE_CHECKSUM = "@kric/data_checksum_v1";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Public types ─────────────────────────────────────────────

/** Minimal KRIC identifiers needed to call timetable / transfer APIs. */
export interface KricStationRef {
  stinCd: string;
  railOprIsttCd: string;
  lnCd: string;
  /** Station order along the line (from stinConsOrdr) — used for direction filtering */
  stinConsOrdr: number;
}

/** Lookup map: "<stinNm>|<kricLnCd>" → KricStationRef */
export type KricCodeMap = Record<string, KricStationRef>;

/** A single route (경로) within a line — captures branch lines. */
export interface KricRoute {
  lnCd: string;
  appLine: string;
  lineColor: string;
  lineNumber: string;
  /** KRIC route code */
  routCd: string;
  /** KRIC route name (e.g. "1호선 본선", "5호선 방화지선") */
  routNm: string;
  stationCount: number;
}

// ── In-memory caches ─────────────────────────────────────────

let _codeMap: KricCodeMap = {};
let _routes: KricRoute[] = [];

export function getKricRef(
  stationName: string,
  kricLnCd: string,
): KricStationRef | null {
  return _codeMap[`${stationName}|${kricLnCd}`] ?? null;
}

/**
 * Reverse lookup: given a raw KRIC stinCd and line code, return the
 * stinConsOrdr for that station. Used to determine travel direction when
 * filtering timetable items by tmnStinCd.
 */
export function getStinConsOrdrByCd(
  stinCd: string,
  kricLnCd: string,
): number | undefined {
  for (const [key, ref] of Object.entries(_codeMap)) {
    if (key.endsWith(`|${kricLnCd}`) && ref.stinCd === stinCd) {
      return ref.stinConsOrdr;
    }
  }
  return undefined;
}

export function getKricCodeMap(): KricCodeMap {
  return _codeMap;
}

export function getKricRoutes(): KricRoute[] {
  return _routes;
}

// ── Sync result ───────────────────────────────────────────────

export interface SyncResult {
  dynamicStationsAdded: number;
  codeMapEntries: number;
  routeEntries: number;
  linesSucceeded: number;
  linesFailed: number;
  errors: string[];
}

// ── Core sync logic ──────────────────────────────────────────

function buildStationId(railOprIsttCd: string, stinCd: string): string {
  return `kric_${railOprIsttCd}_${stinCd}`;
}

/** Strips KRIC's parenthetical location notes, e.g. "교대(법원.검찰청)" → "교대". */
function stripParenSuffix(name: string): string {
  const idx = name.indexOf("(");
  return idx > 0 ? name.slice(0, idx).trimEnd() : name;
}

async function syncCoordinates(
  items: SubwayRouteInfoItem[],
): Promise<Record<string, { lat: number; lon: number }>> {
  const coords: Record<string, { lat: number; lon: number }> = {};

  // Fetch coordinates for each unique station in this batch
  const uniqueStations = Array.from(
    new Set(
      items.map((item) => `${item.railOprIsttCd}|${item.lnCd}|${item.stinCd}`),
    ),
  );

  const tasks = uniqueStations.map(async (key) => {
    const [railOprIsttCd, lnCd, stinCd] = key.split("|");
    if (!(railOprIsttCd && lnCd && stinCd)) return;

    try {
      const info = await fetchStationInfo({
        railOprIsttCd,
        lnCd,
        stinCd,
      });
      const first = info[0];
      if (first?.stinLocLat && first?.stinLocLon) {
        coords[stinCd] = {
          lat: Number.parseFloat(first.stinLocLat),
          lon: Number.parseFloat(first.stinLocLon),
        };
      }
    } catch {
      // Ignore coordinate fetch errors for individual stations
    }
  });

  await Promise.allSettled(tasks);
  return coords;
}

/** Parse a station's line-position order; invalid values sort to the end so a
 *  malformed API row never scrambles the line sequence (and thus graph edges). */
function parseStinConsOrdr(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function itemsToStation(
  items: SubwayRouteInfoItem[],
  target: SyncTarget,
  coordsMap: Record<string, { lat: number; lon: number }>,
): Station[] {
  return items
    .slice()
    .sort(
      (a, b) =>
        parseStinConsOrdr(a.stinConsOrdr) - parseStinConsOrdr(b.stinConsOrdr),
    )
    .map((item) => {
      const s: Station = {
        id: buildStationId(item.railOprIsttCd, item.stinCd),
        name: stripParenSuffix(item.stinNm),
        line: target.appLine,
        lineNumber: target.lineNumber,
        lineColor: target.lineColor,
      };
      const c = coordsMap[item.stinCd];
      if (c) {
        s.latitude = c.lat;
        s.longitude = c.lon;
      }
      return s;
    });
}

function buildCodeMapEntries(
  items: SubwayRouteInfoItem[],
  kricLnCd: string,
): KricCodeMap {
  const map: KricCodeMap = {};
  for (const item of items) {
    const stinNm = stripParenSuffix(item.stinNm);
    map[`${stinNm}|${kricLnCd}`] = {
      stinCd: item.stinCd,
      railOprIsttCd: item.railOprIsttCd,
      lnCd: item.lnCd,
      stinConsOrdr: Number(item.stinConsOrdr),
    };
  }
  return map;
}

/** Builds a KricRoute[] from the items of a single line API response. */
function buildRouteEntries(
  items: SubwayRouteInfoItem[],
  target: SyncTarget,
): KricRoute[] {
  const routeMap = new Map<string, KricRoute>();
  for (const item of items) {
    const existing = routeMap.get(item.routCd);
    if (existing) {
      existing.stationCount++;
    } else {
      routeMap.set(item.routCd, {
        lnCd: target.lnCd,
        appLine: target.appLine,
        lineColor: target.lineColor,
        lineNumber: target.lineNumber,
        routCd: item.routCd,
        routNm: item.routNm,
        stationCount: 1,
      });
    }
  }
  return [...routeMap.values()];
}

function computeCodeMapChecksum(codeMap: KricCodeMap): string {
  const entries = Object.entries(codeMap).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const str = JSON.stringify(entries);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
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
    const [dynRaw, mapRaw, routesRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_DYNAMIC),
      AsyncStorage.getItem(STORAGE_CODE_MAP),
      AsyncStorage.getItem(STORAGE_ROUTES),
    ]);
    if (!(dynRaw && mapRaw)) return false;
    const dynamic = JSON.parse(dynRaw) as Station[];
    const map = JSON.parse(mapRaw) as KricCodeMap;
    setDynamicStations(dynamic);
    _codeMap = map;
    if (routesRaw) {
      _routes = JSON.parse(routesRaw) as KricRoute[];
    }
    return true;
  } catch {
    return false;
  }
}

async function saveToCache(
  dynamic: Station[],
  map: KricCodeMap,
  routes: KricRoute[],
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(STORAGE_DYNAMIC, JSON.stringify(dynamic)),
    AsyncStorage.setItem(STORAGE_CODE_MAP, JSON.stringify(map)),
    AsyncStorage.setItem(STORAGE_ROUTES, JSON.stringify(routes)),
    AsyncStorage.setItem(STORAGE_SYNC_TS, String(Date.now())),
  ]);
}

/**
 * Sync all Seoul Metro lines from the KRIC API.
 *
 * - Skips if the cache is still valid (< 24 h old) unless `force` is true.
 * - Fetches each line independently so a single failure doesn't abort others.
 * - Updates the in-memory station store, KRIC code map, and routes list.
 */
export async function syncKricStations(
  opts: { force?: boolean } = {},
): Promise<SyncResult> {
  if (!opts.force && (await isCacheValid())) {
    const loaded = await loadFromCache();
    if (loaded) {
      return {
        dynamicStationsAdded: 0,
        codeMapEntries: Object.keys(_codeMap).length,
        routeEntries: _routes.length,
        linesSucceeded: 0,
        linesFailed: 0,
        errors: [],
      };
    }
    // Cache timestamp was valid but data was missing/corrupt — fall through
    // to a fresh sync (e.g. after a storage key schema bump).
  }

  const dynamicStations: Station[] = [];
  const codeMap: KricCodeMap = {};
  const routes: KricRoute[] = [];
  let linesSucceeded = 0;
  let linesFailed = 0;
  const errors: string[] = [];

  const syncTasks = SYNC_TARGETS.map(async (target) => {
    try {
      const items = await fetchSubwayRouteInfo({
        mreaWideCd: target.mreaWideCd,
        lnCd: target.lnCd,
      });

      if (items.length === 0) return;

      // Fetch coordinates for these stations
      const coordsMap = await syncCoordinates(items);

      // Build KRIC code map entries for every line (needed for timetable API)
      Object.assign(codeMap, buildCodeMapEntries(items, target.lnCd));

      // Build route entries (captures branch lines like 5호선 방화지선)
      routes.push(...buildRouteEntries(items, target));

      // Always process stations to capture potential coordinate updates
      const stations = itemsToStation(items, target, coordsMap);

      // Add all synced stations to the dynamic pool so they enrich/override
      // static bundle data with fresh API-sourced info (like coordinates).
      dynamicStations.push(...stations);

      linesSucceeded++;
    } catch (err) {
      linesFailed++;
      errors.push(
        `${target.appLine}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  });

  await Promise.allSettled(syncTasks);

  setDynamicStations(dynamicStations);
  _codeMap = codeMap;
  _routes = routes;

  await saveToCache(getDynamicStations(), codeMap, routes);

  return {
    dynamicStationsAdded: getDynamicStations().length,
    codeMapEntries: Object.keys(codeMap).length,
    routeEntries: routes.length,
    linesSucceeded,
    linesFailed,
    errors,
  };
}

/** Load persisted data into memory without hitting the API. */
export async function loadCachedKricData(): Promise<void> {
  await loadFromCache();
}

/**
 * Merge freshly-fetched route info for a single line into the in-memory code
 * map, station store, and routes list, then persist to AsyncStorage.
 * Called by the dev API Inspector after a successful subwayRouteInfo query.
 */
export async function mergeLineRouteInfo(
  items: SubwayRouteInfoItem[],
  lnCd: string,
): Promise<{ codeMapEntries: number; stationsAdded: number }> {
  if (items.length === 0) return { codeMapEntries: 0, stationsAdded: 0 };

  const newEntries = buildCodeMapEntries(items, lnCd);
  Object.assign(_codeMap, newEntries);

  const target = SYNC_TARGETS.find((t) => t.lnCd === lnCd);
  let stationsAdded = 0;
  if (target) {
    // Refresh coordinates
    const coordsMap = await syncCoordinates(items);

    const existing = getDynamicStations().filter(
      (s) => s.line !== target.appLine,
    );
    const newStations = itemsToStation(items, target, coordsMap);
    setDynamicStations([...existing, ...newStations]);
    stationsAdded = newStations.length;
  }

  // Update route entries for this line (replace old ones)
  if (target) {
    const newRoutes = buildRouteEntries(items, target);
    _routes = [..._routes.filter((r) => r.lnCd !== lnCd), ...newRoutes];
  }

  await saveToCache(getDynamicStations(), _codeMap, _routes);
  return { codeMapEntries: Object.keys(newEntries).length, stationsAdded };
}

/**
 * Force-syncs all lines, computes a checksum of the new code map, and
 * compares it with the previously stored checksum.
 *
 * Returns `updated = true` only when data actually changed (not on the very
 * first run when there is no baseline checksum yet).
 */
export async function checkAndRefreshData(): Promise<{
  updated: boolean;
  linesChecked: number;
  stations: number;
  routes: number;
  transfers: number;
}> {
  const prevChecksum = await AsyncStorage.getItem(STORAGE_CHECKSUM).catch(
    () => null,
  );

  const result = await syncKricStations({ force: true });

  const newChecksum = computeCodeMapChecksum(_codeMap);
  const updated = prevChecksum !== null && newChecksum !== prevChecksum;

  await AsyncStorage.setItem(STORAGE_CHECKSUM, newChecksum).catch(() => {
    // best-effort
  });

  return {
    updated,
    linesChecked: result.linesSucceeded,
    // getAllStations() = static bundle + deduped dynamic (true total)
    stations: getAllStations().length,
    routes: result.routeEntries,
    transfers: result.codeMapEntries,
  };
}
