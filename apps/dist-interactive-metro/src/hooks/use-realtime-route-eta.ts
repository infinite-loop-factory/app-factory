import type { Station } from "@/types/station";
import type { RouteEta } from "./use-route-eta";
import type { TransferPoint } from "./use-route-transfer-minutes";

import { useMemo } from "react";
import { MINS_PER_TRANSFER, type RouteInfo } from "@/utils/route-calculator";
import { useRouteEta } from "./use-route-eta";
import { useRouteTransferMinutes } from "./use-route-transfer-minutes";

/** Transfer points along a route (departure side of each interchange). */
function deriveTransferPoints(routeInfo: RouteInfo | null): TransferPoint[] {
  if (!routeInfo) return [];
  return routeInfo.segments
    .filter((s) => s.isTransfer && s.transferTo?.[0])
    .map((s) => ({
      stationName: s.station.name,
      fromLine: s.station.line,
      toLine: s.transferTo?.[0] ?? "",
    }));
}

/**
 * Combines the static route estimate with real-time signals — the next
 * boardable train and actual interchange walking distances — into a single
 * realistic ETA. Both the result screen and recommendation cards use this so a
 * route never reports two different arrival times.
 */
export function useRealtimeRouteEta(params: {
  routeInfo: RouteInfo | null;
  startStation: Station | null;
  firstLegDestinationName: string;
}): RouteEta {
  const { routeInfo, startStation, firstLegDestinationName } = params;

  const transferPoints = useMemo(
    () => deriveTransferPoints(routeInfo),
    [routeInfo],
  );
  const { transferMinutes } = useRouteTransferMinutes(transferPoints);

  const travelMinutes = routeInfo
    ? routeInfo.totalTime -
      routeInfo.transfers * MINS_PER_TRANSFER +
      transferMinutes
    : 0;

  return useRouteEta({
    startStationName: startStation?.name ?? "",
    startStationLine: startStation?.line ?? "",
    destinationStationName: firstLegDestinationName,
    travelMinutes,
  });
}
