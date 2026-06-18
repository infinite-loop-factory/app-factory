import type { Point } from "@/components/board-art/snake-path";
import type { CraftPalette } from "@/game/constants/palettes";
import type { PlacedQubit } from "@/game/types";

import Svg from "react-native-svg";
import { LadderPath } from "@/components/board-art/ladder-path";
import { SnakePath } from "@/components/board-art/snake-path";
import { cellToVisualCoord, QUBIT_CONFIGS } from "@/game/constants/board";

export { LadderPath } from "@/components/board-art/ladder-path";
export { SnakePath } from "@/components/board-art/snake-path";

type BoardConnectionsProps = {
  qubits: PlacedQubit[];
  cellSize: number;
  boardWidth: number;
  boardHeight: number;
  palette: CraftPalette;
  /** Source cell of the connection currently being traversed — rendered emphasized. */
  activeFromCell?: number | null;
};

function cellCenter(cell: number, cellSize: number): Point {
  const { col, row } = cellToVisualCoord(cell);
  return {
    x: col * cellSize + cellSize / 2,
    y: row * cellSize + cellSize / 2,
  };
}

export function getSnakeLadderConnections(
  qubits: PlacedQubit[],
): PlacedQubit[] {
  return qubits.filter(
    (q) =>
      (q.collapsed === "snake" || q.collapsed === "ladder") &&
      q.destinationCell !== undefined,
  );
}

function connectionStroke(qubit: PlacedQubit, palette: CraftPalette): string {
  const entangled = QUBIT_CONFIGS[qubit.configIndex]?.entangled ?? false;
  if (entangled) return palette.interference;
  return qubit.collapsed === "snake" ? palette.snake : palette.ladder;
}

export function BoardConnections({
  qubits,
  cellSize,
  boardWidth,
  boardHeight,
  palette,
  activeFromCell = null,
}: BoardConnectionsProps) {
  const connections = getSnakeLadderConnections(qubits);
  if (connections.length === 0) return null;

  return (
    <Svg
      height={boardHeight}
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
      width={boardWidth}
    >
      {connections.map((qubit) => {
        const from = cellCenter(qubit.cell, cellSize);
        const to = cellCenter(qubit.destinationCell as number, cellSize);
        const stroke = connectionStroke(qubit, palette);
        const emphasized =
          activeFromCell !== null && qubit.cell === activeFromCell;

        if (qubit.collapsed === "snake") {
          return (
            <SnakePath
              cellSize={cellSize}
              emphasized={emphasized}
              from={from}
              id={qubit.id}
              key={qubit.id}
              stroke={stroke}
              to={to}
            />
          );
        }

        return (
          <LadderPath
            cellSize={cellSize}
            emphasized={emphasized}
            from={from}
            key={qubit.id}
            stroke={stroke}
            to={to}
          />
        );
      })}
    </Svg>
  );
}
