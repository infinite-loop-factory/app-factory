/**
 * Game controller — ported from uts-iqc-group15/snake-ladder useGame hooks
 * biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: turn-based state machine
 * biome-ignore-all lint/style/noNonNullAssertion: hot-path game state updates
 * biome-ignore-all lint/suspicious/noNonNullAssertedOptionalChain: measurement rows
 */

import type {
  CollapseParams,
  GamePhase,
  GameState,
  LogEntry,
} from "@/game/types";
import type {
  GameFeedbackEvent,
  GameFeedbackHandler,
} from "@/lib/game-feedback";
import type { ResolvedTimings } from "@/lib/settings";

import { useLatest } from "ahooks";
import { useCallback, useRef, useState } from "react";
import { cellToCoord, coordToCell, TOTAL_CELLS } from "@/game/constants/board";
import { GAME_TIMINGS } from "@/game/constants/theme";
import { measureCollapseOutcome } from "@/game/lib/collapse-measurement";
import {
  applyInterferenceCollapse,
  applySettledCollapse,
} from "@/game/lib/collapse-reducers";
import {
  DEFAULT_ENTANGLEMENT_STRATEGY,
  type EntanglementStrategy,
} from "@/game/lib/entanglement-strategy";
import {
  computeDisplacement,
  createInitialState,
  INITIAL_SETUP,
  resetQubitIdCounter,
  rollDie,
  sleep,
} from "@/game/lib/game-helpers";
import { runQuantumCircuit } from "@/game/lib/local-sim";
import {
  reduceConfirmPass,
  reducePlaceCpuQubit,
  reducePlaceQubit,
  reduceSelectQubit,
} from "@/game/lib/setup-reducers";
import {
  BARRIER_THETA,
  buildTunnelQASM,
  computeTunnelPhase,
  isResonant,
  tunnelPassProbability,
} from "@/game/lib/tunnel-circuit";
import { waitForDiceAnimation } from "@/lib/dice-roll-bridge";

const DICE_SETTLE_PAUSE_MS = 250;
const OVERSHOOT_ANIM_MS = 520;
const BOUNCE_STEP_SCALE = 0.45;

type GameControllerOptions = {
  entanglementStrategy?: EntanglementStrategy;
  timings?: ResolvedTimings;
  onFeedback?: GameFeedbackHandler;
};

