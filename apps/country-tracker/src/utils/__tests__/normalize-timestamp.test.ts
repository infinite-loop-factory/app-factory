import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { normalizeTimestamp } from "@/utils/normalize-timestamp";

describe("normalizeTimestamp", () => {
  it("returns an ISO string unchanged", () => {
    const iso = "2025-09-28T12:34:56.789Z";
    expect(normalizeTimestamp(iso)).toBe(iso);
  });

  it("converts millisecond timestamps to ISO strings", () => {
    const ms = Date.UTC(2025, 0, 1, 8, 30, 15, 123);
    expect(normalizeTimestamp(ms)).toBe(new Date(ms).toISOString());
  });

  it("converts Date instances to ISO strings", () => {
    const date = new Date("2025-02-14T09:10:11.000Z");
    expect(normalizeTimestamp(date)).toBe(date.toISOString());
  });

  describe("fallback handling", () => {
    const fixed = new Date("2025-01-01T00:00:00.000Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(fixed);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("falls back to current time for null", () => {
      expect(normalizeTimestamp(null)).toBe(fixed.toISOString());
    });

    it("falls back to current time for non-finite numbers", () => {
      expect(normalizeTimestamp(Number.NaN)).toBe(fixed.toISOString());
    });
  });
});
