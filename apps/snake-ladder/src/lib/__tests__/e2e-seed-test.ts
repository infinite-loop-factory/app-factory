import { describe, expect, it } from "@jest/globals";
import {
  E2E_MONETIZATION,
  E2E_SETTINGS,
  e2eGoldDiceCount,
  isE2E,
} from "@/lib/e2e-seed";

describe("e2e seed", () => {
  it("is disabled by default in unit tests", () => {
    expect(isE2E()).toBe(false);
  });

  it("defaults gold dice count to 10", () => {
    expect(e2eGoldDiceCount()).toBe(10);
  });

  it("seeds fast motion settings for shorter Maestro runs", () => {
    expect(E2E_SETTINGS.movementSpeed).toBe("fast");
    expect(E2E_SETTINGS.diceSpeed).toBe("fast");
  });

  it("seeds monetization gold balance", () => {
    expect(E2E_MONETIZATION.goldDiceCount).toBe(10);
  });
});
