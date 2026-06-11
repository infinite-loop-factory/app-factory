/** Public web build — gives shared results a destination (organic loop). */
export const GAME_PUBLIC_URL =
  "https://infinite-loop-factory.github.io/app-factory/snake-ladder";

type ShareParts = {
  /** Localized header line, e.g. "Quantum Snake & Ladder — Daily #162". */
  header: string;
  /** Localized result line, e.g. "Won in 7 rolls 🏆". */
  result: string;
  /** Emoji journey collected from real board events (🪜🐍⚡). */
  journey: string[];
};

const MAX_JOURNEY_GLYPHS = 14;

/** Wordle-style share text: header, result, emoji journey, then the link. */
export function buildShareMessage({
  header,
  result,
  journey,
}: ShareParts): string {
  const trail = journey.slice(0, MAX_JOURNEY_GLYPHS).join("");
  return [header, result, trail, GAME_PUBLIC_URL]
    .filter((line) => line.length > 0)
    .join("\n");
}
