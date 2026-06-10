/**
 * Game controller — ported from uts-iqc-group15/snake-ladder useGame hooks
 * biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: turn-based state machine
 * biome-ignore-all lint/style/noNonNullAssertion: hot-path game state updates
 * biome-ignore-all lint/suspicious/noNonNullAssertedOptionalChain: measurement rows
 */

import type {
  CollapseParams,
  CollapseResult,
  GamePhase,
  GameState,
  LogEntry,
  PlacedQubit,
} from "@/game/types";
import type {
  GameFeedbackEvent,
  GameFeedbackHandler,
} from "@/lib/game-feedback";
import type { ResolvedTimings } from "@/lib/settings";

import { useCallback, useRef, useState } from "react";
import {
  cellToCoord,
  coordToCell,
  isValidPlacement,
  QUBIT_CONFIGS,
  TOTAL_CELLS,
} from "@/game/constants/board";
import { GAME_TIMINGS } from "@/game/constants/theme";
import {
  DEFAULT_ENTANGLEMENT_STRATEGY,
  type EntanglementStrategy,
} from "@/game/lib/entanglement-strategy";
import {
  computeDisplacement,
  createInitialState,
  INITIAL_SETUP,
  linkEntangledQubits,
  nextQubitId,
  resetQubitIdCounter,
  rollDie,
  sleep,
} from "@/game/lib/game-helpers";
import { runQuantumCircuit } from "@/game/lib/local-sim";
import { buildSingleQubitQASM } from "@/game/lib/qasm-builder";
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
  const stateRef = useRef(state);
  stateRef.current = state;
  const logsRef = useRef<LogEntry[]>([]);
  const collapsingRef = useRef(false);
  const timingsRef = useRef(timings);
  timingsRef.current = timings;
  const feedbackRef = useRef(onFeedback);
  feedbackRef.current = onFeedback;

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
      const config = QUBIT_CONFIGS[qubit.configIndex]!;
      const partner = qubit.entangledPartnerId
        ? stateRef.current.qubits.find((q) => q.id === qubit.entangledPartnerId)
        : undefined;
      const partnerStillEntangled =
        config.entangled && partner && partner.collapsed === null;

      let data: CollapseResult;
      try {
        if (partnerStillEntangled && partner) {
          const partnerConfig = QUBIT_CONFIGS[partner.configIndex]!;
          const params = config.entangledParams;
          const thetaFromProb = (p: number) => 2 * Math.acos(Math.sqrt(p));
          const ctx = params
            ? {
                thetaA: params.thetaA,
                thetaB: params.thetaB,
                phase: params.phase,
              }
            : {
                thetaA: thetaFromProb(config.ladderProb),
                thetaB: thetaFromProb(partnerConfig.ladderProb),
              };
          const qasm = entanglementStrategy.buildQASM(ctx);
          addLog("info", `Measuring ENTANGLED qubit [${config.label}]...`);
          for (const line of entanglementStrategy.describe(ctx)) {
            addLog("info", line);
          }
          addLog("qasm", qasm);
          const result = await runQuantumCircuit(qasm);
          const parsed = entanglementStrategy.parseResult(result[0]!);
          data = {
            qubitId: qubit.id,
            outcome: parsed.playerOutcome,
            partnerId: qubit.entangledPartnerId,
            partnerOutcome: parsed.partnerOutcome ?? undefined,
          };
        } else {
          const qasm = buildSingleQubitQASM(config.ladderProb);
          addLog(
            "info",
            `Measuring qubit [${config.label}] at cell ${qubit.cell}...`,
          );
          addLog("qasm", qasm);
          const result = await runQuantumCircuit(qasm);
          const measurement = result[0]?.[0]!;
          const outcome: "snake" | "ladder" =
            measurement === 0 ? "ladder" : "snake";
          data = { qubitId: qubit.id, outcome };
        }
      } catch {
        const fallback =
          rollDie() <= Math.ceil(config.ladderProb * 6) ? "ladder" : "snake";
        data = { qubitId: qubit.id, outcome: fallback };
      }

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

        setState((prev) => ({
          ...prev,
          qubits: prev.qubits.map((q) => {
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
          currentPlayer: (player === 0 ? 1 : 0) as 0 | 1,
          message: "play.interference",
        }));
        collapsingRef.current = false;
        return;
      }

      const newCell = computeDisplacement(outcome, targetCell, addLog);
      setState((prev) => ({
        ...prev,
        qubits: prev.qubits.map((q) => {
          if (q.id === qubitId) {
            return { ...q, collapsed: outcome, destinationCell: newCell };
          }
          if (partnerId && q.id === partnerId && partnerOutcome) {
            if (partnerOutcome !== "interference") {
              const pCell = q.cell;
              return {
                ...q,
                collapsed: partnerOutcome,
                destinationCell: computeDisplacement(
                  partnerOutcome,
                  pCell,
                  addLog,
                ),
              };
            }
            return { ...q, collapsed: "interference" };
          }
          return q;
        }),
        message: outcome === "ladder" ? "play.ladder" : "play.snake",
      }));

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
    setState((prev) => {
      if (prev.phase !== "setup" || prev.currentPlayer !== 0) return prev;
      if (!prev.setupRemaining[0].includes(configIndex)) return prev;
      return { ...prev, selectedConfigIndex: configIndex };
    });
  }, []);

  const placeQubit = useCallback((cell: number) => {
    setState((prev) => {
      if (prev.phase !== "setup" || prev.selectedConfigIndex === null)
        return prev;
      const player = prev.currentPlayer;
      const ownCells = prev.qubits
        .filter((q) => q.owner === player)
        .map((q) => q.cell);
      if (!isValidPlacement(cell, ownCells)) return prev;

      const configIndex = prev.selectedConfigIndex;
      const opponentQubit = prev.qubits.find(
        (q) =>
          q.cell === cell &&
          q.owner !== player &&
          q.collapsed !== "interference",
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
    });
  }, []);

  const placeCpuQubit = useCallback((cell: number, configIndex: number) => {
    setState((prev) => {
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
    });
  }, []);

  const confirmPass = useCallback(() => {
    setState((prev) => {
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
        message:
          prev.currentPlayer === 0 ? "play.humanRoll" : "play.opponentRoll",
      };
    });
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
