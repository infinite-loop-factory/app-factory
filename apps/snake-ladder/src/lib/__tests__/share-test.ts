import { describe, expect, it } from "@jest/globals";
import {
  buildResultShareMessage,
  buildShareMessage,
  GAME_PUBLIC_URL,
  journeyLine,
} from "@/lib/share";

describe("share message", () => {
  it("always ends with the public game URL", () => {
    const message = buildShareMessage({
      header: "Daily #162",
      result: "Won in 7 rolls",
      journey: "Ladders 2 · Snakes 1",
    });
    expect(message.endsWith(GAME_PUBLIC_URL)).toBe(true);
    expect(message).toContain("Daily #162");
    expect(message).toContain("Ladders 2 · Snakes 1");
  });

  it("omits the journey line when no events happened", () => {
    const message = buildShareMessage({
      header: "h",
      result: "r",
      journey: "",
    });
    expect(message.split("\n")).toHaveLength(3);
  });

  it("summarizes the journey without emojis", () => {
    expect(journeyLine({ ladders: 2, snakes: 1, tunnels: 0 })).toBe(
      "Ladders 2 · Snakes 1",
    );
    expect(journeyLine({ ladders: 0, snakes: 0, tunnels: 0 })).toBe("");
    expect(journeyLine({ ladders: 0, snakes: 0, tunnels: 3 })).toBe(
      "Tunnels 3",
    );
  });

  it("builds a full plain-text result message", () => {
    const message = buildResultShareMessage({
      header: "Quantum Snake & Ladder — Daily #162",
      won: true,
      rolls: 7,
      attempts: 2,
      streak: 3,
      journey: { ladders: 1, snakes: 1, tunnels: 1 },
    });
    expect(message).toContain("Won in 7 rolls");
    expect(message).toContain("try 2");
    expect(message).toContain("3-day streak");
    expect(message).toContain("Tunnels 1");
    // no emoji anywhere
    expect(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(message)).toBe(false);
  });
});
