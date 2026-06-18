import type { GameState } from "@/game/types";
import type { ResolvedTimings } from "@/lib/settings";

import { useLatest, useTimeout } from "ahooks";
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
  const onBeforeRollRef = useLatest(onBeforeRoll);

  // Placement keeps a manual timer: the condition stays true across
  // consecutive placements, so a delay-driven useTimeout would never
  // re-arm between qubits and the CPU would stall after the first one.
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

  // Pass + roll fire once per activation: their conditions flip false the
  // moment the action starts, so the timeout re-arms cleanly next turn.
  const shouldConfirmPass =
    state.phase === "passing" && state.currentPlayer === 1;
  useTimeout(
    () => confirmPass(),
    shouldConfirmPass ? timings.cpuThinkMs : undefined,
  );

  const shouldRoll =
    state.phase === "play" &&
    state.currentPlayer === 1 &&
    !state.isRolling &&
    !state.isMoving &&
    !state.isCollapsing &&
    !state.gameOver;
  useTimeout(
    () => {
      onBeforeRollRef.current?.();
      void handleRoll();
    },
    shouldRoll ? timings.cpuThinkMs : undefined,
  );
}
