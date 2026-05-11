import type { CountryYearSummary } from "@/features/map/types/map-summary";

import { describe, expect, it } from "@jest/globals";
import { buildWidgetSnapshot } from "@/features/widget/utils/build-snapshot";

function makeSummary(
  overrides: Partial<CountryYearSummary> & { countryCode: string },
): CountryYearSummary {
  return {
    country: overrides.country ?? overrides.countryCode,
    countryCode: overrides.countryCode,
    flag: overrides.flag ?? "",
    totalDays: overrides.totalDays ?? 0,
    visitCount: overrides.visitCount ?? 1,
    latestVisit: overrides.latestVisit ?? null,
    ranges: overrides.ranges ?? [],
  };
}

describe("buildWidgetSnapshot", () => {
  it("빈 배열 → totalCountries=0, totalDays=0, recent=[]", () => {
    const result = buildWidgetSnapshot([]);

    expect(result.totalCountries).toBe(0);
    expect(result.totalDays).toBe(0);
    expect(result.recent).toEqual([]);
  });

  it("단일 국가 → totals 반영, recent.length=1", () => {
    const summaries = [
      makeSummary({
        countryCode: "KR",
        country: "Korea",
        totalDays: 30,
        latestVisit: "2024-01-15",
      }),
    ];

    const result = buildWidgetSnapshot(summaries);

    expect(result.totalCountries).toBe(1);
    expect(result.totalDays).toBe(30);
    expect(result.recent).toHaveLength(1);
    expect(result.recent[0]?.code).toBe("KR");
  });

  it("정확히 3개 국가 → 모두 포함", () => {
    const summaries = [
      makeSummary({
        countryCode: "JP",
        country: "Japan",
        totalDays: 10,
        latestVisit: "2024-03-01",
      }),
      makeSummary({
        countryCode: "FR",
        country: "France",
        totalDays: 7,
        latestVisit: "2024-02-01",
      }),
      makeSummary({
        countryCode: "DE",
        country: "Germany",
        totalDays: 5,
        latestVisit: "2024-01-01",
      }),
    ];

    const result = buildWidgetSnapshot(summaries);

    expect(result.totalCountries).toBe(3);
    expect(result.recent).toHaveLength(3);
  });

  it("5개 국가 → latestVisit DESC top 3만 포함", () => {
    const summaries = [
      makeSummary({
        countryCode: "JP",
        totalDays: 10,
        latestVisit: "2024-05-01",
      }),
      makeSummary({
        countryCode: "FR",
        totalDays: 7,
        latestVisit: "2024-04-01",
      }),
      makeSummary({
        countryCode: "DE",
        totalDays: 5,
        latestVisit: "2024-03-01",
      }),
      makeSummary({
        countryCode: "IT",
        totalDays: 3,
        latestVisit: "2024-02-01",
      }),
      makeSummary({
        countryCode: "ES",
        totalDays: 2,
        latestVisit: "2024-01-01",
      }),
    ];

    const result = buildWidgetSnapshot(summaries);

    expect(result.totalCountries).toBe(5);
    expect(result.recent).toHaveLength(3);
    expect(result.recent[0]?.code).toBe("JP");
    expect(result.recent[1]?.code).toBe("FR");
    expect(result.recent[2]?.code).toBe("DE");
  });

  it("latestVisit null/undefined 케이스 → 배열 끝으로 정렬", () => {
    const summaries = [
      makeSummary({
        countryCode: "JP",
        totalDays: 10,
        latestVisit: "2024-05-01",
      }),
      makeSummary({
        countryCode: "FR",
        totalDays: 7,
        latestVisit: "2024-04-01",
      }),
      makeSummary({ countryCode: "DE", totalDays: 5, latestVisit: null }),
      makeSummary({
        countryCode: "IT",
        totalDays: 3,
        latestVisit: "2024-03-01",
      }),
    ];

    const result = buildWidgetSnapshot(summaries);

    expect(result.recent).toHaveLength(3);
    // null latestVisit는 끝으로 밀려나야 함
    const codes = result.recent.map((r) => r.code);
    expect(codes).not.toContain("DE");
    expect(codes[0]).toBe("JP");
    expect(codes[1]).toBe("FR");
    expect(codes[2]).toBe("IT");
  });

  it("flag/name 매핑 검증 (JP → 🇯🇵 / Japan)", () => {
    const summaries = [
      makeSummary({
        countryCode: "JP",
        country: "Japan",
        totalDays: 5,
        latestVisit: "2024-01-01",
      }),
    ];

    const result = buildWidgetSnapshot(summaries);

    expect(result.recent[0]?.flag).toBe("🇯🇵");
    expect(result.recent[0]?.name).toBe("Japan");
    expect(result.recent[0]?.code).toBe("JP");
  });

  it("country가 없으면 countryCode를 name으로 사용", () => {
    const summaries = [
      makeSummary({
        countryCode: "XX",
        country: "",
        totalDays: 1,
        latestVisit: "2024-01-01",
      }),
    ];

    const result = buildWidgetSnapshot(summaries);

    expect(result.recent[0]?.name).toBe("XX");
  });

  it("updatedAt이 유효한 ISO 8601 문자열", () => {
    const before = new Date().toISOString();
    const result = buildWidgetSnapshot([]);
    const after = new Date().toISOString();

    expect(result.updatedAt).toBeDefined();
    expect(result.updatedAt >= before).toBe(true);
    expect(result.updatedAt <= after).toBe(true);
  });
});
