import type { CraftPalette } from "@/game/constants/palettes";
import type { PlacedQubit } from "@/game/types";

import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Stop,
} from "react-native-svg";
import { cellToVisualCoord, QUBIT_CONFIGS } from "@/game/constants/board";
import { darkenColor, lightenColor } from "@/lib/color";

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

/** Serpentine centerline from the neck (just past the head) to the tail tip. */
function sampleSnakeSpine(
  from: Point,
  to: Point,
  cellSize: number,
  samples = 40,
): Point[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const waves = Math.min(3, Math.max(1.5, dist / (cellSize * 2.4)));
  const amplitude = Math.min(dist * 0.14, cellSize * 0.5);
  const points: Point[] = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    // Envelope pins both ends to the cell centers so head/tail sit on tiles.
    const envelope = Math.sin(Math.PI * Math.min(1, 0.08 + t * 0.92));
    const wave = Math.sin(t * Math.PI * 2 * waves) * amplitude * envelope;
    points.push({
      x: from.x + dx * t + nx * wave,
      y: from.y + dy * t + ny * wave,
    });
  }
  return points;
}

/** Body half-width along the spine: neck → bulge → tapering tail. */
function snakeWidthAt(t: number, cellSize: number): number {
  const neck = cellSize * 0.105;
  const body = cellSize * 0.155;
  const tail = cellSize * 0.012;
  const ramp = Math.sin(Math.min(t / 0.3, 1) * (Math.PI / 2));
  const base = neck + (body - neck) * ramp;
  if (t <= 0.45) return base;
  const k = ((t - 0.45) / 0.55) ** 1.25;
  return base * (1 - k) + tail * k;
}

/** Closed outline path offsetting the spine by the width profile on both sides. */
function snakeBodyPath(spine: Point[], cellSize: number): string {
  const left: string[] = [];
  const right: string[] = [];
  const count = spine.length;

  for (let i = 0; i < count; i += 1) {
    const p = spine[i];
    if (!p) continue;
    const t = i / (count - 1);
    const prev = spine[i - 1] ?? p;
    const next = spine[i + 1] ?? p;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = snakeWidthAt(t, cellSize);
    left.push(`${(p.x + nx * w).toFixed(2)},${(p.y + ny * w).toFixed(2)}`);
    right.push(`${(p.x - nx * w).toFixed(2)},${(p.y - ny * w).toFixed(2)}`);
  }
  right.reverse();
  return `M${left[0]} L${left.slice(1).join(" L")} L${right.join(" L")} Z`;
}

