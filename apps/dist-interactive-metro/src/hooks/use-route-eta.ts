import { useStationTimetable } from "./use-station-timetable";

export interface RouteEta {
  /** Wait minutes until the first boardable train, or null when no real-time
   *  timetable is available (offline / unsynced line). */
  waitMinutes: number | null;
  /** Realistic total minutes: walking + wait + subway travel when real-time
   *  data exists, otherwise the theoretical walking + travel fallback. */
  totalMinutes: number;
  /** Arrival clock time as "HH:MM". */
  arrivalTime: string;
  /** True when waitMinutes reflects a real fetched departure. */
  hasRealtimeWait: boolean;
}

function formatArrivalTime(totalMinutes: number): string {
  const arrival = new Date(Date.now() + totalMinutes * 60_000);
  const h = arrival.getHours().toString().padStart(2, "0");
  const m = arrival.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Computes a realistic end-to-end ETA for a route by combining the static
 * travel estimate with the next boardable train fetched from the timetable.
 *
 * Both the "Go Now" recommendation cards and the detailed result screen use
 * this so a single route never reports two different arrival times.
 */
export function useRouteEta(params: {
  startStationName: string;
  startStationLine: string;
  destinationStationName: string;
  /** Subway travel time in minutes (RouteInfo.totalTime). */
  travelMinutes: number;
  /** Walking minutes to reach the boarding platform (0 when already there). */
  walkingMinutes?: number;
}): RouteEta {
  const walkingMinutes = params.walkingMinutes ?? 0;
  const { departures } = useStationTimetable(
    params.startStationName,
    params.startStationLine,
    5,
    params.destinationStationName,
  );

  // First train we can actually board after walking to the platform.
  const catchable = departures.find((d) => d.minutesFromNow >= walkingMinutes);
  const waitMinutes =
    catchable != null ? catchable.minutesFromNow - walkingMinutes : null;
  const totalMinutes =
    waitMinutes != null
      ? walkingMinutes + waitMinutes + params.travelMinutes
      : walkingMinutes + params.travelMinutes;

  return {
    waitMinutes,
    totalMinutes,
    arrivalTime: formatArrivalTime(totalMinutes),
    hasRealtimeWait: waitMinutes != null,
  };
}
