import type { CraftPalette } from "@/game/constants/palettes";
import type { GameState } from "@/game/types";

import { Pressable, Text, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import {
  BoardConnections,
  getSnakeLadderConnections,
} from "@/components/board-connections";
import { PlayerTokenLayer } from "@/components/player-token";
import { QubitMarker } from "@/components/qubit-marker";
import {
  BOARD_SIZE,
  cellToVisualCoord,
  QUBIT_CONFIGS,
  TOTAL_CELLS,
} from "@/game/constants/board";

type GameBoardProps = {
  state: GameState;
  cellSize: number;
  palette: CraftPalette;
  onCellPress?: (cell: number) => void;
  selectable?: boolean;
  reducedMotion?: boolean;
  connections?: ReturnType<typeof getSnakeLadderConnections>;
};

function cellBackground(
  row: number,
  col: number,
  palette: CraftPalette,
): string {
  return (row + col) % 2 === 0 ? palette.maple : palette.walnut;
}

function destinationTint(
  cell: number,
  connections: ReturnType<typeof getSnakeLadderConnections>,
  palette: CraftPalette,
): string | null {
  const source = connections.find((q) => q.destinationCell === cell);
  if (!source) return null;
  const entangled = QUBIT_CONFIGS[source.configIndex]?.entangled ?? false;
  if (source.collapsed === "snake") {
    return entangled ? `${palette.interference}18` : `${palette.snake}14`;
  }
  if (source.collapsed === "ladder") {
    return entangled ? `${palette.interference}18` : `${palette.ladder}14`;
  }
  return null;
}

function BoardCell({
  cell,
  cellSize,
  state,
  palette,
  selectable,
  onCellPress,
  connections,
}: {
  cell: number;
  cellSize: number;
  state: GameState;
  palette: CraftPalette;
  selectable: boolean;
  onCellPress?: (cell: number) => void;
  connections: ReturnType<typeof getSnakeLadderConnections>;
}) {
  const { col, row } = cellToVisualCoord(cell);
  const qubits = state.qubits.filter((q) => q.cell === cell);
  const tint = destinationTint(cell, connections, palette);

  return (
    <Pressable
      accessibilityRole={selectable ? "button" : "none"}
      disabled={!(selectable && onCellPress)}
      onPress={() => onCellPress?.(cell)}
      style={{
        position: "absolute",
        left: col * cellSize,
        top: row * cellSize,
        width: cellSize,
        height: cellSize,
        backgroundColor: tint ?? cellBackground(row, col, palette),
        borderWidth: 0.5,
        borderColor: `${palette.border}88`,
        alignItems: "center",
        justifyContent: "center",
      }}
      testID={`board-cell-${cell}`}
    >
      <Text
        style={{
          position: "absolute",
          top: 2,
          left: 4,
          fontSize: Math.max(8, cellSize * 0.22),
          color: palette.textMuted,
          fontWeight: "600",
        }}
      >
        {cell}
      </Text>
      {qubits.map((q, index) => (
        <QubitMarker
          key={q.id}
          offsetIndex={index}
          palette={palette}
          qubit={q}
          size={Math.max(18, cellSize * 0.38)}
        />
      ))}
    </Pressable>
  );
}

export function GameBoard({
  state,
  cellSize,
  palette,
  onCellPress,
  selectable = false,
  reducedMotion = false,
}: GameBoardProps) {
  const boardWidth = BOARD_SIZE * cellSize;
  const boardHeight = BOARD_SIZE * cellSize;
  const connections = getSnakeLadderConnections(state.qubits);

  const pathPoints = (() => {
    if (state.phase !== "gameover") return null;
    if (state.positions[0] >= TOTAL_CELLS) {
      return state.paths[0]
        .map((cell) => {
          const { col, row } = cellToVisualCoord(cell);
          return `${col * cellSize + cellSize / 2},${row * cellSize + cellSize / 2}`;
        })
        .join(" ");
    }
    if (state.positions[1] >= TOTAL_CELLS) {
      return state.paths[1]
        .map((cell) => {
          const { col, row } = cellToVisualCoord(cell);
          return `${col * cellSize + cellSize / 2},${row * cellSize + cellSize / 2}`;
        })
        .join(" ");
    }
    return null;
  })();

  return (
    <View
      className="overflow-hidden rounded-2xl border-2"
      style={{
        width: boardWidth,
        height: boardHeight,
        borderColor: palette.border,
        backgroundColor: palette.background,
      }}
    >
      {Array.from({ length: TOTAL_CELLS }, (_, index) => {
        const cell = TOTAL_CELLS - index;
        return (
          <BoardCell
            cell={cell}
            cellSize={cellSize}
            connections={connections}
            key={cell}
            onCellPress={onCellPress}
            palette={palette}
            selectable={selectable}
            state={state}
          />
        );
      })}

      <BoardConnections
        activeFromCell={state.slidingFromCell}
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        cellSize={cellSize}
        palette={palette}
        qubits={state.qubits}
      />

      <PlayerTokenLayer
        cellSize={cellSize}
        palette={palette}
        reducedMotion={reducedMotion}
        state={state}
      />

      {pathPoints ? (
        <Svg
          height={boardHeight}
          pointerEvents="none"
          style={{ position: "absolute", top: 0, left: 0 }}
          width={boardWidth}
        >
          <Polyline
            fill="none"
            opacity={0.85}
            points={pathPoints}
            stroke={palette.orbGlow}
            strokeDasharray="4 4"
            strokeWidth={2}
          />
        </Svg>
      ) : null}
    </View>
  );
}

export function getBoardCellSize(screenWidth: number): number {
  return Math.floor(Math.min((screenWidth - 32) / BOARD_SIZE, 36));
}
