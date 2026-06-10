import {
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
import { darkenColor, lightenColor } from "@/lib/color";

export type Point = { x: number; y: number };

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
