import type { DiceVariant } from "@/components/dice/dice-variant";
import type { GameState } from "@/game/types";

import { getDailyNumber, getDailySeed } from "@/game/lib/daily";
import { seedFromCode } from "@/game/lib/room";
import i18n from "@/i18n";

export function getActiveTurnPlayer(state: GameState): 0 | 1 | null {
  if (state.phase !== "play" || state.gameOver) return null;
  return state.currentPlayer;
}

export function isGameInProgress(state: GameState): boolean {
  return (
    state.phase !== "gameover" &&
    (state.phase !== "setup" ||
      state.qubits.length > 0 ||
      state.positions[0] > 1 ||
      state.positions[1] > 1)
  );
}

export function canRollNow(state: GameState): boolean {
  return (
    state.phase === "play" &&
    state.currentPlayer === 0 &&
    !state.isRolling &&
    !state.isMoving &&
    !state.isCollapsing &&
    !state.gameOver
  );
}

export function canConfirmPassNow(state: GameState): boolean {
  return state.phase === "passing" && state.currentPlayer === 0;
}

/**
 * True right after a bad beat (snake / overshoot / interference).
 * Used to suppress shop upsells — never monetize frustration.
 */
export function isSetbackMessage(message: string): boolean {
  return (
    message === "play.snake" ||
    message === "play.overshoot" ||
    message === "play.overshootDone" ||
    message === "play.interference"
  );
}

type BoardMode = {
  isDaily: boolean;
  roomCode: string | null;
  roomRound?: number;
};

/** Header title: room badge (with round), daily badge, or the plain title. */
export function resolveHeaderTitle(mode: BoardMode, now: Date): string {
  if (mode.roomCode !== null) {
    const base = i18n.t("room.badge", { code: mode.roomCode });
    return (mode.roomRound ?? 1) > 1 ? `${base} · R${mode.roomRound}` : base;
  }
  if (mode.isDaily) {
    return i18n.t("daily.badge", { num: getDailyNumber(now) });
  }
  return i18n.t("game.title");
}

/** Share-text header for the current mode. */
export function resolveShareHeader(mode: BoardMode, now: Date): string {
  if (mode.roomCode !== null) {
    return i18n.t("share.room", { code: mode.roomCode });
  }
  if (mode.isDaily) {
    return i18n.t("share.header", { num: getDailyNumber(now) });
  }
  return i18n.t("share.headerFree");
}

/** Seed shown for shared-board modes; null for free play. */
export function resolvePresetSeed(
  mode: { isDaily: boolean; roomCode: string | null },
  now: Date,
): number | null {
  if (mode.roomCode !== null) return seedFromCode(mode.roomCode);
  if (mode.isDaily) return getDailySeed(now);
  return null;
}

/** The rolling die wears the roller's color: cpu red, player blue/gold. */
export function resolveDiceVariant(
  currentPlayer: 0 | 1,
  goldActive: boolean,
): DiceVariant {
  if (currentPlayer === 1) return "cpu";
  return goldActive ? "gold" : "default";
}

export function resolveStatusMessage(
  message: string,
  opponentName: string,
): string {
  if (!(message.startsWith("setup.") || message.startsWith("play."))) {
    return message;
  }
  if (
    message === "setup.opponentTurn" ||
    message === "play.opponentRoll" ||
    message === "play.opponentWin"
  ) {
    return i18n.t(message, { name: opponentName });
  }
  return i18n.t(message);
}
