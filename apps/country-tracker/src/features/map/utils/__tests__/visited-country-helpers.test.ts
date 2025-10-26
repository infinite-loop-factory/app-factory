import type { LocationRecord } from "@/features/map/utils/visited-country-helpers";

import { describe, expect, it } from "@jest/globals";
import { DateTime } from "luxon";
import {
  buildCountryItemsFromLocations,
  groupConsecutiveDatesToItems,
  groupDatesByCountry,
} from "@/features/map/utils/visited-country-helpers";

const zone = DateTime.local().zoneName;

describe("visited-country-helpers", () => {
  describe("groupDatesByCountry", () => {
    it("groups timestamps by country and converts to local dates", () => {
      const locations: LocationRecord[] = [
        {
          country: "France",
          country_code: "FR",
          timestamp: "2024-01-01T05:00:00Z",
        },
        {
          country: "France",
          country_code: "FR",
          timestamp: "2024-01-02T05:00:00Z",
        },
        {
          country: "Japan",
          country_code: "JP",
          timestamp: "2024-01-05T12:00:00Z",
        },
      ];

      const grouped = groupDatesByCountry(locations, "UTC");
      expect(grouped.get("FR")).toEqual({
        country: "France",
        countryCode: "FR",
        dates: ["2024-01-01", "2024-01-02"],
      });
      expect(grouped.get("JP")).toEqual({
        country: "Japan",
        countryCode: "JP",
        dates: ["2024-01-05"],
      });
    });
  });

  describe("groupConsecutiveDatesToItems", () => {
    it("merges consecutive dates into single stay entries", () => {
      const items = groupConsecutiveDatesToItems("France", "FR", [
        "2024-01-01",
        "2024-01-02",
        "2024-01-04",
      ]);

      expect(items).toHaveLength(2);
      const [first, second] = items;
      if (!(first && second)) {
        throw new Error("Expected two grouped items");
      }
      expect(first).toMatchObject({
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        stayDays: 2,
      });
      expect(second).toMatchObject({
        startDate: "2024-01-04",
        endDate: "2024-01-04",
        stayDays: 1,
      });
    });

    it("ignores duplicate dates before grouping", () => {
      const items = groupConsecutiveDatesToItems("France", "FR", [
        "2024-01-01",
        "2024-01-01",
        "2024-01-02",
      ]);
      expect(items).toHaveLength(1);
      expect(items[0]?.stayDays).toBe(2);
    });
  });

  describe("buildCountryItemsFromLocations", () => {
    it("generates sorted country items from raw locations", () => {
      const locations: LocationRecord[] = [
        {
          country: "France",
          country_code: "FR",
          timestamp: "2024-01-02T00:00:00Z",
        },
        {
          country: "France",
          country_code: "FR",
          timestamp: "2024-01-01T00:00:00Z",
        },
        {
          country: "Japan",
          country_code: "JP",
          timestamp: "2024-02-10T00:00:00Z",
        },
      ];

      const items = buildCountryItemsFromLocations(locations, zone);
      expect(items).toHaveLength(2);
      // biome-ignore lint/style/noNonNullAssertion: test
      expect(items[0]!.country).toBe("Japan");
      expect(items[1]?.country).toBe("France");
    });
  });

  it("collapses locations that share the same country code but different names", () => {
    const locations: LocationRecord[] = [
      {
        country: "Republic of Korea",
        country_code: "KR",
        timestamp: "2024-03-01T00:00:00Z",
      },
      {
        country: "South Korea",
        country_code: "KR",
        timestamp: "2024-03-02T00:00:00Z",
      },
      {
        country: "대한민국",
        country_code: "kr",
        timestamp: "2024-03-04T00:00:00Z",
      },
    ];

    const items = buildCountryItemsFromLocations(locations, "UTC");

    expect(items).toHaveLength(2);
    expect(new Set(items.map((item) => item.country_code))).toEqual(
      new Set(["KR"]),
    );
    const allDates = items.flatMap((item) => item.dateSet).sort();
    expect(allDates).toEqual(["2024-03-01", "2024-03-02", "2024-03-04"]);
  });

  it("falls back to ISO code when country name is missing", () => {
    const locations: LocationRecord[] = [
      {
        country: "",
        country_code: "FR",
        timestamp: "2024-07-01T00:00:00Z",
      },
    ];

    const items = buildCountryItemsFromLocations(locations, "UTC");
    expect(items).toHaveLength(1);
    const [item] = items;
    expect(item?.country).toBe("FR");
    expect(item?.country_code).toBe("FR");
  });

  it("keeps the provided ISO code when it doubles as name", () => {
    const locations: LocationRecord[] = [
      {
        country: "US",
        country_code: "US",
        timestamp: "2024-08-01T00:00:00Z",
      },
    ];

    const [item] = buildCountryItemsFromLocations(locations, "UTC");

    expect(item?.country).toBe("US");
    expect(item?.country_code).toBe("US");
  });
});
