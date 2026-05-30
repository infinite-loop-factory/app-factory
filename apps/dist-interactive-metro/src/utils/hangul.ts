/**
 * Extracts Choseong (initial consonants) from a Korean string.
 * e.g., "강남역" -> "ㄱㄴㅇ", "서울" -> "ㅅㅇ"
 */
export function getChoseong(str: string): string {
  const CHOSEONG = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code > -1 && code < 11172) {
      result += CHOSEONG[Math.floor(code / 588)];
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

/**
 * Checks if a search term matches a target string using Choseong logic.
 * Ensures the match starts from the beginning of the target string.
 */
export function matchChoseong(target: string, search: string): boolean {
  const targetChoseong = getChoseong(target);
  const searchChoseong = getChoseong(search);
  return targetChoseong.startsWith(searchChoseong);
}