export function useGameController(options: GameControllerOptions = {}) {
  const {
    entanglementStrategy = DEFAULT_ENTANGLEMENT_STRATEGY,
    timings = GAME_TIMINGS,
    onFeedback,
  } = options;
  const [state, setState] = useState<GameState>(() => createInitialState());
  const stateRef = useLatest(state);
  const logsRef = useRef<LogEntry[]>([]);
  const collapsingRef = useRef(false);
  const timingsRef = useLatest(timings);
  const feedbackRef = useLatest(onFeedback);

  const emitFeedback = useCallback((event: GameFeedbackEvent) => {
    feedbackRef.current?.(event);
  }, []);

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${logsRef.current.length}`,
      timestamp: Date.now(),
      type,
      message,
    };
    logsRef.current = [...logsRef.current, entry];
    setState((prev) => ({ ...prev, logs: logsRef.current }));
  }, []);

  const recordPathStep = useCallback((player: 0 | 1, cell: number) => {
    setState((prev) => {
      const playerPath = prev.paths[player];
      if (playerPath[playerPath.length - 1] === cell) return prev;
      const paths: [number[], number[]] = [
        player === 0 ? [...playerPath, cell] : prev.paths[0],
        player === 1 ? [...playerPath, cell] : prev.paths[1],
      ];
      return { ...prev, paths };
    });
  }, []);

  const setPosition = useCallback(
    (player: 0 | 1, cell: number, recordPath = false) => {
      setState((prev) => {
        const positions: [number, number] = [...prev.positions];
        positions[player] = cell;
        if (!recordPath) return { ...prev, positions };
        const playerPath = prev.paths[player];
        if (playerPath[playerPath.length - 1] === cell) {
          return { ...prev, positions };
        }
        const paths: [number[], number[]] = [
          player === 0 ? [...playerPath, cell] : prev.paths[0],
          player === 1 ? [...playerPath, cell] : prev.paths[1],
        ];
        return { ...prev, positions, paths };
      });
    },
    [],
  );

  const hopAlongBoard = useCallback(
    async (
      player: 0 | 1,
      fromCell: number,
      toCell: number,
      stepMsOverride?: number,
    ) => {
      if (fromCell === toCell) return;
      const stepMs = stepMsOverride ?? timingsRef.current.hopMs;
      const dir = toCell > fromCell ? 1 : -1;
      for (
        let cell = fromCell + dir;
        dir > 0 ? cell <= toCell : cell >= toCell;
        cell += dir
      ) {
        setPosition(player, cell, true);
        emitFeedback({ type: "hop" });
        await sleep(stepMs);
      }
    },
    [emitFeedback, setPosition],
  );

  const slideToCell = useCallback(
    async (
      player: 0 | 1,
      fromCell: number,
      toCell: number,
      isLadder: boolean,
    ) => {
      const a = cellToCoord(fromCell);
      const b = cellToCoord(toCell);
      const gridSpan = Math.max(
        Math.abs(a.col - b.col),
        Math.abs(a.row - b.row),
      );
      if (gridSpan === 0) {
        setPosition(player, toCell, true);
        return;
      }
      const steps = gridSpan * 2;
      const stepMs = isLadder
        ? timingsRef.current.ladderStepMs
        : timingsRef.current.snakeStepMs;

      setState((prev) => ({
        ...prev,
        slidingPlayer: player,
        slidingFromCell: fromCell,
      }));
      try {
        let prevCell = fromCell;
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const col = Math.round(a.col + (b.col - a.col) * t);
          const row = Math.round(a.row + (b.row - a.row) * t);
          const cell = coordToCell(col, row);
          if (cell !== prevCell) {
            setPosition(player, cell);
            prevCell = cell;
            emitFeedback({ type: isLadder ? "ladder_step" : "snake_step" });
            await sleep(stepMs);
          }
        }
        if (prevCell !== toCell) setPosition(player, toCell, true);
        else recordPathStep(player, toCell);
      } finally {
        setState((prev) => ({
          ...prev,
          slidingPlayer: null,
          slidingFromCell: null,
        }));
      }
    },
    [emitFeedback, recordPathStep, setPosition],
  );

  const runCollapse = useCallback(
    async ({ qubit, player, targetCell }: CollapseParams): Promise<void> => {
      if (collapsingRef.current) return;
      collapsingRef.current = true;
      emitFeedback({ type: "collapse" });
      const partner = qubit.entangledPartnerId
        ? stateRef.current.qubits.find((q) => q.id === qubit.entangledPartnerId)
        : undefined;

      const data = await measureCollapseOutcome({
        qubit,
        partner,
        strategy: entanglementStrategy,
        addLog,
      });

      const { qubitId, outcome, partnerId, partnerOutcome } = data;

      if (outcome === "interference") {
        const partnerSettled: "snake" | "ladder" | undefined =
          partnerId && partnerOutcome && partnerOutcome !== "interference"
            ? partnerOutcome
            : undefined;
        const partnerCell = partnerSettled
          ? stateRef.current.qubits.find((q) => q.id === partnerId)?.cell
          : undefined;
        const partnerDest =
          partnerSettled && partnerCell !== undefined
            ? computeDisplacement(partnerSettled, partnerCell, addLog)
            : undefined;

        setState((prev) =>
          applyInterferenceCollapse(prev, {
            qubitId,
            partnerId,
            partnerOutcome,
            partnerSettled,
            partnerDest,
            player,
          }),
        );
        collapsingRef.current = false;
        return;
      }

      const newCell = computeDisplacement(outcome, targetCell, addLog);
      setState((prev) =>
        applySettledCollapse(prev, {
          qubitId,
          outcome,
          newCell,
          partnerId,
          partnerOutcome,
          addLog,
        }),
      );

      await slideToCell(player, targetCell, newCell, outcome === "ladder");

      const gameOver = newCell >= TOTAL_CELLS;
      if (gameOver) {
        emitFeedback({ type: player === 0 ? "win" : "lose" });
      }
      let finishMessage: string | null = null;
      if (gameOver) {
        finishMessage = player === 0 ? "play.youWin" : "play.opponentWin";
      }
      setState((prev) => ({
        ...prev,
        isCollapsing: false,
        isMoving: false,
        gameOver,
        phase: gameOver ? ("gameover" as GamePhase) : prev.phase,
        currentPlayer: gameOver
          ? prev.currentPlayer
          : ((player === 0 ? 1 : 0) as 0 | 1),
        message: finishMessage ?? prev.message,
      }));
      collapsingRef.current = false;
    },
    [addLog, emitFeedback, entanglementStrategy, slideToCell],
  );

  const selectQubit = useCallback((configIndex: number) => {
    setState((prev) => reduceSelectQubit(prev, configIndex));
  }, []);

  const placeQubit = useCallback((cell: number) => {
    setState((prev) => reducePlaceQubit(prev, cell));
  }, []);

  const placeCpuQubit = useCallback((cell: number, configIndex: number) => {
    setState((prev) => reducePlaceCpuQubit(prev, cell, configIndex));
  }, []);

  const confirmPass = useCallback(() => {
    setState((prev) => reduceConfirmPass(prev));
  }, []);

  const handleRoll = useCallback(
    async (forced?: number) => {
      const snap = stateRef.current;
      if (
        snap.phase !== "play" ||
        snap.isRolling ||
        snap.isMoving ||
        snap.gameOver ||
        snap.isCollapsing
      ) {
        return;
      }

      const physicsPromise = waitForDiceAnimation();
      setState((prev) => ({
        ...prev,
        isRolling: true,
        dice: null,
        message: "",
      }));
      emitFeedback({ type: "roll" });

      let die: number;
      try {
        const physicsValue = await physicsPromise;
        die = forced && forced >= 1 && forced <= 6 ? forced : physicsValue;
      } catch {
        die = forced && forced >= 1 && forced <= 6 ? forced : rollDie();
      }

      const player = snap.currentPlayer;
      const currentCell = snap.positions[player];
      const rawTarget = currentCell + die;

      if (rawTarget > TOTAL_CELLS) {
        const _needed = TOTAL_CELLS - currentCell;
        setState((prev) => ({
          ...prev,
          dice: die,
          isRolling: false,
          isMoving: true,
          message: "play.overshoot",
        }));
        await sleep(DICE_SETTLE_PAUSE_MS);
        await hopAlongBoard(player, currentCell, TOTAL_CELLS);
        setState((prev) => ({ ...prev, overshootPlayer: player }));
        await sleep(OVERSHOOT_ANIM_MS);
        setState((prev) => ({ ...prev, overshootPlayer: null }));
        const bounceStepMs = Math.max(
          20,
          Math.round(timingsRef.current.hopMs * BOUNCE_STEP_SCALE),
        );
        await hopAlongBoard(player, TOTAL_CELLS, currentCell, bounceStepMs);
        setState((prev) => ({
          ...prev,
          isRolling: false,
          isMoving: false,
          message: "play.overshootDone",
          currentPlayer: (player === 0 ? 1 : 0) as 0 | 1,
        }));
        return;
      }

      const opponent = (player === 0 ? 1 : 0) as 0 | 1;
      const opponentCell = snap.positions[opponent];
      let tunneled = false;

      if (rawTarget === opponentCell && rawTarget < TOTAL_CELLS) {
        const phi = computeTunnelPhase(snap.paths[player].length);
        const theta = BARRIER_THETA;
        const qasm = buildTunnelQASM(theta, phi);
        const result = await runQuantumCircuit(qasm);
        tunneled = result[0]?.[0] === 1;
        const pPass = tunnelPassProbability(theta, phi);
        addLog("qasm", qasm);
        addLog(
          "info",
          `Tunnel φ=${phi.toFixed(4)}, P(pass)=${pPass.toFixed(4)}${isResonant(phi) ? " [RESONANCE]" : ""}`,
        );
        emitFeedback({ type: "tunnel" });
      }

      const targetCell = tunneled ? rawTarget + 1 : rawTarget;
      setState((prev) => ({
        ...prev,
        dice: die,
        isRolling: false,
        isMoving: true,
        message: "play.moving",
      }));
      await sleep(DICE_SETTLE_PAUSE_MS);
      await hopAlongBoard(player, currentCell, targetCell);

      if (targetCell >= TOTAL_CELLS) {
        emitFeedback({ type: player === 0 ? "win" : "lose" });
        setState((prev) => ({
          ...prev,
          isRolling: false,
          isMoving: false,
          gameOver: true,
          phase: "gameover",
          message: player === 0 ? "play.youWin" : "play.opponentWin",
        }));
        return;
      }

      const settled = stateRef.current;
      const uncollapsedQubit = settled.qubits.find(
        (q) => q.cell === targetCell && q.collapsed === null,
      );

      if (uncollapsedQubit) {
        setState((prev) => ({
          ...prev,
          isRolling: false,
          isCollapsing: true,
          message: "play.collapsing",
        }));
        await runCollapse({ qubit: uncollapsedQubit, player, targetCell });
        setState((prev) => ({ ...prev, isRolling: false }));
        return;
      }

      const collapsedQubit = settled.qubits.find(
        (q) =>
          q.cell === targetCell &&
          (q.collapsed === "snake" || q.collapsed === "ladder"),
      );

      if (collapsedQubit) {
        const outcome = collapsedQubit.collapsed as "snake" | "ladder";
        const newCell =
          collapsedQubit.destinationCell ??
          computeDisplacement(outcome, targetCell, addLog);
        await slideToCell(player, targetCell, newCell, outcome === "ladder");
        const gameOver = newCell >= TOTAL_CELLS;
        if (gameOver) {
          emitFeedback({ type: player === 0 ? "win" : "lose" });
        }
        const endMessage = (() => {
          if (gameOver) {
            return player === 0 ? "play.youWin" : "play.opponentWin";
          }
          return outcome === "ladder" ? "play.ladder" : "play.snake";
        })();
        setState((prev) => ({
          ...prev,
          isRolling: false,
          isMoving: false,
          gameOver,
          phase: gameOver ? "gameover" : prev.phase,
          currentPlayer: gameOver
            ? prev.currentPlayer
            : ((player === 0 ? 1 : 0) as 0 | 1),
          message: endMessage,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isRolling: false,
        isMoving: false,
        message: "play.moved",
        currentPlayer: (player === 0 ? 1 : 0) as 0 | 1,
      }));
    },
    [addLog, emitFeedback, hopAlongBoard, runCollapse, slideToCell],
  );

  const reset = useCallback(() => {
    resetQubitIdCounter();
    logsRef.current = [];
    collapsingRef.current = false;
    setState({
      ...createInitialState(),
      setupRemaining: [[...INITIAL_SETUP[0]], [...INITIAL_SETUP[1]]],
      logs: [],
      paths: [[1], [1]],
    });
  }, []);

  return {
    state,
    selectQubit,
    placeQubit,
    placeCpuQubit,
    confirmPass,
    handleRoll,
    reset,
  };
}
