import { describe, expect, it } from "@jest/globals";
import { TOTAL_CELLS } from "@/game/constants/board";
import {
  isWinningCell,
  otherPlayer,
  winMessage,
} from "@/game/lib/game-helpers";

describe("otherPlayer", () => {
  it("toggles between the two players", () => {
    expect(otherPlayer(0)).toBe(1);
    expect(otherPlayer(1)).toBe(0);
  });
});

describe("isWinningCell", () => {
  it("is true at and beyond the final cell", () => {
    expect(isWinningCell(TOTAL_CELLS)).toBe(true);
    expect(isWinningCell(TOTAL_CELLS + 1)).toBe(true);
  });

  it("is false before the final cell", () => {
    expect(isWinningCell(TOTAL_CELLS - 1)).toBe(false);
    expect(isWinningCell(1)).toBe(false);
  });
});

describe("winMessage", () => {
  it("speaks from the human player's point of view", () => {
    expect(winMessage(0)).toBe("play.youWin");
    expect(winMessage(1)).toBe("play.opponentWin");
  });
});
