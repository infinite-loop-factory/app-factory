import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

import { buildWidgetData } from "@/utils/widget-bridge";

describe("buildWidgetData", () => {
  it("builds correct data when all params are provided", () => {
    const recentCountries = [
      { country: "Japan", countryCode: "JP", flag: "🇯🇵" },
      { country: "France", countryCode: "FR", flag: "🇫🇷" },
    ];

    const result = buildWidgetData({
      countriesVisited: 10,
      currentCountry: "Japan",
      currentCountryCode: "JP",
      recentCountries,
    });

    expect(result.countriesVisited).toBe(10);
    expect(result.currentCountry).toBe("Japan");
    expect(result.currentCountryCode).toBe("JP");
    expect(result.recentCountries).toEqual(recentCountries);
  });

  it("defaults currentCountry to empty string when not provided", () => {
    const result = buildWidgetData({ countriesVisited: 5 });

    expect(result.currentCountry).toBe("");
  });

  it("defaults currentCountryCode to empty string when not provided", () => {
    const result = buildWidgetData({ countriesVisited: 5 });

    expect(result.currentCountryCode).toBe("");
  });

  it("defaults recentCountries to empty array when not provided", () => {
    const result = buildWidgetData({ countriesVisited: 5 });

    expect(result.recentCountries).toEqual([]);
  });

  it("limits recentCountries to at most 3 entries", () => {
    const recentCountries = [
      { country: "Japan", countryCode: "JP", flag: "🇯🇵" },
      { country: "France", countryCode: "FR", flag: "🇫🇷" },
      { country: "Germany", countryCode: "DE", flag: "🇩🇪" },
      { country: "Italy", countryCode: "IT", flag: "🇮🇹" },
    ];

    const result = buildWidgetData({
      countriesVisited: 4,
      recentCountries,
    });

    expect(result.recentCountries).toHaveLength(3);
    expect(result.recentCountries[0]?.countryCode).toBe("JP");
    expect(result.recentCountries[2]?.countryCode).toBe("DE");
  });

  it("includes lastUpdated as a valid ISO 8601 string", () => {
    const before = new Date().toISOString();
    const result = buildWidgetData({ countriesVisited: 1 });
    const after = new Date().toISOString();

    expect(result.lastUpdated).toBeDefined();
    expect(result.lastUpdated >= before).toBe(true);
    expect(result.lastUpdated <= after).toBe(true);
  });

  it("passes through exactly 3 recentCountries unchanged when provided 3", () => {
    const recentCountries = [
      { country: "Japan", countryCode: "JP", flag: "🇯🇵" },
      { country: "France", countryCode: "FR", flag: "🇫🇷" },
      { country: "Germany", countryCode: "DE", flag: "🇩🇪" },
    ];

    const result = buildWidgetData({
      countriesVisited: 3,
      recentCountries,
    });

    expect(result.recentCountries).toHaveLength(3);
    expect(result.recentCountries).toEqual(recentCountries);
  });
});
