import type { ReactNode } from "react";
import type { CraftPalette } from "@/game/constants/palettes";
import type { GameState } from "@/game/types";

import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
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
  clamp,
  QUBIT_CONFIGS,
  TOTAL_CELLS,
} from "@/game/constants/board";
import { GAME_FONT } from "@/game/constants/theme";
import { darkenColor } from "@/lib/color";

const CAMERA_ZOOM = 1.4;
/** Zoom-in locks on quickly; zoom-out relaxes a beat after the turn ends. */
const CAMERA_EASE_IN = { duration: 340, easing: Easing.out(Easing.cubic) };
const CAMERA_EASE_OUT = { duration: 480, easing: Easing.out(Easing.cubic) };
const CAMERA_SPRING = { damping: 26, stiffness: 160 } as const;

/** Zooms toward the moving token while a hop or slide resolves. */
function BoardCamera({
  state,
  cellSize,
  boardWidth,
  boardHeight,
  reducedMotion,
  children,
}: {
  state: GameState;
  cellSize: number;
  boardWidth: number;
  boardHeight: number;
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const zoom = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const focusPlayer =
    state.slidingPlayer ?? (state.isMoving ? state.currentPlayer : null);
  const active = focusPlayer !== null && !reducedMotion;
  const focusCell = focusPlayer !== null ? state.positions[focusPlayer] : 1;

  useEffect(() => {
    if (!active) {
      zoom.set(withTiming(1, CAMERA_EASE_OUT));
      tx.set(withTiming(0, CAMERA_EASE_OUT));
      ty.set(withTiming(0, CAMERA_EASE_OUT));
      return;
    }
    const { col, row } = cellToVisualCoord(focusCell);
    const fx = col * cellSize + cellSize / 2;
    const fy = row * cellSize + cellSize / 2;
    const maxTx = ((CAMERA_ZOOM - 1) * boardWidth) / 2;
    const maxTy = ((CAMERA_ZOOM - 1) * boardHeight) / 2;
    zoom.set(withTiming(CAMERA_ZOOM, CAMERA_EASE_IN));
    tx.set(
      withSpring(
        clamp((boardWidth / 2 - fx) * CAMERA_ZOOM, -maxTx, maxTx),
        CAMERA_SPRING,
      ),
    );
    ty.set(
      withSpring(
        clamp((boardHeight / 2 - fy) * CAMERA_ZOOM, -maxTy, maxTy),
        CAMERA_SPRING,
      ),
    );
  }, [active, boardHeight, boardWidth, cellSize, focusCell, tx, ty, zoom]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.get() },
      { translateY: ty.get() },
      { scale: zoom.get() },
    ],
  }));

  return (
    <Animated.View style={[{ width: boardWidth, height: boardHeight }, style]}>
      {children}
    </Animated.View>
  );
}

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
  const isGoal = cell === TOTAL_CELLS;
  const isStart = cell === 1;
  const overlayTint = (() => {
    if (tint) return tint;
    if (isGoal) return `${palette.orbGlow}66`;
    if (isStart) return `${palette.ladder}40`;
    return null;
  })();

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
        alignItems: "center",
        justifyContent: "center",
      }}
      testID={`board-cell-${cell}`}
    >
      {/* inset tile: top-lit rounded piece sitting on the dark board base */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 1,
          top: 1,
          right: 1,
          bottom: 1,
          borderRadius: Math.max(4, cellSize * 0.2),
          backgroundColor: cellBackground(row, col, palette),
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.35)",
          borderBottomWidth: 1.5,
          borderBottomColor: "rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {overlayTint ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: overlayTint,
            }}
          />
        ) : null}
      </View>
      {isGoal ? (
        <MaterialIcons
          color={palette.orbGlow}
          name="emoji-events"
          size={cellSize * 0.5}
          style={{ position: "absolute", bottom: 1, right: 2 }}
        />
      ) : null}
      <Text
        style={{
          position: "absolute",
          top: 1,
          left: 4,
          fontSize: Math.max(9, cellSize * 0.3),
          color: `${palette.dicePip}99`,
          fontFamily: GAME_FONT,
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
      className="overflow-hidden rounded-2xl"
      style={{
        width: boardWidth,
        height: boardHeight,
        backgroundColor: darkenColor(palette.walnut, 0.55),
      }}
    >
      <BoardCamera
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        cellSize={cellSize}
        reducedMotion={reducedMotion}
        state={state}
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
      </BoardCamera>
    </View>
  );
}

export function getBoardCellSize(screenWidth: number): number {
  return Math.floor(Math.min((screenWidth - 32) / BOARD_SIZE, 36));
}
