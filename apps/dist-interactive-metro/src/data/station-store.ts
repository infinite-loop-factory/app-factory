/**
 * Station store — merges the static bundled station list with any stations
 * fetched dynamically from the KRIC API (missing lines: 6, 8, Airport, etc.).
 *
 * Uses a stable reference so the Dijkstra cache in route-calculator.ts stays
 * valid between calls and is only rebuilt when dynamic stations change.
 */

import type { Station } from "@/types/station";

import { useSyncExternalStore } from "react";
import { stations as staticStations } from "./stations";

let _dynamic: Station[] = [];
let _merged: Station[] = staticStations;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSnapshot(): Station[] {
  return _merged;
}

/** Replace the dynamic station set and rebuild the merged array.
 *  Deduplicates against the static bundle by (name, line) so that lines
 *  which are both in the static bundle and fetched dynamically don't appear twice.
 */
export function setDynamicStations(stations: Station[]): void {
  const staticKeys = new Set(staticStations.map((s) => `${s.name}|${s.line}`));
  const nextDynamic = stations.filter(
    (s) => !staticKeys.has(`${s.name}|${s.line}`),
  );

  if (JSON.stringify(_dynamic) === JSON.stringify(nextDynamic)) return;

  _dynamic = nextDynamic;
  _merged = [...staticStations, ..._dynamic];
  notify();
}

/** Return all stations (static + dynamic) using useSyncExternalStore for React. */
export function useStations(): Station[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Return only the dynamically loaded stations using useSyncExternalStore for React. */
export function useDynamicStations(): Station[] {
  return useSyncExternalStore(subscribe, () => _dynamic);
}

/** Return all stations (static + dynamic) as a stable reference. */
export function getAllStations(): Station[] {
  return _merged;
}

/** Return only the dynamically loaded stations. */
export function getDynamicStations(): Station[] {
  return _dynamic;
}

/** Search all stations (static + dynamic) by name or line.
 *  Returns [] for blank input intentionally — callers should display a
 *  placeholder/hint rather than flooding the UI with all stations. */
export function searchAllStations(keyword: string): Station[] {
  if (!keyword.trim()) return [];
  const lower = keyword.toLowerCase();
  return _merged.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.line.toLowerCase().includes(lower),
  );
}
