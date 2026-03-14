/**
 * Typed client for the KRIC (Korea Railway Information Center) Open API.
 *
 * Base URL : https://openapi.kric.go.kr/openapi/
 * Auth     : EXPO_PUBLIC_KRIC_SERVICE_KEY env var (never commit the real value)
 * Format   : JSON (format=json query param)
 *
 * Endpoints covered
 * ─────────────────
 *  trainUseInfo/subwayRouteInfo          – all stations on a route
 *  trainUseInfo/subwayTimetable          – timetable by train number
 *  convenientInfo/stationTimetable       – timetable by station (incl. terminus)
 *  convenientInfo/stationTransferInfo    – transfer distances at a station
 *  vulnerableUserInfo/transferMovement   – step-by-step accessible transfer path
 */

const BASE_URL = "https://openapi.kric.go.kr/openapi";

function getServiceKey(): string {
  const key = process.env.EXPO_PUBLIC_KRIC_SERVICE_KEY;
  if (!key) throw new Error("EXPO_PUBLIC_KRIC_SERVICE_KEY is not set");
  return key;
}

// ── Response envelope ────────────────────────────────────────
// KRIC returns either a flat body or a nested response wrapper depending
// on the endpoint version. We normalise both to a plain array.

interface KricEnvelope<T> {
  header?: { resultCode: string; resultMsg: string };
  body?: { items?: T[] | { item?: T[] } | null; totalCount?: number };
  response?: {
    header?: { resultCode: string; resultMsg: string };
    body?: { items?: T[] | { item?: T[] } | null; totalCount?: number };
  };
}

function extractItems<T>(raw: KricEnvelope<T>): T[] {
  const body = raw.body ?? raw.response?.body;
  const header = raw.header ?? raw.response?.header;

  if (header && header.resultCode !== "00" && header.resultCode !== "0000") {
    throw new Error(`KRIC API error ${header.resultCode}: ${header.resultMsg}`);
  }

  const items = body?.items;
  if (!items) return [];
  if (Array.isArray(items)) return items;
  // Older envelope wraps items in { item: [...] }
  return items.item ?? [];
}

async function get<T>(
  path: string,
  params: Record<string, string>,
): Promise<T[]> {
  const qs = new URLSearchParams({
    serviceKey: getServiceKey(),
    format: "json",
    ...params,
  });
  const url = `${BASE_URL}/${path}?${qs.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`KRIC HTTP ${res.status} for ${path}`);
  }
  const json = (await res.json()) as KricEnvelope<T>;
  return extractItems<T>(json);
}

// ── 1. trainUseInfo / subwayRouteInfo ────────────────────────
// Returns every station on a given line, in sequence order.

export interface SubwayRouteInfoItem {
  /** Line code, e.g. "1", "6", "A1" */
  lnCd: string;
  /** Region code — "01" = Seoul */
  mreaWideCd: string;
  /** Railway operator code, e.g. "S1" for Seoul Metro */
  railOprIsttCd: string;
  /** Route code */
  routCd: string;
  /** Route name */
  routNm: string;
  /** KRIC station code */
  stinCd: string;
  /** Station sequence order (ascending = upstream→downstream) */
  stinConsOrdr: string;
  /** Station name (Korean) */
  stinNm: string;
}

export function fetchSubwayRouteInfo(params: {
  mreaWideCd: string;
  lnCd: string;
}): Promise<SubwayRouteInfoItem[]> {
  return get<SubwayRouteInfoItem>("trainUseInfo/subwayRouteInfo", params);
}

// ── 2. trainUseInfo / subwayTimetable ────────────────────────
// Timetable keyed by train number for a specific station.

export interface SubwayTimetableItem {
  arvTm: string;
  dptTm: string;
  trnNo: string;
  dayCd: string;
  dayNm: string;
  lnCd: string;
  railOprIsttCd: string;
  stinCd: string;
}

export type DayCd = "8" | "7" | "9"; // weekday | Saturday | Sunday/holiday

export function fetchSubwayTimetable(params: {
  railOprIsttCd: string;
  dayCd: DayCd;
  lnCd: string;
  stinCd: string;
}): Promise<SubwayTimetableItem[]> {
  return get<SubwayTimetableItem>("trainUseInfo/subwayTimetable", params);
}

// ── 3. convenientInfo / stationTimetable ─────────────────────
// Timetable by station, including origin and terminus station codes.
// Prefer this over subwayTimetable when you need to filter by direction.

export interface StationTimetableItem {
  arvTm: string;
  dptTm: string;
  trnNo: string;
  dayCd: string;
  dayNm: string;
  lnCd: string;
  stinCd: string;
  /** Origin station code (where the train started) */
  orgStinCd: string;
  /** Terminus station code (final stop of this run) */
  tmnStinCd: string;
  railOprIsttCd: string;
}

export function fetchStationTimetable(params: {
  railOprIsttCd: string;
  dayCd: DayCd;
  lnCd: string;
  stinCd: string;
}): Promise<StationTimetableItem[]> {
  return get<StationTimetableItem>("convenientInfo/stationTimetable", params);
}

// ── 4. convenientInfo / stationTransferInfo ──────────────────
// Transfer connection info (distance, line) at a station.

export interface StationTransferInfoItem {
  /** Transfer walking distance (metres as string) */
  chtnDst: string;
  /** Transfer target line name */
  chtnLn: string;
  /** Destination platform location description */
  clsLocCont: string;
  lnCd: string;
  railOprIsttCd: string;
  /** Origin platform location description */
  stLocCont: string;
  stinCd: string;
}

export function fetchStationTransferInfo(params: {
  railOprIsttCd: string;
  lnCd: string;
  stinCd: string;
}): Promise<StationTransferInfoItem[]> {
  return get<StationTransferInfoItem>(
    "convenientInfo/stationTransferInfo",
    params,
  );
}

// ── 5. vulnerableUserInfo / transferMovement ─────────────────
// Step-by-step accessible transfer path with elevator status.

export interface TransferMovementItem {
  /** Step sequence number */
  chtnMvTpOrdr: string;
  /** End point label for this step */
  edMovePath: string;
  /** Elevator status code */
  elvtSttCd: string;
  /** Elevator type code */
  elvtTpCd: string;
  /** Diagram/map image path */
  imgPath: string;
  /** Detailed movement instruction */
  mvContDtl: string;
  /** Route management number */
  mvPathMgNo: string;
  /** Start point label for this step */
  stMovePath: string;
}

export function fetchTransferMovement(params: {
  railOprIsttCd: string;
  lnCd: string;
  stinCd: string;
  prevStinCd: string;
  chthTgtLn: string;
  chtnNextStinCd: string;
}): Promise<TransferMovementItem[]> {
  return get<TransferMovementItem>(
    "vulnerableUserInfo/transferMovement",
    params,
  );
}

// ── Day code helper ──────────────────────────────────────────

export function getCurrentDayCd(): DayCd {
  const day = new Date().getDay(); // 0 = Sun
  if (day === 0) return "9";
  if (day === 6) return "7";
  return "8";
}

// ── Time helpers ─────────────────────────────────────────────
// API returns time as "HHMM" or "HHMMSS" strings.

export function parseApiTime(t: string): number {
  const h = Number.parseInt(t.slice(0, 2), 10);
  const m = Number.parseInt(t.slice(2, 4), 10);
  return h * 60 + m;
}

/** Current time as minutes since midnight */
export function nowInMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}
