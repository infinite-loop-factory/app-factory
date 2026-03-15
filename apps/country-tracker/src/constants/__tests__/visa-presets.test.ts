import { describe, expect, it } from "@jest/globals";
import { getVisaPreset } from "@/constants/visa-presets";

describe("getVisaPreset", () => {
  it("returns 90 for KR nationality traveling to JP", () => {
    expect(getVisaPreset("KR", "JP")).toBe(90);
  });

  it("returns 180 for KR nationality traveling to CA", () => {
    expect(getVisaPreset("KR", "CA")).toBe(180);
  });

  it("returns undefined for an unknown nationality", () => {
    expect(getVisaPreset("ZZ", "JP")).toBeUndefined();
  });

  it("returns undefined for a known nationality with an unknown destination", () => {
    expect(getVisaPreset("KR", "ZZ")).toBeUndefined();
  });

  it("is case-insensitive for nationality (lowercase input)", () => {
    expect(getVisaPreset("kr", "JP")).toBe(90);
  });

  it("is case-insensitive for destination (lowercase input)", () => {
    expect(getVisaPreset("KR", "jp")).toBe(90);
  });

  it("is case-insensitive for both inputs", () => {
    expect(getVisaPreset("kr", "jp")).toBe(90);
  });

  it("returns 90 for JP nationality traveling to KR", () => {
    expect(getVisaPreset("JP", "KR")).toBe(90);
  });

  it("returns 180 for US nationality traveling to MX", () => {
    expect(getVisaPreset("US", "MX")).toBe(180);
  });
});
