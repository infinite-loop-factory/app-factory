import { describe, expect, it } from "@jest/globals";
import {
  addAlphaToColor,
  calculateLongitudeDifference,
  DEFAULT_ALPHA_COLOR,
  hexToRgb,
  normalizeLongitude,
} from "@/features/map/utils/globe-helpers";

describe("hexToRgb", () => {
  it("converts six-digit hex codes", () => {
    expect(hexToRgb("#336699")).toEqual([51, 102, 153]);
  });

  it("expands and converts three-digit hex codes", () => {
    expect(hexToRgb("#fa3")).toEqual([255, 170, 51]);
  });

  it("returns null for invalid hex strings", () => {
    expect(hexToRgb("#12")).toBeNull();
    expect(hexToRgb("invalid")).toBeNull();
  });
});

describe("addAlphaToColor", () => {
  it("adds alpha to hex colors", () => {
    expect(addAlphaToColor("#ff8800", 0.5)).toBe("rgba(255, 136, 0, 0.5)");
  });

  it("replaces the alpha channel on rgba inputs", () => {
    expect(addAlphaToColor("rgba(10, 20, 30, 1)", 0.25)).toBe(
      "rgba(10, 20, 30, 0.25)",
    );
  });

  it("converts rgb strings to rgba", () => {
    expect(addAlphaToColor("rgb(10, 20, 30)", 0.75)).toBe(
      "rgba(10, 20, 30, 0.75)",
    );
  });

  it("returns the fallback color for unsupported strings", () => {
    expect(addAlphaToColor("not-a-color", 0.4)).toBe(DEFAULT_ALPHA_COLOR);
    expect(addAlphaToColor(undefined, 0.4, "rgba(1, 2, 3, 0.4)")).toBe(
      "rgba(1, 2, 3, 0.4)",
    );
  });
});

describe("normalizeLongitude", () => {
  it("keeps longitudes within -180 to 180", () => {
    expect(normalizeLongitude(190)).toBe(-170);
    expect(normalizeLongitude(-200)).toBe(160);
    expect(normalizeLongitude(45)).toBe(45);
  });
});

describe("calculateLongitudeDifference", () => {
  it("returns direct differences under 180 degrees", () => {
    expect(calculateLongitudeDifference(10, 20)).toBe(10);
    expect(calculateLongitudeDifference(-30, -10)).toBe(20);
  });

  it("wraps around the globe when shorter", () => {
    expect(calculateLongitudeDifference(-170, 170)).toBe(-20);
    expect(calculateLongitudeDifference(170, -170)).toBe(20);
  });
});
