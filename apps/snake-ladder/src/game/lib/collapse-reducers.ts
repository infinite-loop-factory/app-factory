/**
 * Pure state mappers that apply a measured collapse outcome to the
 * qubit list — extracted from useGameController.
 */
import type { GameState, LogEntry, PlacedQubit } from "@/game/types";

import { computeDisplacement } from "@/game/lib/game-helpers";

type AddLog = (type: LogEntry["type"], message: string) => void;

export function applyInterferenceCollapse(
  prev: GameState,
  args: {
    qubitId: string;
    partnerId?: string;
    partnerOutcome?: "snake" | "ladder" | "interference";
    partnerSettled?: "snake" | "ladder";
    partnerDest?: number;
    player: 0 | 1;
  },
): GameState {
  const { qubitId, partnerId, partnerOutcome, partnerSettled, partnerDest } =
    args;
  return {
    ...prev,
    qubits: prev.qubits.map((q): PlacedQubit => {
      if (q.id === qubitId) return { ...q, collapsed: "interference" };
      if (partnerId && q.id === partnerId) {
        if (partnerSettled && partnerDest !== undefined) {
          return {
            ...q,
            collapsed: partnerSettled,
            destinationCell: partnerDest,
          };
        }
        if (partnerOutcome === "interference") {
          return { ...q, collapsed: "interference" };
        }
      }
      return q;
    }),
    isCollapsing: false,
    isMoving: false,
    currentPlayer: (args.player === 0 ? 1 : 0) as 0 | 1,
    message: "play.interference",
  };
}

export function applySettledCollapse(
  prev: GameState,
  args: {
    qubitId: string;
    outcome: "snake" | "ladder";
    newCell: number;
    partnerId?: string;
    partnerOutcome?: "snake" | "ladder" | "interference";
    addLog: AddLog;
  },
): GameState {
  const { qubitId, outcome, newCell, partnerId, partnerOutcome, addLog } = args;
  return {
    ...prev,
    qubits: prev.qubits.map((q): PlacedQubit => {
      if (q.id === qubitId) {
        return { ...q, collapsed: outcome, destinationCell: newCell };
      }
      if (partnerId && q.id === partnerId && partnerOutcome) {
        if (partnerOutcome !== "interference") {
          return {
            ...q,
            collapsed: partnerOutcome,
            destinationCell: computeDisplacement(
              partnerOutcome,
              q.cell,
              addLog,
            ),
          };
        }
        return { ...q, collapsed: "interference" };
      }
      return q;
    }),
    message: outcome === "ladder" ? "play.ladder" : "play.snake",
  };
}
