import { describe, expect, it } from "@jest/globals";
import { buildShareMessage, GAME_PUBLIC_URL } from "@/lib/share";

describe("share message", () => {
  it("always ends with the public game URL", () => {
    const message = buildShareMessage({
      header: "Daily #162",
      result: "Won in 7 rolls 🏆",
      journey: ["🪜", "🐍", "⚡"],
    });
    expect(message.endsWith(GAME_PUBLIC_URL)).toBe(true);
    expect(message).toContain("Daily #162");
    expect(message).toContain("🪜🐍⚡");
  });

  it("omits the journey line when no events happened", () => {
    const message = buildShareMessage({
      header: "h",
      result: "r",
      journey: [],
    });
    expect(message.split("\n")).toHaveLength(3);
  });

  it("caps the journey at 14 glyphs", () => {
    const message = buildShareMessage({
      header: "h",
      result: "r",
      journey: Array.from({ length: 30 }, () => "🐍"),
    });
    const journeyLine = message.split("\n")[2] ?? "";
    expect([...journeyLine]).toHaveLength(14);
  });
});
