import type { CraftPalette } from "@/game/constants/palettes";
import type { PlacedQubit } from "@/game/types";

import Svg, { Circle, G, Line, Polygon, Polyline } from "react-native-svg";
import { cellToVisualCoord, QUBIT_CONFIGS } from "@/game/constants/board";

type BoardConnectionsProps = {
  qubits: PlacedQubit[];
  cellSize: number;
  boardWidth: number;
  boardHeight: number;
  palette: CraftPalette;
  /** Source cell of the connection currently being traversed — rendered emphasized. */
  activeFromCell?: number | null;
};

type Point = { x: number; y: number };

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

function SnakePath({
  from,
  to,
  stroke,
  cellSize,
  emphasized = false,
}: {
  from: Point;
  to: Point;
  stroke: string;
  cellSize: number;
  emphasized?: boolean;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const ux = dx / (dist || 1);
  const uy = dy / (dist || 1);
  const nx = -uy;
  const ny = ux;
  const segments = 20;
  const amplitude = Math.min(dist * 0.12, cellSize * 0.35);
  const points: string[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const baseX = from.x + dx * t;
    const baseY = from.y + dy * t;
    const wave = Math.sin(t * Math.PI * 4) * amplitude * (1 - t * 0.3);
    points.push(`${baseX + nx * wave},${baseY + ny * wave}`);
  }

  const headSize = cellSize * 0.14;
  const hx = to.x;
  const hy = to.y;

  const bodyWidth = Math.max(2, cellSize * 0.08) * (emphasized ? 1.5 : 1);

  return (
    <G>
      {emphasized ? (
        <Polyline
          fill="none"
          points={points.join(" ")}
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.22}
          strokeWidth={bodyWidth * 2.4}
        />
      ) : null}
      <Polyline
        fill="none"
        points={points.join(" ")}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={emphasized ? 1 : 0.8}
        strokeWidth={bodyWidth}
      />
      <Polygon
        fill={stroke}
        fillOpacity={0.9}
        points={`${hx},${hy} ${hx - ux * headSize + nx * headSize * 0.6},${hy - uy * headSize + ny * headSize * 0.6} ${hx - ux * headSize - nx * headSize * 0.6},${hy - uy * headSize - ny * headSize * 0.6}`}
      />
      <Circle
        cx={hx - ux * headSize * 0.45 + nx * headSize * 0.35}
        cy={hy - uy * headSize * 0.45 + ny * headSize * 0.35}
        fill="#fff"
        r={Math.max(1.5, cellSize * 0.04)}
      />
      <Circle
        cx={hx - ux * headSize * 0.45 - nx * headSize * 0.35}
        cy={hy - uy * headSize * 0.45 - ny * headSize * 0.35}
        fill="#fff"
        r={Math.max(1.5, cellSize * 0.04)}
      />
    </G>
  );
}

function LadderPath({
  from,
  to,
  stroke,
  cellSize,
  emphasized = false,
}: {
  from: Point;
  to: Point;
  stroke: string;
  cellSize: number;
  emphasized?: boolean;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const railGap = cellSize * 0.14;
  const rungCount = Math.max(3, Math.round(dist / (cellSize * 0.55)));
  const strokeWidth = Math.max(1.5, cellSize * 0.05) * (emphasized ? 1.6 : 1);

  return (
    <G>
      {emphasized ? (
        <Line
          stroke={stroke}
          strokeLinecap="round"
          strokeOpacity={0.18}
          strokeWidth={railGap * 3}
          x1={from.x}
          x2={to.x}
          y1={from.y}
          y2={to.y}
        />
      ) : null}
      <Line
        stroke={stroke}
        strokeLinecap="round"
        strokeOpacity={0.85}
        strokeWidth={strokeWidth}
        x1={from.x + nx * railGap}
        x2={to.x + nx * railGap}
        y1={from.y + ny * railGap}
        y2={to.y + ny * railGap}
      />
      <Line
        stroke={stroke}
        strokeLinecap="round"
        strokeOpacity={0.85}
        strokeWidth={strokeWidth}
        x1={from.x - nx * railGap}
        x2={to.x - nx * railGap}
        y1={from.y - ny * railGap}
        y2={to.y - ny * railGap}
      />
      {Array.from({ length: rungCount }, (_, index) => {
        const t = (index + 1) / (rungCount + 1);
        const rx = from.x + dx * t;
        const ry = from.y + dy * t;
        return (
          <Line
            key={`rung-${rx.toFixed(1)}-${ry.toFixed(1)}`}
            stroke={stroke}
            strokeLinecap="round"
            strokeOpacity={0.75}
            strokeWidth={strokeWidth * 0.85}
            x1={rx + nx * railGap}
            x2={rx - nx * railGap}
            y1={ry + ny * railGap}
            y2={ry - ny * railGap}
          />
        );
      })}
    </G>
  );
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
