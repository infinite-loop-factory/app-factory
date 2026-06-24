export const LOTTO_MIN_NUMBER = 1;
export const LOTTO_MAX_NUMBER = 45;
export const LOTTO_PICK_COUNT = 6;
export const LOTTO_DISCLAIMER = "무작위 추천이며 당첨을 보장하지 않아요.";
export const LOTTO_GAME_COUNTS = [1, 3, 5] as const;
export const LOTTO_DUPLICATE_RETRY_LIMIT = 20;
// 고정 번호 최대 개수 - 최소 1개는 무작위 슬롯으로 남긴다.
export const LOTTO_MAX_FIXED_COUNT = LOTTO_PICK_COUNT - 1;

export type LottoGameCount = (typeof LOTTO_GAME_COUNTS)[number];
export type LottoDisplayMode = "drawOrder" | "sorted";

export type LottoGame = {
  id: string;
  numbers: number[];
};

export function sanitizeFixedNumbers(fixedNumbers: number[]): number[] {
  const sanitized: number[] = [];
  const seen = new Set<number>();

  for (const value of fixedNumbers) {
    if (
      !Number.isInteger(value) ||
      value < LOTTO_MIN_NUMBER ||
      value > LOTTO_MAX_NUMBER ||
      seen.has(value)
    ) {
      continue;
    }

    seen.add(value);
    sanitized.push(value);

    if (sanitized.length >= LOTTO_MAX_FIXED_COUNT) {
      break;
    }
  }

  return sanitized;
}

export function generateLottoNumbers(
  random = Math.random,
  fixedNumbers: number[] = [],
) {
  const fixed = sanitizeFixedNumbers(fixedNumbers);
  const fixedSet = new Set(fixed);
  const pool = Array.from(
    { length: LOTTO_MAX_NUMBER },
    (_, index) => index + LOTTO_MIN_NUMBER,
  ).filter((number) => !fixedSet.has(number));
  const pickedNumbers: number[] = [...fixed];

  while (pickedNumbers.length < LOTTO_PICK_COUNT) {
    const pickedIndex = Math.min(
      pool.length - 1,
      Math.max(0, Math.floor(random() * pool.length)),
    );
    const [pickedNumber] = pool.splice(pickedIndex, 1);

    if (pickedNumber) {
      pickedNumbers.push(pickedNumber);
    }
  }

  return pickedNumbers;
}

function createCombinationKey(numbers: number[]) {
  return [...numbers].sort((a, b) => a - b).join("-");
}

export function generateLottoGames(
  count: LottoGameCount,
  random = Math.random,
  fixedNumbers: number[] = [],
): LottoGame[] {
  const games: LottoGame[] = [];
  const usedCombinationKeys = new Set<string>();
  const fixed = sanitizeFixedNumbers(fixedNumbers);

  while (games.length < count) {
    let retryCount = 0;
    let numbers = generateLottoNumbers(random, fixed);
    let combinationKey = createCombinationKey(numbers);

    while (
      usedCombinationKeys.has(combinationKey) &&
      retryCount < LOTTO_DUPLICATE_RETRY_LIMIT
    ) {
      retryCount += 1;
      numbers = generateLottoNumbers(random, fixed);
      combinationKey = createCombinationKey(numbers);
    }

    usedCombinationKeys.add(combinationKey);
    games.push({
      id: `game-${games.length + 1}`,
      numbers,
    });
  }

  return games;
}

export function getDisplayNumbers(
  numbers: number[],
  displayMode: LottoDisplayMode,
) {
  if (displayMode === "sorted") {
    return [...numbers].sort((a, b) => a - b);
  }

  return [...numbers];
}

export function formatLottoNumber(number: number) {
  return String(number).padStart(2, "0");
}

export function formatLottoGames(
  games: LottoGame[],
  displayMode: LottoDisplayMode,
) {
  const gameLines = games.map((game, index) => {
    const numbers = getDisplayNumbers(game.numbers, displayMode)
      .map(formatLottoNumber)
      .join(" ");

    return `${index + 1}게임: ${numbers}`;
  });

  return ["로또 추천 번호", "", ...gameLines, "", LOTTO_DISCLAIMER].join("\n");
}
