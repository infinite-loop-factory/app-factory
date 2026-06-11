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
  flutter: number;
  delay: number;
  originX: number;
  originY: number;
};

// Two cannons (bottom-left, bottom-right) each fire two volleys aimed at the
// upper center of the screen — a "pop! pop!" victory salute, not a sprinkle.
const PER_VOLLEY = 24;
const VOLLEY_DELAYS_MS = [0, 280];
const GRAVITY = 1150;
const FLIGHT_MS = 2400;

function buildParticles(
  width: number,
  height: number,
  colors: string[],
): ParticleSpec[] {
  const specs: ParticleSpec[] = [];
  for (const side of [-1, 1] as const) {
    const originX = side === -1 ? -width * 0.02 : width * 1.02;
    const originY = height * 0.86;
    VOLLEY_DELAYS_MS.forEach((volleyDelay, volley) => {
      for (let k = 0; k < PER_VOLLEY; k++) {
        // Aim each piece at a jittered point in the upper center, then solve
        // the launch velocity that reaches it at tPeak under gravity.
        const targetX = width * (0.5 + (Math.random() - 0.5) * 0.5);
        const targetY = height * (0.14 + Math.random() * 0.24);
        const tPeak = 0.5 + Math.random() * 0.2;
        const jitter = 0.8 + Math.random() * 0.35;
        specs.push({
          id: `confetti-${side}-${volley}-${k}`,
          color: colors[specs.length % colors.length] ?? "#c9a227",
          width: 7 + (k % 4) * 2,
          height: 12 + (k % 3) * 3,
          vx: ((targetX - originX) / tPeak) * jitter,
          vy: ((targetY - originY) / tPeak - 0.5 * GRAVITY * tPeak) * jitter,
          gravity: GRAVITY,
          spin: (Math.random() - 0.5) * 900,
          flutter: (Math.random() - 0.5) * 800,
          delay: volleyDelay + Math.random() * 90,
          originX,
          originY,
        });
      }
    });
  }
  return specs;
}

function ConfettiParticle({
  spec,
  active,
}: {
  spec: ParticleSpec;
  active: boolean;
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
          duration: FLIGHT_MS,
          easing: Easing.out(Easing.quad),
        }),
      ),
    );
  }, [active, progress, spec.delay]);

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
      opacity: interpolate(progress.get(), [0, 0.05, 0.78, 1], [0, 1, 1, 0]),
      transform: [
        { rotate: `${spec.spin * t}deg` },
        { rotateX: `${spec.flutter * t}deg` },
      ],
    };
  });

  if (!active) return null;
  return <Animated.View pointerEvents="none" style={style} />;
}

export function ConfettiBurst({ active, colors }: ConfettiBurstProps) {
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
        <ConfettiParticle active={active} key={spec.id} spec={spec} />
      ))}
    </View>
  );
}
