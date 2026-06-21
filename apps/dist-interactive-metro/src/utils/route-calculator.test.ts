import type { Station } from "@/types/station";

import { describe, expect, it } from "@jest/globals";
import { stations } from "@/data/stations";
import { calculateRoute } from "./route-calculator";

function station(name: string, line: string): Station {
  const found = stations.find((s) => s.name === name && s.line === line);
  if (!found) throw new Error(`fixture station not found: ${name} (${line})`);
  return found;
}

describe("calculateRoute", () => {
  it("flags start and destination being the same physical station", () => {
    const seoul1 = station("시청", "1호선");
    const seoul2 = station("시청", "2호선");
    const route = calculateRoute(seoul1, seoul2);
    expect(route.sameStation).toBe(true);
    expect(route.totalTime).toBe(0);
  });

  it("routes along a single line without transfers", () => {
    const route = calculateRoute(
      station("청량리", "1호선"),
      station("서울역", "1호선"),
    );
    expect(route.transfers).toBe(0);
    expect(route.notFound).toBeUndefined();
    expect(route.sameStation).toBeUndefined();
    // 청량리 → 서울역 spans the central line 1 trunk (well over 2 stops).
    expect(route.totalStations).toBeGreaterThan(2);
    expect(route.segments[0]?.station.name).toBe("청량리");
    expect(route.segments.at(-1)?.station.name).toBe("서울역");
  });

  it("does not treat distant line 1 stations as adjacent", () => {
    // Regression: the static bundle once linked 청량리 directly to 노량진.
    const route = calculateRoute(
      station("청량리", "1호선"),
      station("노량진", "1호선"),
    );
    expect(route.totalStations).toBeGreaterThan(2);
  });

  it("includes at least one transfer when changing lines", () => {
    const route = calculateRoute(
      station("서울역", "1호선"),
      station("을지로입구", "2호선"),
    );
    expect(route.transfers).toBeGreaterThanOrEqual(1);
    expect(route.totalTime).toBeGreaterThan(0);
    expect(route.segments.some((s) => s.isTransfer)).toBe(true);
  });

  it("produces a monotonic travel time as more stops are added", () => {
    const short = calculateRoute(
      station("청량리", "1호선"),
      station("제기동", "1호선"),
    );
    const long = calculateRoute(
      station("청량리", "1호선"),
      station("서울역", "1호선"),
    );
    expect(long.totalTime).toBeGreaterThan(short.totalTime);
  });
});
