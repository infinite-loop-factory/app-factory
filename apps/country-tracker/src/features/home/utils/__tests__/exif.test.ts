import { describe, expect, it } from "@jest/globals";
import {
  extractCoordinatesFromExif,
  extractIsoDateFromExif,
} from "@/features/home/utils/exif";

describe("extractCoordinatesFromExif", () => {
  it("converts DMS arrays with refs", () => {
    const coords = extractCoordinatesFromExif({
      GPSLatitude: [37, 30, 0],
      GPSLatitudeRef: "N",
      GPSLongitude: [122, 0, 0],
      GPSLongitudeRef: "W",
    });
    expect(coords).toEqual({ latitude: 37.5, longitude: -122 });
  });

  it("returns null when missing data", () => {
    expect(extractCoordinatesFromExif({})).toBeNull();
  });
});

describe("extractIsoDateFromExif", () => {
  it("parses colon formatted timestamps", () => {
    expect(
      extractIsoDateFromExif({
        DateTimeOriginal: "2024:01:20 12:34:56",
      }),
    ).toBe("2024-01-20");
  });

  it("handles ISO strings", () => {
    expect(
      extractIsoDateFromExif({
        DateTime: "2024-05-01",
      }),
    ).toBe("2024-05-01");
  });

  it("returns null for invalid values", () => {
    expect(
      extractIsoDateFromExif({ DateTimeOriginal: "not-a-date" }),
    ).toBeNull();
  });
});
