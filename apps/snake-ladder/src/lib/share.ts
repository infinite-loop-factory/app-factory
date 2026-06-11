import i18n from "@/i18n";

/** Public web build — gives shared results a destination (organic loop). */
export const GAME_PUBLIC_URL =
  "https://infinite-loop-factory.github.io/app-factory/snake-ladder";

export type JourneyCounts = {
  ladders: number;
  snakes: number;
  tunnels: number;
};

export const EMPTY_JOURNEY: JourneyCounts = {
  ladders: 0,
  snakes: 0,
  tunnels: 0,
};

/** "Ladders 2 · Snakes 1 · Tunnels 1" — only non-zero events, no emoji. */
export function journeyLine(counts: JourneyCounts): string {
  const parts: string[] = [];
  if (counts.ladders > 0) {
    parts.push(i18n.t("share.ladders", { n: counts.ladders }));
  }
  if (counts.snakes > 0) {
    parts.push(i18n.t("share.snakes", { n: counts.snakes }));
  }
  if (counts.tunnels > 0) {
    parts.push(i18n.t("share.tunnels", { n: counts.tunnels }));
  }
  return parts.join(" · ");
}

type ShareParts = {
  /** Localized header line, e.g. "Quantum Snake & Ladder — Daily #162". */
  header: string;
  /** Localized result line, e.g. "Won in 7 rolls". */
  result: string;
  /** Localized journey summary line (may be empty). */
  journey: string;
};

/** Plain-text share message: header, result, journey, then the link. */
export function buildShareMessage({
  header,
  result,
  journey,
}: ShareParts): string {
  return [header, result, journey, GAME_PUBLIC_URL]
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
  journey: JourneyCounts;
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
    journey: journeyLine(parts.journey),
  });
}
