import type { NearbyStation, Station } from "@/types/station";

// ── Public types ─────────────────────────────────────────────

export interface RouteSegment {
  station: Station;
  isTransfer?: boolean;
  transferTo?: string[];
}

export interface RouteInfo {
  segments: RouteSegment[];
  /** Number of distinct physical stations visited (including start & end) */
  totalStations: number;
  /** Estimated subway travel time in minutes */
  totalTime: number;
  transfers: number;
}

export interface RouteRecommendation {
  departure: NearbyStation;
  route: RouteInfo;
  walkingMinutes: number;
  totalMinutes: number;
}

// ── Constants ────────────────────────────────────────────────

const MINS_PER_STOP = 2;
const MINS_PER_TRANSFER = 3;
/** Transfer penalty so fewer-transfers beats fewer-hops in Dijkstra */
const TRANSFER_PENALTY = 1000;

// ── Graph ────────────────────────────────────────────────────

type EdgeMap = Map<string, Array<{ toId: string; isTransfer: boolean }>>;

let _graph: EdgeMap | null = null;
let _graphSource: Station[] | null = null;

function ensureEdge(graph: EdgeMap, id: string): void {
  if (!graph.has(id)) graph.set(id, []);
}

function addBidirectional(
  graph: EdgeMap,
  a: string,
  b: string,
  isTransfer: boolean,
): void {
  ensureEdge(graph, a);
  ensureEdge(graph, b);
  graph.get(a)?.push({ toId: b, isTransfer }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  graph.get(b)?.push({ toId: a, isTransfer }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

function addLineEdges(graph: EdgeMap, stations: Station[]): void {
  const byLine = new Map<string, Station[]>();
  for (const s of stations) {
    const arr = byLine.get(s.line) ?? [];
    arr.push(s);
    byLine.set(s.line, arr);
  }
  for (const lineStations of byLine.values()) {
    for (let i = 0; i < lineStations.length - 1; i++) {
      addBidirectional(
        graph,
        lineStations[i].id,
        lineStations[i + 1].id,
        false,
      );
    }
  }
}

function addTransferEdges(graph: EdgeMap, stations: Station[]): void {
  const byName = new Map<string, Station[]>();
  for (const s of stations) {
    const arr = byName.get(s.name) ?? [];
    arr.push(s);
    byName.set(s.name, arr);
  }
  for (const group of byName.values()) {
    if (group.length < 2) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        addBidirectional(graph, group[i].id, group[j].id, true);
      }
    }
  }
}

function buildGraph(stations: Station[]): EdgeMap {
  if (_graph && _graphSource === stations) return _graph;
  const graph: EdgeMap = new Map();
  for (const s of stations) ensureEdge(graph, s.id);
  addLineEdges(graph, stations);
  addTransferEdges(graph, stations);
  _graph = graph;
  _graphSource = stations;
  return graph;
}

// ── Dijkstra ─────────────────────────────────────────────────

interface DijkstraResult {
  path: string[];
  transferEdges: Set<string>;
  totalHops: number;
  totalTransfers: number;
}

interface DijkstraState {
  id: string;
  cost: number;
  hops: number;
  transfers: number;
  path: string[];
  transferEdges: Set<string>;
}

function insertSorted(queue: DijkstraState[], s: DijkstraState): void {
  let lo = 0;
  let hi = queue.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (queue[mid].cost <= s.cost) lo = mid + 1;
    else hi = mid;
  }
  queue.splice(lo, 0, s);
}

function expandNode(
  curr: DijkstraState,
  edge: { toId: string; isTransfer: boolean },
  bestCost: Map<string, number>,
  queue: DijkstraState[],
): void {
  const newTransfers = curr.transfers + (edge.isTransfer ? 1 : 0);
  const newHops = curr.hops + 1;
  const newCost = newTransfers * TRANSFER_PENALTY + newHops;
  if (newCost >= (bestCost.get(edge.toId) ?? Number.POSITIVE_INFINITY)) return;
  bestCost.set(edge.toId, newCost);
  const newTransferEdges = new Set(curr.transferEdges);
  if (edge.isTransfer) newTransferEdges.add(`${curr.id}->${edge.toId}`);
  insertSorted(queue, {
    id: edge.toId,
    cost: newCost,
    hops: newHops,
    transfers: newTransfers,
    path: [...curr.path, edge.toId],
    transferEdges: newTransferEdges,
  });
}

function dijkstra(
  graph: EdgeMap,
  startId: string,
  endId: string,
): DijkstraResult | null {
  if (startId === endId) {
    return {
      path: [startId],
      transferEdges: new Set(),
      totalHops: 0,
      totalTransfers: 0,
    };
  }
  const bestCost = new Map<string, number>();
  const queue: DijkstraState[] = [];
  insertSorted(queue, {
    id: startId,
    cost: 0,
    hops: 0,
    transfers: 0,
    path: [startId],
    transferEdges: new Set(),
  });
  bestCost.set(startId, 0);
  while (queue.length > 0) {
    const curr = queue.shift();
    if (!curr) break;
    if (curr.id === endId) {
      return {
        path: curr.path,
        transferEdges: curr.transferEdges,
        totalHops: curr.hops,
        totalTransfers: curr.transfers,
      };
    }
    if ((bestCost.get(curr.id) ?? Number.POSITIVE_INFINITY) < curr.cost)
      continue;
    for (const edge of graph.get(curr.id) ?? []) {
      expandNode(curr, edge, bestCost, queue);
    }
  }
  return null;
}

