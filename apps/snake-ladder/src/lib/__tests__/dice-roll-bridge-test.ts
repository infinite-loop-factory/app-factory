import { describe, expect, it } from "@jest/globals";
import {
  cancelDiceAnimation,
  resolveDiceAnimation,
  waitForDiceAnimation,
} from "@/lib/dice-roll-bridge";

describe("dice roll bridge", () => {
  it("resolves animation with physics value", async () => {
    const pending = waitForDiceAnimation(500);
    resolveDiceAnimation(4);
    await expect(pending).resolves.toBe(4);
  });

  it("cancels pending animation", async () => {
    const pending = waitForDiceAnimation(5000);
    cancelDiceAnimation();
    await expect(pending).rejects.toThrow("dice animation cancelled");
  });
});
