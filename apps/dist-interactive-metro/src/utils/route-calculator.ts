import type { Station } from "@/types/station";

export interface RouteSegment {
  station: Station;
  isTransfer?: boolean;
  transferTo?: string[];
}

export interface RouteInfo {
  segments: RouteSegment[];
  totalStations: number;
  totalTime: number; // minutes
  transfers: number;
}

/**
 * Calculate a route between two stations (mock implementation).
 * A real implementation would use a graph-based shortest-path algorithm.
 */
export function calculateRoute(
  start: Station,
  end: Station,
  _via?: Station,
): RouteInfo {
  // Same line — direct route
  if (start.line === end.line) {
    const segments: RouteSegment[] = [{ station: start }, { station: end }];
    return { segments, totalStations: 5, totalTime: 15, transfers: 0 };
  }

  // Different lines — find a transfer station
  const transferStation = findTransferStation(start, end);

  if (transferStation) {
    const segments: RouteSegment[] = [
      { station: start },
      { station: transferStation, isTransfer: true, transferTo: [end.line] },
      { station: end },
    ];
    return { segments, totalStations: 8, totalTime: 25, transfers: 1 };
  }

  // Fallback — double transfer (mock)
  return {
    segments: [
      { station: start },
      {
        station: { ...start, name: "환승역1" },
        isTransfer: true,
        transferTo: ["중간노선"],
      },
      {
        station: { ...end, name: "환승역2" },
        isTransfer: true,
        transferTo: [end.line],
      },
      { station: end },
    ],
    totalStations: 12,
    totalTime: 40,
    transfers: 2,
  };
}

function findTransferStation(start: Station, _end: Station): Station | null {
  // Mock: in a real app this would traverse the subway graph
  return {
    ...start,
    name: "환승역",
    connections: [start.line, _end.line],
  };
}
