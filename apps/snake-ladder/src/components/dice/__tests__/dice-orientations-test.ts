import { describe, expect, it } from "@jest/globals";
import {
  FACE_ROTATIONS,
  normalizeDegrees,
  settleRotation,
} from "@/components/dice/dice-orientations";

describe("dice orientations", () => {
  it("maps each face to a distinct rotation target", () => {
    const keys = Object.values(FACE_ROTATIONS).map(
      (r) => `${r.rotateX}:${r.rotateY}`,
    );
    expect(new Set(keys).size).toBe(6);
  });

  it("normalizes degrees into 0..360", () => {
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeDegrees(720)).toBe(0);
  });

  it("settles forward with extra full spins", () => {
    const next = settleRotation(10, 0, 2);
    expect(next).toBeGreaterThanOrEqual(710);
    expect(normalizeDegrees(next)).toBe(0);
  });
});
