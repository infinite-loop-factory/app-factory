import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import {
  applyCompletion,
  bumpAttempts,
  EMPTY_DAILY_PROGRESS,
  parseDailyProgress,
  previousDaySeed,
} from "@/lib/daily-progress";

describe("daily progress", () => {
  it("computes the previous day's seed across month boundaries", () => {
    expect(previousDaySeed(new Date(2026, 5, 11))).toBe(20260610);
    expect(previousDaySeed(new Date(2026, 5, 1))).toBe(20260531);
    expect(previousDaySeed(new Date(2026, 0, 1))).toBe(20251231);
  });

  it("counts attempts per board and resets on a new board", () => {
    let p = bumpAttempts(EMPTY_DAILY_PROGRESS, 20260611);
    expect(p.attempts).toBe(1);
    p = bumpAttempts(p, 20260611);
    expect(p.attempts).toBe(2);
    p = bumpAttempts(p, 20260612);
    expect(p.attempts).toBe(1);
  });

  it("extends the streak only on consecutive days", () => {
    let p = applyCompletion(EMPTY_DAILY_PROGRESS, 20260610, 20260609);
    expect(p.streak).toBe(1);
    p = applyCompletion(p, 20260611, 20260610);
    expect(p.streak).toBe(2);
    // skipped a day — restart
    p = applyCompletion(p, 20260614, 20260613);
    expect(p.streak).toBe(1);
  });

  it("never double-counts the same day", () => {
    let p = applyCompletion(EMPTY_DAILY_PROGRESS, 20260611, 20260610);
    p = applyCompletion(p, 20260611, 20260610);
    expect(p.streak).toBe(1);
  });

  it("parses corrupt storage to a clean slate", () => {
    expect(parseDailyProgress("not-json")).toEqual(EMPTY_DAILY_PROGRESS);
    expect(parseDailyProgress(null)).toEqual(EMPTY_DAILY_PROGRESS);
  });

  it("reads back a valid persisted state", () => {
    const state = {
      attemptSeed: 20260613,
      attempts: 3,
      completedSeed: 20260612,
      streak: 5,
    };
    expect(parseDailyProgress(JSON.stringify(state))).toEqual(state);
  });

  it("sanitizes tampered counts and seeds", () => {
    const parsed = parseDailyProgress(
      '{"attemptSeed":"x","attempts":-4,"completedSeed":1.9,"streak":"99"}',
    );
    expect(parsed.attemptSeed).toBeNull();
    expect(parsed.attempts).toBe(0);
    expect(parsed.completedSeed).toBe(1);
    expect(parsed.streak).toBe(99);
  });
});
