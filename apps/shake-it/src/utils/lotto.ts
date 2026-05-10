export const LOTTO_MIN_NUMBER = 1;
export const LOTTO_MAX_NUMBER = 45;
export const LOTTO_PICK_COUNT = 6;

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