export function SnakePath({
  id,
  from,
  to,
  stroke,
  cellSize,
  emphasized = false,
}: {
  id: string;
  from: Point;
  to: Point;
  stroke: string;
  cellSize: number;
  emphasized?: boolean;
}) {
  const spine = sampleSnakeSpine(from, to, cellSize);
  const bodyPath = snakeBodyPath(spine, cellSize);
  const gradientId = `snake-body-${id}`;

  // Head sits on the source cell, looking back along the first spine segment.
  const neck = spine[2] ?? to;
  let hdx = from.x - neck.x;
  let hdy = from.y - neck.y;
  const hlen = Math.hypot(hdx, hdy) || 1;
  hdx /= hlen;
  hdy /= hlen;
  const hnx = -hdy;
  const hny = hdx;
  const headR = cellSize * 0.19;
  const headCx = from.x + hdx * cellSize * 0.02;
  const headCy = from.y + hdy * cellSize * 0.02;
  const headAngle = (Math.atan2(hdy, hdx) * 180) / Math.PI;

  const eyeOffsetAlong = headR * 0.18;
  const eyeOffsetSide = headR * 0.52;
  const eyeR = Math.max(1.6, cellSize * 0.052);
  const pupilR = Math.max(0.8, eyeR * 0.48);

  const tongueBase = {
    x: headCx + hdx * headR * 1.02,
    y: headCy + hdy * headR * 1.02,
  };
  const tongueTip = {
    x: tongueBase.x + hdx * cellSize * 0.2,
    y: tongueBase.y + hdy * cellSize * 0.2,
  };
  const forkLen = cellSize * 0.09;

  const light = lightenColor(stroke, 0.22);
  const dark = darkenColor(stroke, 0.55);
  const band = darkenColor(stroke, 0.72);
  const belly = lightenColor(stroke, 0.5);

  const shadowDx = cellSize * 0.055;
  const shadowDy = cellSize * 0.09;

  // Scale bands across the back, skipping neck and the thin tail tip.
  const bands = spine
    .map((p, i) => ({ p, i, t: i / (spine.length - 1) }))
    .filter(({ i, t }) => i % 3 === 1 && t > 0.1 && t < 0.82);

  return (
    <G opacity={emphasized ? 1 : 0.96}>
      {emphasized ? (
        <Polyline
          fill="none"
          points={spine.map((p) => `${p.x},${p.y}`).join(" ")}
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.25}
          strokeWidth={cellSize * 0.55}
        />
      ) : null}
      <Defs>
        <LinearGradient
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          x1={from.x}
          x2={to.x}
          y1={from.y}
          y2={to.y}
        >
          <Stop offset="0" stopColor={light} />
          <Stop offset="0.55" stopColor={stroke} />
          <Stop offset="1" stopColor={dark} />
        </LinearGradient>
      </Defs>

      {/* drop shadow */}
      <G x={shadowDx} y={shadowDy}>
        <Path d={bodyPath} fill="#000" fillOpacity={0.16} />
        <Ellipse
          cx={headCx}
          cy={headCy}
          fill="#000"
          fillOpacity={0.16}
          rotation={headAngle}
          rx={headR}
          ry={headR * 0.78}
        />
      </G>

      {/* body */}
      <Path
        d={bodyPath}
        fill={`url(#${gradientId})`}
        stroke={dark}
        strokeOpacity={0.55}
        strokeWidth={Math.max(0.8, cellSize * 0.02)}
      />
      {/* belly highlight */}
      <Polyline
        fill="none"
        points={spine
          .slice(2, Math.floor(spine.length * 0.86))
          .map((p) => `${p.x},${p.y}`)
          .join(" ")}
        stroke={belly}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.5}
        strokeWidth={Math.max(1.2, cellSize * 0.06)}
      />
      {/* scale bands */}
      {bands.map(({ p, i, t }) => {
        const prev = spine[i - 1] ?? p;
        const next = spine[i + 1] ?? p;
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const w = snakeWidthAt(t, cellSize) * 0.74;
        return (
          <Line
            key={`band-${p.x.toFixed(1)}-${p.y.toFixed(1)}`}
            stroke={band}
            strokeLinecap="round"
            strokeOpacity={0.32}
            strokeWidth={Math.max(0.8, cellSize * 0.028)}
            x1={p.x + nx * w}
            x2={p.x - nx * w}
            y1={p.y + ny * w}
            y2={p.y - ny * w}
          />
        );
      })}

      {/* tongue */}
      <Path
        d={`M${tongueBase.x},${tongueBase.y} L${tongueTip.x},${tongueTip.y}`}
        stroke="#d2384a"
        strokeLinecap="round"
        strokeWidth={Math.max(1, cellSize * 0.032)}
      />
      <Path
        d={`M${tongueTip.x},${tongueTip.y} L${tongueTip.x + (hdx * 0.7 + hnx * 0.55) * forkLen},${tongueTip.y + (hdy * 0.7 + hny * 0.55) * forkLen} M${tongueTip.x},${tongueTip.y} L${tongueTip.x + (hdx * 0.7 - hnx * 0.55) * forkLen},${tongueTip.y + (hdy * 0.7 - hny * 0.55) * forkLen}`}
        stroke="#d2384a"
        strokeLinecap="round"
        strokeWidth={Math.max(0.8, cellSize * 0.026)}
      />

      {/* head */}
      <Ellipse
        cx={headCx}
        cy={headCy}
        fill={light}
        rotation={headAngle}
        rx={headR}
        ry={headR * 0.78}
        stroke={dark}
        strokeOpacity={0.5}
        strokeWidth={Math.max(0.8, cellSize * 0.02)}
      />
      <Ellipse
        cx={headCx - hdx * headR * 0.28}
        cy={headCy - hdy * headR * 0.28}
        fill={stroke}
        fillOpacity={0.55}
        rotation={headAngle}
        rx={headR * 0.72}
        ry={headR * 0.56}
      />
      {/* eyes */}
      {[1, -1].map((side) => (
        <G key={`eye-${side}`}>
          <Circle
            cx={headCx + hdx * eyeOffsetAlong + hnx * eyeOffsetSide * side}
            cy={headCy + hdy * eyeOffsetAlong + hny * eyeOffsetSide * side}
            fill="#fffdf5"
            r={eyeR}
            stroke={dark}
            strokeOpacity={0.45}
            strokeWidth={0.6}
          />
          <Circle
            cx={
              headCx +
              hdx * (eyeOffsetAlong + eyeR * 0.28) +
              hnx * eyeOffsetSide * side
            }
            cy={
              headCy +
              hdy * (eyeOffsetAlong + eyeR * 0.28) +
              hny * eyeOffsetSide * side
            }
            fill="#22150f"
            r={pupilR}
          />
        </G>
      ))}
    </G>
  );
}

