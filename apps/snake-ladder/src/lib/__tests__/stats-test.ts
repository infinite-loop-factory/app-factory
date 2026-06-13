import { describe, expect, it } from "@jest/globals";
import { DEFAULT_STATS, parseStats, winRate } from "@/lib/stats";

describe("parseStats", () => {
  it("returns defaults for null or malformed JSON", () => {
    expect(parseStats(null)).toEqual(DEFAULT_STATS);
    expect(parseStats("{not json")).toEqual(DEFAULT_STATS);
  });

  it("reads back a valid persisted state", () => {
    const state = { gamesPlayed: 10, wins: 6, losses: 4 };
    expect(parseStats(JSON.stringify(state))).toEqual(state);
  });

  it("sanitizes tampered negative or non-numeric counts", () => {
    const parsed = parseStats('{"gamesPlayed":"8","wins":-2,"losses":1.9}');
    expect(parsed.gamesPlayed).toBe(8);
    expect(parsed.wins).toBe(0);
    expect(parsed.losses).toBe(1);
  });
});

describe("winRate", () => {
  it("is zero with no games played", () => {
    expect(winRate(DEFAULT_STATS)).toBe(0);
  });

  it("rounds the win percentage", () => {
    expect(winRate({ gamesPlayed: 3, wins: 2, losses: 1 })).toBe(67);
  });
});
