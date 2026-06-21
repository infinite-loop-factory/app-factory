import { describe, expect, it } from "@jest/globals";
import {
  formatLottoGames,
  generateLottoGames,
  generateLottoNumbers,
  getDisplayNumbers,
  LOTTO_DISCLAIMER,
  LOTTO_MAX_FIXED_COUNT,
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

describe("generateLottoGames", () => {
  it.each([1, 3, 5] as const)("generates %i lotto games", (count) => {
    const games = generateLottoGames(count);

    expect(games).toHaveLength(count);
    games.forEach((game, index) => {
      expect(game.id).toBe(`game-${index + 1}`);
      expect(game.numbers).toHaveLength(LOTTO_PICK_COUNT);
      expect(new Set(game.numbers).size).toBe(LOTTO_PICK_COUNT);
      expect(
        game.numbers.every(
          (number) => number >= LOTTO_MIN_NUMBER && number <= LOTTO_MAX_NUMBER,
        ),
      ).toBe(true);
    });
  });

  it("keeps each game numbers in draw order", () => {
    const randomValues = [
      0.99, 0, 0.5, 0.1, 0.9, 0.3, 0.2, 0.4, 0.6, 0.8, 0.02, 0.72,
    ];
    const games = generateLottoGames(1, () => randomValues.shift() ?? 0);

    expect(games[0]?.numbers).toEqual([45, 1, 23, 6, 40, 15]);
  });
});

describe("getDisplayNumbers", () => {
  it("returns a copy in draw order mode", () => {
    const numbers = [45, 1, 23, 6, 40, 15];
    const displayNumbers = getDisplayNumbers(numbers, "drawOrder");

    expect(displayNumbers).toEqual(numbers);
    expect(displayNumbers).not.toBe(numbers);
  });

  it("returns sorted numbers without mutating the original numbers", () => {
    const numbers = [45, 1, 23, 6, 40, 15];
    const displayNumbers = getDisplayNumbers(numbers, "sorted");

    expect(displayNumbers).toEqual([1, 6, 15, 23, 40, 45]);
    expect(numbers).toEqual([45, 1, 23, 6, 40, 15]);
  });
});

describe("formatLottoGames", () => {
  const games = [
    { id: "game-1", numbers: [45, 1, 23, 6, 40, 15] },
    { id: "game-2", numbers: [4, 12, 8, 36, 41, 2] },
  ];

  it("formats lotto games in draw order", () => {
    expect(formatLottoGames(games, "drawOrder")).toBe(
      [
        "로또 추천 번호",
        "",
        "1게임: 45 01 23 06 40 15",
        "2게임: 04 12 08 36 41 02",
        "",
        LOTTO_DISCLAIMER,
      ].join("\n"),
    );
  });

  it("formats lotto games in sorted order", () => {
    expect(formatLottoGames(games, "sorted")).toBe(
      [
        "로또 추천 번호",
        "",
        "1게임: 01 06 15 23 40 45",
        "2게임: 02 04 08 12 36 41",
        "",
        LOTTO_DISCLAIMER,
      ].join("\n"),
    );
  });
});

describe("fixed numbers", () => {
  it("always includes the fixed numbers first in draw order", () => {
    const numbers = generateLottoNumbers(() => 0, [7, 14, 21]);

    expect(numbers).toHaveLength(LOTTO_PICK_COUNT);
    expect(numbers.slice(0, 3)).toEqual([7, 14, 21]);
    expect(new Set(numbers).size).toBe(LOTTO_PICK_COUNT);
  });

  it("excludes fixed numbers from the random pool", () => {
    const numbers = generateLottoNumbers(() => 0, [1]);

    expect(numbers).toEqual([1, 2, 3, 4, 5, 6]);
    expect(numbers.slice(1)).not.toContain(1);
  });

  it("clamps the fixed count to the maximum and keeps one random slot", () => {
    const numbers = generateLottoNumbers(() => 0, [1, 2, 3, 4, 5, 6, 7]);

    expect(numbers).toHaveLength(LOTTO_PICK_COUNT);
    expect(numbers.slice(0, LOTTO_MAX_FIXED_COUNT)).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(numbers).size).toBe(LOTTO_PICK_COUNT);
    // Exactly one slot beyond the five fixed numbers is random.
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("ignores out-of-range, non-integer, and duplicate fixed inputs", () => {
    const numbers = generateLottoNumbers(
      () => 0,
      [0, 46, 7, 7, 3.5, -1, Number.NaN],
    );

    expect(numbers).toHaveLength(LOTTO_PICK_COUNT);
    expect(numbers[0]).toBe(7);
    expect(numbers.filter((number) => number === 7)).toHaveLength(1);
    expect(new Set(numbers).size).toBe(LOTTO_PICK_COUNT);
    expect(
      numbers.every(
        (number) => number >= LOTTO_MIN_NUMBER && number <= LOTTO_MAX_NUMBER,
      ),
    ).toBe(true);
  });

  it("includes the fixed numbers in every game of a multi-game draw", () => {
    const games = generateLottoGames(5, Math.random, [9, 18, 27]);

    expect(games).toHaveLength(5);
    games.forEach((game, index) => {
      expect(game.id).toBe(`game-${index + 1}`);
      expect(game.numbers).toHaveLength(LOTTO_PICK_COUNT);
      expect(new Set(game.numbers).size).toBe(LOTTO_PICK_COUNT);
      expect(game.numbers).toEqual(expect.arrayContaining([9, 18, 27]));
    });
  });

  it("terminates with a shrunken dedupe space (five fixed numbers)", () => {
    const games = generateLottoGames(5, Math.random, [1, 2, 3, 4, 5]);

    expect(games).toHaveLength(5);
    games.forEach((game) => {
      expect(game.numbers).toHaveLength(LOTTO_PICK_COUNT);
      expect(new Set(game.numbers).size).toBe(LOTTO_PICK_COUNT);
      expect(game.numbers).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    });
  });

  it("keeps a fixed number in draw order without double counting", () => {
    const numbers = generateLottoNumbers(() => 0, [40]);

    expect(numbers[0]).toBe(40);
    expect(numbers.filter((number) => number === 40)).toHaveLength(1);
    expect(numbers).toHaveLength(LOTTO_PICK_COUNT);
  });
});
