import i18n from "@/i18n";

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

type ResultShareParts = {
  header: string;
  won: boolean;
  rolls: number;
  /** > 1 marks a retry on the same board. */
  attempts: number;
  /** > 1 adds the streak line. */
  streak: number;
  journey: string[];
};

/** Full localized result message: header(+streak), result(+try), journey, link. */
export function buildResultShareMessage(parts: ResultShareParts): string {
  const tryNote =
    parts.attempts > 1 ? i18n.t("share.tryCount", { n: parts.attempts }) : "";
  const result = `${i18n.t(parts.won ? "share.win" : "share.lose", {
    count: parts.rolls,
  })}${tryNote}`;
  const streakLine =
    parts.streak > 1 ? i18n.t("share.streak", { count: parts.streak }) : "";
  return buildShareMessage({
    header: streakLine ? `${parts.header}\n${streakLine}` : parts.header,
    result,
    journey: parts.journey,
  });
}
