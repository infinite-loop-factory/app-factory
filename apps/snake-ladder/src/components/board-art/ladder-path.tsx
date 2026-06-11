import type { Point } from "@/components/board-art/snake-path";

import { Circle, G, Line } from "react-native-svg";
import { darkenColor, lightenColor } from "@/lib/color";

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

  const railGap = cellSize * 0.19;
  const overhang = cellSize * 0.18;
  const railDark = darkenColor(stroke, 0.55);
  const railLight = lightenColor(stroke, 0.28);
  const railBaseW = Math.max(2.8, cellSize * 0.105) * (emphasized ? 1.25 : 1);
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
          {/* joint bolts where the rung meets each rail */}
          {[1, -1].map((side) => (
            <Circle
              cx={rung.x + nx * railGap * side}
              cy={rung.y + ny * railGap * side}
              fill={darkenColor(stroke, 0.4)}
              key={`bolt-${side}`}
              r={rungBaseW * 0.42}
            />
          ))}
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
