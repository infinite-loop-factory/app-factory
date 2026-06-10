import { describe, expect, it } from "@jest/globals";
import {
  BOARD_SIZE,
  cellToCoord,
  cellToVisualCoord,
  coordToCell,
  isValidPlacement,
} from "@/game/constants/board";
import { biasedBellStrategy } from "@/game/lib/entanglement-strategy";
import {
  createInitialState,
  pickCpuPlacementCell,
} from "@/game/lib/game-helpers";
import { simulateLocally } from "@/game/lib/local-sim";
import {
  buildTunnelQASM,
  computeTunnelPhase,
  tunnelPassProbability,
} from "@/game/lib/tunnel-circuit";

describe("snake-ladder board", () => {
  it("maps cells through coord roundtrip on a 10x10 board", () => {
    for (let cell = 1; cell <= BOARD_SIZE * BOARD_SIZE; cell += 1) {
      const { col, row } = cellToCoord(cell);
      expect(coordToCell(col, row)).toBe(cell);
    }
  });

  it("places cell 1 bottom-left and 100 top-left on screen", () => {
    expect(cellToVisualCoord(1)).toEqual({ col: 0, row: BOARD_SIZE - 1 });
    expect(cellToVisualCoord(10)).toEqual({
      col: BOARD_SIZE - 1,
      row: BOARD_SIZE - 1,
    });
    expect(cellToVisualCoord(100)).toEqual({ col: 0, row: 0 });
  });

  it("allows placement between cells 6 and 95", () => {
    expect(isValidPlacement(5, [])).toBe(false);
    expect(isValidPlacement(6, [])).toBe(true);
    expect(isValidPlacement(95, [])).toBe(true);
    expect(isValidPlacement(96, [])).toBe(false);
  });
});

describe("quantum mechanics", () => {
  it("parses biased entanglement measurements", () => {
    expect(biasedBellStrategy.parseResult([0, 0, 0]).playerOutcome).toBe(
      "ladder",
    );
    expect(biasedBellStrategy.parseResult([1, 1, 0]).playerOutcome).toBe(
      "interference",
    );
  });

  it("blocks tunneling at destructive interference", () => {
    const phi = Math.PI;
    expect(tunnelPassProbability(1.2, phi)).toBeCloseTo(0, 5);
  });

  it("runs tunnel QASM locally", () => {
    const qasm = buildTunnelQASM(1.2, computeTunnelPhase(4));
    const result = simulateLocally(qasm);
    expect(result[0]?.[0]).toBeGreaterThanOrEqual(0);
    expect(result[0]?.[0]).toBeLessThanOrEqual(1);
  });
});

describe("game state", () => {
  it("starts in setup phase vs CPU", () => {
    const state = createInitialState();
    expect(state.phase).toBe("setup");
    expect(state.positions).toEqual([1, 1]);
    expect(state.setupRemaining[0]).toHaveLength(5);
  });

  it("picks CPU qubit cells randomly within placement bounds", () => {
    const state = createInitialState();
    for (let i = 0; i < 50; i += 1) {
      const cell = pickCpuPlacementCell(state);
      expect(cell).not.toBeNull();
      expect(cell).toBeGreaterThanOrEqual(6);
      expect(cell).toBeLessThanOrEqual(95);
    }
  });
});
