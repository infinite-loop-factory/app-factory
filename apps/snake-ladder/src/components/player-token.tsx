import type { CraftPalette } from "@/game/constants/palettes";
import type { GameState } from "@/game/types";

import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { cellToVisualCoord } from "@/game/constants/board";

const FOLLOW_SPRING = {
  damping: 22,
  stiffness: 380,
  mass: 0.65,
} as const;

const LAND_SPRING = {
  damping: 14,
  stiffness: 300,
  mass: 0.7,
} as const;

type PlayerTokenProps = {
  player: 0 | 1;
  cell: number;
  cellSize: number;
  palette: CraftPalette;
  isActive: boolean;
  lifted: boolean;
  overlapped: boolean;
  reducedMotion: boolean;
};

function tokenTarget(
  player: 0 | 1,
  cell: number,
  cellSize: number,
  overlapped: boolean,
  size: number,
): { x: number; y: number } {
  const { col, row } = cellToVisualCoord(cell);
  const shift = overlapped ? cellSize * 0.13 : 0;
  const dir = player === 0 ? -1 : 1;
  return {
    x: col * cellSize + (cellSize - size) / 2 + shift * dir,
    y: row * cellSize + (cellSize - size) / 2 + shift * dir,
  };
}

function TokenGlow({
  size,
  color,
  active,
  reducedMotion,
}: {
  size: number;
  color: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!active || reducedMotion) {
      cancelAnimation(pulse);
      pulse.set(0);
      return;
    }
    pulse.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(pulse);
  }, [active, pulse, reducedMotion]);

  const style = useAnimatedStyle(() => {
    const t = pulse.get();
    return {
      opacity: active ? (1 - t) * 0.45 : 0,
      transform: [{ scale: 1 + t * 0.55 }],
    };
  });

  if (!active) return null;
  if (reducedMotion) {
    return (
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: `${color}66`,
        }}
      />
    );
  }
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: 999,
          backgroundColor: `${color}55`,
        },
        style,
      ]}
    />
  );
}

export function PlayerToken({
  player,
  cell,
  cellSize,
  palette,
  isActive,
  lifted,
  overlapped,
  reducedMotion,
}: PlayerTokenProps) {
  const size = player === 0 ? cellSize * 0.46 : cellSize * 0.4;
  const color = player === 0 ? palette.playerYou : palette.playerCpu;
  const target = tokenTarget(player, cell, cellSize, overlapped, size);

  const x = useSharedValue(target.x);
  const y = useSharedValue(target.y);
  const hopY = useSharedValue(0);
  const liftY = useSharedValue(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      x.set(target.x);
      y.set(target.y);
      return;
    }
    if (!mountedRef.current) {
      mountedRef.current = true;
      x.set(target.x);
      y.set(target.y);
      return;
    }
    x.set(withSpring(target.x, FOLLOW_SPRING));
    y.set(withSpring(target.y, FOLLOW_SPRING));
    hopY.set(
      withSequence(
        withTiming(-cellSize * 0.22, {
          duration: 70,
          easing: Easing.out(Easing.quad),
        }),
        withSpring(0, LAND_SPRING),
      ),
    );
  }, [cellSize, hopY, reducedMotion, target.x, target.y, x, y]);

  useEffect(() => {
    const liftTarget = lifted ? -cellSize * 0.3 : 0;
    if (reducedMotion) {
      liftY.set(liftTarget);
      return;
    }
    liftY.set(withSpring(liftTarget, LAND_SPRING));
  }, [cellSize, lifted, liftY, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() + hopY.get() + liftY.get() },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          zIndex: player === 0 ? 11 : 10,
        },
        style,
      ]}
      testID={`player-token-${player}`}
    >
      <TokenGlow
        active={isActive}
        color={color}
        reducedMotion={reducedMotion}
        size={size * 1.5}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: palette.card,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      />
    </Animated.View>
  );
}

type PlayerTokenLayerProps = {
  state: GameState;
  cellSize: number;
  palette: CraftPalette;
  reducedMotion: boolean;
};

export function PlayerTokenLayer({
  state,
  cellSize,
  palette,
  reducedMotion,
}: PlayerTokenLayerProps) {
  const overlapped = state.positions[0] === state.positions[1];
  const playing = state.phase === "play" && !state.gameOver;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      {([0, 1] as const).map((player) => (
        <PlayerToken
          cell={state.positions[player]}
          cellSize={cellSize}
          isActive={playing && state.currentPlayer === player}
          key={`token-${player}`}
          lifted={state.overshootPlayer === player}
          overlapped={overlapped}
          palette={palette}
          player={player}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
}
