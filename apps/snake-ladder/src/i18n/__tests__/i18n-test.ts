import { describe, expect, it } from "@jest/globals";
import i18n from "@/i18n";

describe("i18n", () => {
  it("resolves nested locale keys", () => {
    i18n.locale = "en";
    expect(i18n.t("home.title")).toBe("Snake & Ladder");
    expect(i18n.t("game.goldDice.balance", { count: 9 })).toBe("Gold dice: 9");
  });

  it("serves Korean copy when locale is ko", () => {
    i18n.locale = "ko";
    expect(i18n.t("home.play")).toBe("새 게임");
  });
});
