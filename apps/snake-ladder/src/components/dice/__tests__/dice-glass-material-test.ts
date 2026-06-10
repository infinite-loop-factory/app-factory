import { describe, expect, it } from "@jest/globals";
import {
  BLUE_GLASS_DICE,
  GOLD_GLASS_DICE,
  resolveDiceMaterial,
} from "@/components/dice/dice-glass-material";

describe("dice glass material", () => {
  it("resolves blue glass for default dice", () => {
    expect(resolveDiceMaterial("default")).toBe(BLUE_GLASS_DICE);
  });

  it("resolves gold glass for gold dice", () => {
    expect(resolveDiceMaterial("gold")).toBe(GOLD_GLASS_DICE);
  });

  it("builds per-face colors", () => {
    expect(BLUE_GLASS_DICE.faceLight(3)).toMatch(/^#/);
    expect(BLUE_GLASS_DICE.faceDark(3)).toMatch(/^#/);
  });
});
