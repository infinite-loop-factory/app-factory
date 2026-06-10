import { useEffect, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type ConfettiBurstProps = {
  active: boolean;
  colors: string[];
  reducedMotion?: boolean;
};

type ParticleSpec = {
  id: string;
  color: string;
  width: number;
  height: number;
  vx: number;
  vy: number;
  gravity: number;
  spin: number;
  delay: number;
  originX: number;
  originY: number;
};

const PARTICLE_COUNT = 52;
const FLIGHT_MS = 2200;

function buildParticles(
  width: number,
  height: number,
  colors: string[],
): ParticleSpec[] {
  const originX = width * 0.5;
  const originY = height * 0.72;
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const spread = (index / PARTICLE_COUNT - 0.5) * 2;
    return {
      id: `confetti-${index}`,
      color: colors[index % colors.length] ?? colors[0] ?? "#c9a227",
      width: 6 + (index % 4) * 2,
      height: 10 + (index % 3) * 3,
      vx: spread * 220 + (Math.random() - 0.5) * 80,
      vy: -320 - Math.random() * 180,
      gravity: 920,
      spin: (Math.random() - 0.5) * 720,
      delay: Math.random() * 120,
      originX,
      originY,
    };
  });
}

function ConfettiParticle({
  spec,
  active,
  reducedMotion,
}: {
  spec: ParticleSpec;
  active: boolean;
  reducedMotion: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      progress.set(0);
      return;
    }
    progress.set(
      withDelay(
        spec.delay,
        withTiming(1, {
          duration: reducedMotion ? FLIGHT_MS * 0.6 : FLIGHT_MS,
          easing: Easing.out(Easing.quad),
        }),
      ),
    );
  }, [active, progress, reducedMotion, spec.delay]);

  const style = useAnimatedStyle(() => {
    const t = progress.get() * (FLIGHT_MS / 1000);
    const x = spec.originX + spec.vx * t;
    const y = spec.originY + spec.vy * t + 0.5 * spec.gravity * t * t;
    return {
      position: "absolute",
      left: x - spec.width / 2,
      top: y - spec.height / 2,
      width: spec.width,
      height: spec.height,
      backgroundColor: spec.color,
      borderRadius: 2,
      opacity: interpolate(progress.get(), [0, 0.75, 1], [1, 1, 0]),
      transform: [{ rotate: `${spec.spin * t}deg` }],
    };
  });

  if (!active) return null;
  return <Animated.View pointerEvents="none" style={style} />;
}

export function ConfettiBurst({
  active,
  colors,
  reducedMotion = false,
}: ConfettiBurstProps) {
  const { width, height } = useWindowDimensions();
  const particles = useMemo(
    () => buildParticles(width, height, colors),
    [colors, height, width],
  );

  if (!active) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      {particles.map((spec) => (
        <ConfettiParticle
          active={active}
          key={spec.id}
          reducedMotion={reducedMotion}
          spec={spec}
        />
      ))}
    </View>
  );
}
