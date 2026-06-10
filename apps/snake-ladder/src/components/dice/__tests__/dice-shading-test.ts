import { describe, expect, it } from "@jest/globals";
import { faceGradient, mixHex } from "@/components/dice/dice-shading";

describe("dice shading", () => {
  it("darkens hex colors with factor below 1", () => {
    expect(mixHex("#ffffff", 0.5)).toBe("#808080");
  });

  it("builds a gradient string for each face", () => {
    const gradient = faceGradient("#f0e4d0", 1);
    expect(gradient).toContain("linear-gradient");
    expect(gradient).toContain("#");
  });
});