// ── Path → RouteInfo ─────────────────────────────────────────

function isTransferEdge(
  path: string[],
  i: number,
  transferEdges: Set<string>,
  direction: "next" | "prev",
): boolean {
  if (direction === "next") {
    const nextId = path[i + 1];
    return nextId != null && transferEdges.has(`${path[i]}->${nextId}`);
  }
  const prevId = path[i - 1];
  return prevId != null && transferEdges.has(`${prevId}->${path[i]}`);
}

function getTransferDestLine(
  path: string[],
  i: number,
  stationMap: Map<string, Station>,
): string | null {
  const nextId = path[i + 1];
  if (nextId == null) return null;
  return stationMap.get(nextId)?.line ?? null;
}

function makeSegment(
  station: Station,
  nextIsTransfer: boolean,
  prevWasTransfer: boolean,
  transferDestLine: string | null,
): RouteSegment {
  const isTransfer = nextIsTransfer || prevWasTransfer;
  const transferTo = transferDestLine != null ? [transferDestLine] : undefined;
  return {
    station,
    ...(isTransfer ? { isTransfer: true } : {}),
    ...(transferTo ? { transferTo } : {}),
  };
}

function buildSegments(
  path: string[],
  transferEdges: Set<string>,
  stationMap: Map<string, Station>,
): RouteSegment[] {
  const segments: RouteSegment[] = [];
  const lastIdx = path.length - 1;
  for (let i = 0; i <= lastIdx; i++) {
    const station = stationMap.get(path[i]);
    if (!station) continue;
    const nextIsTransfer = isTransferEdge(path, i, transferEdges, "next");
    const prevWasTransfer = isTransferEdge(path, i, transferEdges, "prev");
    // Skip "arrival side" of a transfer unless it also leaves via another transfer or is the final stop
    if (prevWasTransfer && !nextIsTransfer && i !== lastIdx) continue;
    const destLine = nextIsTransfer
      ? getTransferDestLine(path, i, stationMap)
      : null;
    segments.push(
      makeSegment(station, nextIsTransfer, prevWasTransfer, destLine),
    );
  }
  return segments;
}

function buildRouteInfo(
  result: DijkstraResult,
  stationMap: Map<string, Station>,
): RouteInfo {
  const { path, transferEdges, totalHops, totalTransfers } = result;
  const totalStations = Math.max(1, totalHops - totalTransfers + 1);
  const totalTime =
    (totalStations - 1) * MINS_PER_STOP + totalTransfers * MINS_PER_TRANSFER;
  const segments = buildSegments(path, transferEdges, stationMap);
  return { segments, totalStations, totalTime, transfers: totalTransfers };
}

// ── Station map cache ────────────────────────────────────────

let _stationMap: Map<string, Station> | null = null;
let _stationMapSource: Station[] | null = null;

function getStationMap(stations: Station[]): Map<string, Station> {
  if (_stationMap && _stationMapSource === stations) return _stationMap;
  _stationMap = new Map(stations.map((s) => [s.id, s]));
  _stationMapSource = stations;
  return _stationMap;
}

// ── Public API ───────────────────────────────────────────────

export function calculateRoute(
  start: Station,
  end: Station,
  via?: Station,
): RouteInfo {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getAllStations } = require("@/data/station-store") as {
    getAllStations: () => Station[];
  };
  const stations = getAllStations();
  const graph = buildGraph(stations);
  const stationMap = getStationMap(stations);

  if (via) {
    const leg1 = dijkstra(graph, start.id, via.id);
    const leg2 = dijkstra(graph, via.id, end.id);
    if (leg1 && leg2) {
      const combined: DijkstraResult = {
        path: [...leg1.path, ...leg2.path.slice(1)],
        transferEdges: new Set([...leg1.transferEdges, ...leg2.transferEdges]),
        totalHops: leg1.totalHops + leg2.totalHops,
        totalTransfers: leg1.totalTransfers + leg2.totalTransfers,
      };
      return buildRouteInfo(combined, stationMap);
    }
  }

  const result = dijkstra(graph, start.id, end.id);
  if (!result) {
    return {
      segments: [{ station: start }, { station: end }],
      totalStations: 2,
      totalTime: 0,
      transfers: 0,
    };
  }
  return buildRouteInfo(result, stationMap);
}

export function recommendRoutes(
  nearbyStations: NearbyStation[],
  destination: Station,
): RouteRecommendation[] {
  return nearbyStations
    .map((departure) => {
      const route = calculateRoute(departure.station, destination);
      return {
        departure,
        route,
        walkingMinutes: departure.walkingMinutes,
        totalMinutes: departure.walkingMinutes + route.totalTime,
      };
    })
    .sort((a, b) => a.totalMinutes - b.totalMinutes);
}
