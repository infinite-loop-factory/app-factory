/**
 * Pure setup-phase state transitions — extracted from useGameController
 * so the hook stays focused on async turn orchestration.
 */
import type { GamePhase, GameState, PlacedQubit } from "@/game/types";

import { isValidPlacement } from "@/game/constants/board";
import { linkEntangledQubits, nextQubitId } from "@/game/lib/game-helpers";

export function reduceSelectQubit(
  prev: GameState,
  configIndex: number,
): GameState {
  if (prev.phase !== "setup" || prev.currentPlayer !== 0) return prev;
  if (!prev.setupRemaining[0].includes(configIndex)) return prev;
  return { ...prev, selectedConfigIndex: configIndex };
}

export function reducePlaceQubit(prev: GameState, cell: number): GameState {
  if (prev.phase !== "setup" || prev.selectedConfigIndex === null) return prev;
  const player = prev.currentPlayer;
  const ownCells = prev.qubits
    .filter((q) => q.owner === player)
    .map((q) => q.cell);
  if (!isValidPlacement(cell, ownCells)) return prev;

  const configIndex = prev.selectedConfigIndex;
  const opponentQubit = prev.qubits.find(
    (q) =>
      q.cell === cell && q.owner !== player && q.collapsed !== "interference",
  );
  const collided = !!opponentQubit;

  const newQubit: PlacedQubit = {
    id: nextQubitId(),
    cell,
    owner: player,
    configIndex,
    collapsed: collided ? "interference" : null,
  };

  const baseQubits = collided
    ? prev.qubits.map((q) =>
        q.id === opponentQubit?.id
          ? { ...q, collapsed: "interference" as const }
          : q,
      )
    : prev.qubits;
  const newQubits = [...baseQubits, newQubit];

  const newRemaining: [number[], number[]] = [
    [...prev.setupRemaining[0]],
    [...prev.setupRemaining[1]],
  ];
  const idx = newRemaining[player].indexOf(configIndex);
  newRemaining[player].splice(idx, 1);

  const playerDone = newRemaining[player].length === 0;

  if (playerDone && player === 0) {
    return {
      ...prev,
      qubits: newQubits,
      setupRemaining: newRemaining,
      selectedConfigIndex: null,
      phase: "passing" as GamePhase,
      currentPlayer: 1 as const,
      message: collided ? "setup.interference" : "setup.opponentTurn",
    };
  }

  return {
    ...prev,
    qubits: newQubits,
    setupRemaining: newRemaining,
    selectedConfigIndex: null,
    message: "setup.humanTurn",
  };
}

export function reducePlaceCpuQubit(
  prev: GameState,
  cell: number,
  configIndex: number,
): GameState {
  if (prev.phase !== "setup" || prev.currentPlayer !== 1) return prev;
  const newQubit: PlacedQubit = {
    id: nextQubitId(),
    cell,
    owner: 1,
    configIndex,
    collapsed: null,
  };
  const newRemaining: [number[], number[]] = [
    [...prev.setupRemaining[0]],
    [...prev.setupRemaining[1]],
  ];
  const idx = newRemaining[1].indexOf(configIndex);
  if (idx >= 0) newRemaining[1].splice(idx, 1);

  const cpuDone = newRemaining[1].length === 0;
  const newQubits = cpuDone
    ? linkEntangledQubits([...prev.qubits, newQubit])
    : [...prev.qubits, newQubit];

  if (cpuDone) {
    return {
      ...prev,
      qubits: newQubits,
      setupRemaining: newRemaining,
      phase: "passing" as GamePhase,
      currentPlayer: 0 as const,
      message: "setup.confirmPass",
    };
  }

  return { ...prev, qubits: newQubits, setupRemaining: newRemaining };
}

export function reduceConfirmPass(prev: GameState): GameState {
  if (prev.phase !== "passing") return prev;
  if (prev.setupRemaining[prev.currentPlayer].length > 0) {
    return {
      ...prev,
      phase: "setup" as GamePhase,
      message:
        prev.currentPlayer === 0 ? "setup.humanTurn" : "setup.opponentTurn",
    };
  }
  return {
    ...prev,
    phase: "play" as GamePhase,
    message: prev.currentPlayer === 0 ? "play.humanRoll" : "play.opponentRoll",
  };
}
