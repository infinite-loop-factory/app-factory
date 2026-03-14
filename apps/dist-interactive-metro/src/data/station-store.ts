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

/** Replace the dynamic station set and rebuild the merged array. */
export function setDynamicStations(stations: Station[]): void {
  _dynamic = stations;
  _merged = [...staticStations, ...stations];
}

/** Return all stations (static + dynamic) as a stable reference. */
export function getAllStations(): Station[] {
  return _merged;
}

/** Return only the dynamically loaded stations. */
export function getDynamicStations(): Station[] {
  return _dynamic;
}
