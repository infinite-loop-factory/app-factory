import { describe, expect, it, jest } from "@jest/globals";
import {
  buildInsertPayload,
  filterDuplicateDates,
} from "@/features/home/utils/payload-builder";

jest.mock("@/utils/date-range", () => ({
  toUtcBoundaryTimestamp: (date: string, zoneName: string, pos: string) =>
    `utc-${date}-${zoneName}-${pos}`,
}));

describe("filterDuplicateDates", () => {
  it("filters out dates that match the existing country code", () => {
    const dates = ["2024-01-01", "2024-01-02", "2024-01-03"];
    const existing = new Map<string, string>([
      ["2024-01-01", "FR"],
      ["2024-01-02", "US"],
    ]);
    const filtered = filterDuplicateDates(dates, "FR", existing);
    expect(filtered).toEqual(["2024-01-02", "2024-01-03"]);
  });
});

describe("buildInsertPayload", () => {
  it("maps dates to insert payload objects", () => {
    const payload = buildInsertPayload({
      dates: ["2024-01-01"],
      referenceCoords: { latitude: 10, longitude: 20 },
      userId: "user-1",
      countryCode: "FR",
      displayCountry: "France",
      zoneName: "Europe/Paris",
    });

    expect(payload).toHaveLength(1);
    expect(payload[0]).toMatchObject({
      user_id: "user-1",
      latitude: 10,
      longitude: 20,
      country: "France",
      country_code: "FR",
    });
    expect(payload[0]?.timestamp).toBe("utc-2024-01-01-Europe/Paris-start");
  });
});