export function LadderPath({
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
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const nx = -uy;
  const ny = ux;

  const railGap = cellSize * 0.16;
  const overhang = cellSize * 0.16;
  const railDark = darkenColor(stroke, 0.55);
  const railLight = lightenColor(stroke, 0.28);
  const railBaseW = Math.max(2.4, cellSize * 0.085) * (emphasized ? 1.25 : 1);
  const railTopW = railBaseW * 0.52;
  const rungBaseW = Math.max(2, cellSize * 0.068);
  const rungTopW = rungBaseW * 0.5;
  const rungCount = Math.max(3, Math.round(dist / (cellSize * 0.52)));

  const start = { x: from.x - ux * overhang, y: from.y - uy * overhang };
  const end = { x: to.x + ux * overhang, y: to.y + uy * overhang };
  const shadowDx = cellSize * 0.05;
  const shadowDy = cellSize * 0.085;

  const rails = [1, -1].map((side) => ({
    x1: start.x + nx * railGap * side,
    y1: start.y + ny * railGap * side,
    x2: end.x + nx * railGap * side,
    y2: end.y + ny * railGap * side,
    side,
  }));

  const rungs = Array.from({ length: rungCount }, (_, index) => {
    const t = (index + 1) / (rungCount + 1);
    return {
      x: from.x + dx * t,
      y: from.y + dy * t,
    };
  });

  return (
    <G>
      {emphasized ? (
        <Line
          stroke={stroke}
          strokeLinecap="round"
          strokeOpacity={0.22}
          strokeWidth={railGap * 3.4}
          x1={from.x}
          x2={to.x}
          y1={from.y}
          y2={to.y}
        />
      ) : null}

      {/* drop shadow */}
      <G x={shadowDx} y={shadowDy}>
        {rails.map((rail) => (
          <Line
            key={`rail-shadow-${rail.side}`}
            stroke="#000"
            strokeLinecap="round"
            strokeOpacity={0.15}
            strokeWidth={railBaseW}
            x1={rail.x1}
            x2={rail.x2}
            y1={rail.y1}
            y2={rail.y2}
          />
        ))}
      </G>

      {/* rungs sit behind the rails */}
      {rungs.map((rung) => (
        <G key={`rung-${rung.x.toFixed(1)}-${rung.y.toFixed(1)}`}>
          <Line
            stroke={railDark}
            strokeLinecap="round"
            strokeWidth={rungBaseW}
            x1={rung.x + nx * railGap}
            x2={rung.x - nx * railGap}
            y1={rung.y + ny * railGap}
            y2={rung.y - ny * railGap}
          />
          <Line
            stroke={railLight}
            strokeLinecap="round"
            strokeOpacity={0.85}
            strokeWidth={rungTopW}
            x1={rung.x + nx * railGap * 0.92}
            x2={rung.x - nx * railGap * 0.92}
            y1={rung.y + ny * railGap * 0.92}
            y2={rung.y - ny * railGap * 0.92}
          />
        </G>
      ))}

      {/* rails: dark base + light face reads as beveled wood */}
      {rails.map((rail) => (
        <G key={`rail-${rail.side}`}>
          <Line
            stroke={railDark}
            strokeLinecap="round"
            strokeWidth={railBaseW}
            x1={rail.x1}
            x2={rail.x2}
            y1={rail.y1}
            y2={rail.y2}
          />
          <Line
            stroke={railLight}
            strokeLinecap="round"
            strokeOpacity={0.9}
            strokeWidth={railTopW}
            x1={rail.x1}
            x2={rail.x2}
            y1={rail.y1}
            y2={rail.y2}
          />
        </G>
      ))}

      {/* post caps anchor the ladder ends */}
      {rails.flatMap((rail) => [
        <Circle
          cx={rail.x1}
          cy={rail.y1}
          fill={railDark}
          key={`cap-start-${rail.side}`}
          r={railBaseW * 0.62}
        />,
        <Circle
          cx={rail.x2}
          cy={rail.y2}
          fill={railDark}
          key={`cap-end-${rail.side}`}
          r={railBaseW * 0.62}
        />,
      ])}
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
