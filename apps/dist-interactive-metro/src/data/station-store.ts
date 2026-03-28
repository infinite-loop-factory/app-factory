/**
 * Station store — merges the static bundled station list with any stations
 * fetched dynamically from the KRIC API (missing lines: 6, 8, Airport, etc.).
 *
 * Uses a stable reference so the Dijkstra cache in route-calculator.ts stays
 * valid between calls and is only rebuilt when dynamic stations change.
 */

import type { Station } from "@/types/station";

import { stations as staticStations } from "./stations";

let _dynamic: Station[] = [];
let _merged: Station[] = staticStations;

/** Replace the dynamic station set and rebuild the merged array.
 *  Deduplicates against the static bundle by (name, line) so that lines
 *  which are both in the static bundle and fetched dynamically don't appear twice.
 */
export function setDynamicStations(stations: Station[]): void {
  const staticKeys = new Set(staticStations.map((s) => `${s.name}|${s.line}`));
  _dynamic = stations.filter((s) => !staticKeys.has(`${s.name}|${s.line}`));
  _merged = [...staticStations, ..._dynamic];
}

/** Return all stations (static + dynamic) as a stable reference. */
export function getAllStations(): Station[] {
  return _merged;
}

/** Return only the dynamically loaded stations. */
export function getDynamicStations(): Station[] {
  return _dynamic;
}

/** Search all stations (static + dynamic) by name or line. */
export function searchAllStations(keyword: string): Station[] {
  if (!keyword.trim()) return [];
  const lower = keyword.toLowerCase();
  return _merged.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.line.toLowerCase().includes(lower),
  );
}
