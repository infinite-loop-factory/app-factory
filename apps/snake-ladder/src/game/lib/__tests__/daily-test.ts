import { describe, expect, it } from "@jest/globals";
import { PLACEMENT_MAX, PLACEMENT_MIN } from "@/game/constants/board";
import {
  generateDailyPlacements,
  getDailyNumber,
  getDailySeed,
  getDailyTheme,
} from "@/game/lib/daily";

describe("daily board", () => {
  it("is deterministic for the same seed", () => {
    expect(generateDailyPlacements(20260611)).toEqual(
      generateDailyPlacements(20260611),
    );
  });

  it("differs across seeds", () => {
    expect(generateDailyPlacements(20260611)).not.toEqual(
      generateDailyPlacements(20260612),
    );
  });

  it("places 5 qubits per player on distinct legal cells", () => {
    const placements = generateDailyPlacements(20260611);
    expect(placements).toHaveLength(10);
    const cells = new Set(placements.map((p) => p.cell));
    expect(cells.size).toBe(10);
    for (const p of placements) {
      expect(p.cell).toBeGreaterThanOrEqual(PLACEMENT_MIN);
      expect(p.cell).toBeLessThanOrEqual(PLACEMENT_MAX);
    }
    for (const owner of [0, 1] as const) {
      const configs = placements
        .filter((p) => p.owner === owner)
        .map((p) => p.configIndex)
        .sort();
      expect(configs).toEqual([0, 1, 2, 3, 4]);
    }
  });

  it("expands themed boards deterministically", () => {
    const a = generateDailyPlacements(20260613, 7);
    const b = generateDailyPlacements(20260613, 7);
    expect(a).toEqual(b);
    expect(a).toHaveLength(14);
    expect(new Set(a.map((p) => p.cell)).size).toBe(14);
    for (const owner of [0, 1] as const) {
      const configs = a
        .filter((p) => p.owner === owner)
        .map((p) => p.configIndex);
      expect(configs).toHaveLength(7);
      // the full 0–4 set is always present; extras may repeat
      expect(new Set(configs.slice(0, 5)).size).toBe(5);
    }
  });

  it("flags weekends as the dense theme", () => {
    expect(getDailyTheme(new Date(2026, 5, 13)).id).toBe("weekend"); // Sat
    expect(getDailyTheme(new Date(2026, 5, 14)).orbsPerPlayer).toBe(7); // Sun
    expect(getDailyTheme(new Date(2026, 5, 11)).id).toBe("classic"); // Thu
  });

  it("derives seed and number from the local date", () => {
    const date = new Date(2026, 5, 11);
    expect(getDailySeed(date)).toBe(20260611);
    expect(getDailyNumber(new Date(2026, 0, 1))).toBe(1);
    expect(getDailyNumber(date)).toBe(162);
  });
});
