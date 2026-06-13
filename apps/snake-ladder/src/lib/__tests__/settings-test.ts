import { describe, expect, it } from "@jest/globals";
import {
  DEFAULT_SETTINGS,
  parseSettings,
  resolveDisplayName,
} from "@/lib/settings";

describe("parseSettings", () => {
  it("returns defaults for null or malformed JSON", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("{not json")).toEqual(DEFAULT_SETTINGS);
  });

  it("reads back a valid persisted state", () => {
    const state = {
      ...DEFAULT_SETTINGS,
      movementSpeed: "fast" as const,
      theme: "dark" as const,
      soundEnabled: false,
      playerNickname: "Ada",
    };
    expect(parseSettings(JSON.stringify(state))).toEqual(state);
  });

  it("falls back on out-of-range enum values", () => {
    const parsed = parseSettings(
      '{"movementSpeed":"warp","diceSpeed":42,"theme":"neon"}',
    );
    expect(parsed.movementSpeed).toBe(DEFAULT_SETTINGS.movementSpeed);
    expect(parsed.diceSpeed).toBe(DEFAULT_SETTINGS.diceSpeed);
    expect(parsed.theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it("coerces non-boolean toggles to their defaults", () => {
    const parsed = parseSettings('{"soundEnabled":"yes","hapticsEnabled":0}');
    expect(parsed.soundEnabled).toBe(DEFAULT_SETTINGS.soundEnabled);
    expect(parsed.hapticsEnabled).toBe(DEFAULT_SETTINGS.hapticsEnabled);
  });

  it("ignores non-string nicknames", () => {
    const parsed = parseSettings('{"playerNickname":123}');
    expect(parsed.playerNickname).toBe(DEFAULT_SETTINGS.playerNickname);
  });
});

describe("resolveDisplayName", () => {
  it("uses the fallback when the nickname is blank", () => {
    expect(resolveDisplayName("   ", "Computer")).toBe("Computer");
  });

  it("trims and caps the nickname length", () => {
    expect(resolveDisplayName("  Ada  ", "You")).toBe("Ada");
    expect(resolveDisplayName("x".repeat(40), "You")).toHaveLength(16);
  });
});
