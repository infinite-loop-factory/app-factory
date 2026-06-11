import type { BoardFxKind } from "@/components/board-fx";
import type { CraftPalette } from "@/game/constants/palettes";

import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { cellToVisualCoord } from "@/game/constants/board";

type SlideTrailProps = {
  fromCell: number;
  toCell: number;
  kind: BoardFxKind;
  cellSize: number;
  palette: CraftPalette;
};

const DOTS = 12;
const DOT_STAGGER_MS = 42;
const DOT_LIFE_MS = 540;

/** Deterministic per-dot jitter so the trail isn't a sterile straight line. */
function jitter(index: number, scale: number): number {
  return Math.sin(index * 12.9898) * scale;
}

function TrailDot({
  x,
  y,
  size,
  color,
  delay,
  driftY,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  driftY: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withDelay(
        delay,
        withTiming(1, {
          duration: DOT_LIFE_MS,
          easing: Easing.out(Easing.quad),
        }),
      ),
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    const bell = Math.sin(Math.PI * p);
    return {
      opacity: bell * 0.85,
      transform: [{ translateY: driftY * p }, { scale: 0.4 + bell * 0.8 }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/**
 * Energy traveling along a snake/ladder path while the token slides:
 * golden sparks climbing for ladders, snake-colored dust sinking for bites.
 * Remount per traversal (key by the slide tick) to replay.
 */
export function SlideTrail({
  fromCell,
  toCell,
  kind,
  cellSize,
  palette,
}: SlideTrailProps) {
  const from = cellToVisualCoord(fromCell);
  const to = cellToVisualCoord(toCell);
  const ax = (from.col + 0.5) * cellSize;
  const ay = (from.row + 0.5) * cellSize;
  const bx = (to.col + 0.5) * cellSize;
  const by = (to.row + 0.5) * cellSize;

  const color = kind === "ladder" ? palette.orbGlow : palette.snake;
  const driftY = (kind === "ladder" ? -1 : 1) * cellSize * 0.5;

  return (
    <>
      {Array.from({ length: DOTS }, (_, i) => {
        const t = i / (DOTS - 1);
        return (
          <TrailDot
            color={color}
            delay={i * DOT_STAGGER_MS}
            driftY={driftY}
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static dot array, never reordered
            key={`trail-${i}`}
            size={cellSize * (0.14 + (i % 3) * 0.05)}
            x={ax + (bx - ax) * t + jitter(i, cellSize * 0.18)}
            y={ay + (by - ay) * t + jitter(i + 7, cellSize * 0.12)}
          />
        );
      })}
    </>
  );
}
