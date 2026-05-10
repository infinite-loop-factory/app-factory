import type { VisaLimit } from "@/features/settings/apis/visa-limits";
import type { CountryItem } from "@/types/country-item";

import { describe, expect, it, jest } from "@jest/globals";
import { checkVisaStatus } from "@/features/home/utils/visa-check";

jest.mock("@/utils/country-region", () => ({
  getStayDays: (item: Pick<CountryItem, "stayDays" | "dateSet">) =>
    Math.max(item.dateSet?.length ?? item.stayDays ?? 0, 0),
}));

function makeCountry(
  country_code: string,
  stayDays: number,
  dateSet?: string[],
): CountryItem {
  return {
    id: `id-${country_code}`,
    flag: "",
    country: country_code,
    endDate: "2024-06-01",
    stayDays,
    country_code,
    startDate: "2024-05-01",
    dateSet:
      dateSet ??
      Array.from(
        { length: stayDays },
        (_, i) => `2024-05-${String(i + 1).padStart(2, "0")}`,
      ),
  };
}

function makeLimit(
  country_code: string,
  max_days: number,
  alert_days_before: number,
): VisaLimit {
  return {
    id: `limit-${country_code}`,
    user_id: "user-1",
    country_code,
    max_days,
    alert_days_before,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  };
}

describe("checkVisaStatus", () => {
  it("returns safe when days used is well below limit", () => {
    const countries = [makeCountry("jp", 10)];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      countryCode: "jp",
      usedDays: 10,
      maxDays: 90,
      alertDaysBefore: 14,
      daysRemaining: 80,
      status: "safe",
    });
  });

  it("returns warning when days remaining is exactly equal to alertDaysBefore", () => {
    const countries = [makeCountry("jp", 76)];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results[0]?.daysRemaining).toBe(14);
    expect(results[0]?.status).toBe("warning");
  });

  it("returns warning when days remaining is less than alertDaysBefore", () => {
    const countries = [makeCountry("jp", 80)];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results[0]?.daysRemaining).toBe(10);
    expect(results[0]?.status).toBe("warning");
  });

  it("returns danger when days remaining is exactly zero", () => {
    const countries = [makeCountry("jp", 90)];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results[0]?.daysRemaining).toBe(0);
    expect(results[0]?.status).toBe("danger");
  });

  it("returns danger when days remaining is negative (overstayed)", () => {
    const countries = [makeCountry("jp", 100)];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results[0]?.daysRemaining).toBe(-10);
    expect(results[0]?.status).toBe("danger");
  });

  it("only counts latest stay (first entry per country), not cumulative", () => {
    // Two entries for the same country — newest first (30 days), older (20 days).
    // Only the latest 30-day stay should be counted.
    const countries = [makeCountry("jp", 30), makeCountry("jp", 20)];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results[0]?.usedDays).toBe(30);
    expect(results[0]?.daysRemaining).toBe(60);
    expect(results[0]?.status).toBe("safe");
  });

  it("returns empty array when no limits are set", () => {
    const countries = [makeCountry("jp", 30)];
    const limits: VisaLimit[] = [];

    const results = checkVisaStatus(countries, limits);

    expect(results).toEqual([]);
  });

  it("handles country with limit but no visits — usedDays is 0 and status is safe", () => {
    const countries: CountryItem[] = [];
    const limits = [makeLimit("jp", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      countryCode: "jp",
      usedDays: 0,
      maxDays: 90,
      daysRemaining: 90,
      status: "safe",
    });
  });

  it("processes multiple countries independently", () => {
    const countries = [makeCountry("jp", 10), makeCountry("us", 80)];
    const limits = [makeLimit("jp", 90, 14), makeLimit("us", 90, 14)];

    const results = checkVisaStatus(countries, limits);

    const jp = results.find((r) => r.countryCode === "jp");
    const us = results.find((r) => r.countryCode === "us");

    expect(jp?.status).toBe("safe");
    expect(us?.status).toBe("warning");
  });
});
