import { describe, expect, it } from "@jest/globals";
import { isSetbackMessage } from "@/game/lib/game-screen-helpers";

describe("setback upsell gate", () => {
  it("flags every frustration moment", () => {
    expect(isSetbackMessage("play.snake")).toBe(true);
    expect(isSetbackMessage("play.overshoot")).toBe(true);
    expect(isSetbackMessage("play.overshootDone")).toBe(true);
    expect(isSetbackMessage("play.interference")).toBe(true);
  });

  it("allows neutral and positive moments", () => {
    expect(isSetbackMessage("play.humanRoll")).toBe(false);
    expect(isSetbackMessage("play.moved")).toBe(false);
    expect(isSetbackMessage("play.ladder")).toBe(false);
    expect(isSetbackMessage("play.youWin")).toBe(false);
    expect(isSetbackMessage("")).toBe(false);
  });
});
