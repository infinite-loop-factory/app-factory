import { describe, expect, it } from "@jest/globals";
import {
  generateLottoNumbers,
  LOTTO_MAX_NUMBER,
  LOTTO_MIN_NUMBER,
  LOTTO_PICK_COUNT,
} from "../lotto";

describe("generateLottoNumbers", () => {
  it("generates six lotto numbers", () => {
    const numbers = generateLottoNumbers();

    expect(numbers).toHaveLength(LOTTO_PICK_COUNT);
  });

  it("keeps every number within the lotto 6/45 range", () => {
    for (let index = 0; index < 100; index += 1) {
      const numbers = generateLottoNumbers();

      expect(
        numbers.every(
          (number) => number >= LOTTO_MIN_NUMBER && number <= LOTTO_MAX_NUMBER,
        ),
      ).toBe(true);
    }
  });

  it("does not repeat numbers in one draw", () => {
    for (let index = 0; index < 100; index += 1) {
      const numbers = generateLottoNumbers();

      expect(new Set(numbers).size).toBe(LOTTO_PICK_COUNT);
    }
  });

  it("keeps draw order instead of sorting the result", () => {
    const randomValues = [0.99, 0, 0.5, 0.1, 0.9, 0.3];
    const numbers = generateLottoNumbers(() => randomValues.shift() ?? 0);

    expect(numbers).toEqual([45, 1, 23, 6, 40, 15]);
    expect(numbers).not.toEqual([...numbers].sort((a, b) => a - b));
  });
});
