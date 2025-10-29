import { describe, expect, it, jest } from "@jest/globals";
import { resolveCountryFromCoordinates } from "@/features/home/utils/resolve-country";

jest.mock("@/utils/reverse-geo", () => ({
  getCountryByLatLng: async () => ({ country: "France", countryCode: "FR" }),
}));

jest.mock("@/features/map/utils/country-polygons", () => ({
  normalizeCountryCode: (code: string | undefined) =>
    code ? code.toUpperCase() : null,
}));

describe("resolveCountryFromCoordinates", () => {
  it("returns normalized code and country when reverse geo returns values", async () => {
    const res = await resolveCountryFromCoordinates({
      latitude: 48.8566,
      longitude: 2.3522,
    });
    expect(res.normalizedCode).toBe("FR");
    expect(res.country).toBe("France");
  });
});
