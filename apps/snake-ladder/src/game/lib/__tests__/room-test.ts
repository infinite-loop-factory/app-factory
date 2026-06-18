import { describe, expect, it } from "@jest/globals";
import { generateDailyPlacements } from "@/game/lib/daily";
import {
  isValidRoomCode,
  normalizeRoomCode,
  ROOM_CODE_LENGTH,
  randomRoomCode,
  seedFromCode,
} from "@/game/lib/room";

describe("room codes", () => {
  it("treats case and whitespace as the same room", () => {
    expect(seedFromCode("pizza")).toBe(seedFromCode(" PIZZA "));
    expect(normalizeRoomCode("  piz za ")).toBe("PIZZA");
  });

  it("maps different codes to different boards", () => {
    expect(seedFromCode("PIZZA")).not.toBe(seedFromCode("PASTA"));
    expect(generateDailyPlacements(seedFromCode("PIZZA"))).not.toEqual(
      generateDailyPlacements(seedFromCode("PASTA")),
    );
  });

  it("produces a stable board for the same code", () => {
    expect(generateDailyPlacements(seedFromCode("PIZZA"))).toEqual(
      generateDailyPlacements(seedFromCode("pizza")),
    );
  });

  it("validates codes", () => {
    expect(isValidRoomCode("PIZZA")).toBe(true);
    expect(isValidRoomCode("a1")).toBe(true);
    expect(isValidRoomCode("x")).toBe(false);
    expect(isValidRoomCode("   ")).toBe(false);
    expect(isValidRoomCode("뱀사다리")).toBe(false);
  });

  it("generates codes from the unambiguous alphabet", () => {
    for (let i = 0; i < 20; i += 1) {
      const code = randomRoomCode();
      expect(code).toHaveLength(ROOM_CODE_LENGTH);
      expect(code).not.toMatch(/[O0I1]/);
      expect(isValidRoomCode(code)).toBe(true);
    }
  });
});
