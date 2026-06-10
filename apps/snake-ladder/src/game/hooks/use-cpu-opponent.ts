import type { GameState } from "@/game/types";
import type { ResolvedTimings } from "@/lib/settings";

import { useEffect, useRef } from "react";
import { pickCpuPlacementCell } from "@/game/lib/game-helpers";

type CpuOpponentOptions = {
  state: GameState;
  timings: ResolvedTimings;
  placeCpuQubit: (cell: number, configIndex: number) => void;
  confirmPass: () => void;
  handleRoll: (forced?: number) => Promise<void>;
  /** Runs just before the CPU rolls — reset per-roll UI state here. */
  onBeforeRoll?: () => void;
};

/** Drives the computer player: qubit placement, pass handoff, and rolls. */
export function useCpuOpponent({
  state,
  timings,
  placeCpuQubit,
  confirmPass,
  handleRoll,
  onBeforeRoll,
}: CpuOpponentOptions) {
  const cpuBusyRef = useRef(false);
  const onBeforeRollRef = useRef(onBeforeRoll);
  onBeforeRollRef.current = onBeforeRoll;

  useEffect(() => {
    if (state.phase !== "setup" || state.currentPlayer !== 1) return;
    if (cpuBusyRef.current) return;

    const remaining = state.setupRemaining[1];
    if (remaining.length === 0) return;

    cpuBusyRef.current = true;
    const timer = setTimeout(() => {
      const cell = pickCpuPlacementCell(state);
      const picked =
        remaining[Math.floor(Math.random() * remaining.length)] ?? remaining[0];
      const configIndex = picked;
      if (cell !== null && configIndex !== undefined) {
        placeCpuQubit(cell, configIndex);
      }
      cpuBusyRef.current = false;
    }, timings.cpuThinkMs);

    return () => {
      clearTimeout(timer);
      cpuBusyRef.current = false;
    };
  }, [placeCpuQubit, state, timings.cpuThinkMs]);

  useEffect(() => {
    if (state.phase !== "passing" || state.currentPlayer !== 1) return;
    const timer = setTimeout(() => confirmPass(), timings.cpuThinkMs);
    return () => clearTimeout(timer);
  }, [confirmPass, state.currentPlayer, state.phase, timings.cpuThinkMs]);

  useEffect(() => {
    if (state.phase !== "play" || state.currentPlayer !== 1) return;
    if (
      state.isRolling ||
      state.isMoving ||
      state.isCollapsing ||
      state.gameOver
    ) {
      return;
    }
    const timer = setTimeout(() => {
      onBeforeRollRef.current?.();
      void handleRoll();
    }, timings.cpuThinkMs);
    return () => clearTimeout(timer);
  }, [
    handleRoll,
    state.currentPlayer,
    state.gameOver,
    state.isCollapsing,
    state.isMoving,
    state.isRolling,
    state.phase,
    timings.cpuThinkMs,
  ]);
}
