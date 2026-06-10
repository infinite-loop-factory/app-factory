import type { GameState } from "@/game/types";

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
