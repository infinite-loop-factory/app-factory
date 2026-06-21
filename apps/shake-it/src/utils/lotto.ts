export const LOTTO_MIN_NUMBER = 1;
export const LOTTO_MAX_NUMBER = 45;
export const LOTTO_PICK_COUNT = 6;
export const LOTTO_DISCLAIMER = "무작위 추천이며 당첨을 보장하지 않아요.";
export const LOTTO_GAME_COUNTS = [1, 3, 5] as const;
export const LOTTO_DUPLICATE_RETRY_LIMIT = 20;

export type LottoGameCount = (typeof LOTTO_GAME_COUNTS)[number];
export type LottoDisplayMode = "drawOrder" | "sorted";

export type LottoGame = {
  id: string;
  numbers: number[];
};

export function generateLottoNumbers(random = Math.random) {
  const pool = Array.from(
    { length: LOTTO_MAX_NUMBER },
    (_, index) => index + LOTTO_MIN_NUMBER,
  );
  const pickedNumbers: number[] = [];

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
): LottoGame[] {
  const games: LottoGame[] = [];
  const usedCombinationKeys = new Set<string>();

  while (games.length < count) {
    let retryCount = 0;
    let numbers = generateLottoNumbers(random);
    let combinationKey = createCombinationKey(numbers);

    while (
      usedCombinationKeys.has(combinationKey) &&
      retryCount < LOTTO_DUPLICATE_RETRY_LIMIT
    ) {
      retryCount += 1;
      numbers = generateLottoNumbers(random);
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
