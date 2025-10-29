import { describe, expect, it, jest } from "@jest/globals";
import {
  COUNTRY_OPTION_MAP,
  COUNTRY_OPTIONS,
} from "@/features/home/utils/country-options";

// mock dependencies before importing the module under test
jest.mock("@/features/map/utils/country-polygons", () => ({
  getAllCountryPolygons: () => [
    { country_code: "us", name: "United States" },
    { country_code: "FR", name: "France" },
    { country_code: undefined, name: "NoCode" },
    { country_code: "us", name: "Duplicate" },
  ],
}));

jest.mock("@/utils/country-code-to-flag-emoji", () => ({
  countryCodeToFlagEmoji: (code: string) => `flag-${code}`,
}));

describe("country-options", () => {
  it("builds unique country options and sorts by label", () => {
    const codes = COUNTRY_OPTIONS.map((o) => o.code);
    // Labels in our mock are 'France' and 'United States' => France comes first
    expect(codes).toEqual(["FR", "US"]);
  });

  it("populates flags and provides a lookup map", () => {
    const us = COUNTRY_OPTION_MAP.get("US");
    expect(us).toBeDefined();
    expect(us?.flag).toBe("flag-US");
    expect(us?.label).toBe("United States");
  });
});
