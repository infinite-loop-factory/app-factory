import {
  BlurMask,
  Canvas,
  Circle,
  type ClipDef,
  Group,
  Path,
  RadialGradient,
  Skia,
  type SkPath,
  type Transforms3d,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Easing,
  interpolate,
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  type SunStoreState,
  useSunStore,
} from "@/hooks/sun-drive/use-sun-drive";

interface Props {
  isDark: boolean;
  windowGlowX?: number;
  windowGlowY?: number;
}

const { width: SCREEN_W } = Dimensions.get("window");

const WINDOW_GLOW_X_DEFAULT = SCREEN_W - 69;
const WINDOW_GLOW_Y_DEFAULT = 84;

const OFF_DEADZONE = 0.03;
const BRIGHT_BOOST = 3.4;
const SPARKLE_COUNT = 8;
const SPARKLE_MIN_R = 10;
const SPARKLE_MAX_R = 75;

const SPREAD_POWER = 14.0;
const INTENSITY_POWER = 5.5;

type SparkleSeed = {
  angle: number;
  maxDist: number;
  scaleMax: number;
  phase: number;
  speed: number;
  activationThreshold: number;
};

const clamp01 = (v: number) => {
  "worklet";
  return Math.min(1, Math.max(0, v));
};

export const DOT_DIAMETER = 2.5;

let cachedElegantStarPath: SkPath | null = null;

export const getElegantStarPath = () => {
  if (cachedElegantStarPath) {
    return cachedElegantStarPath;
  }

  const d = DOT_DIAMETER;
  const r = d / 2;
  const path = Skia.Path.Make();
  path.addCircle(0, 0, r);
  cachedElegantStarPath = path;
  return path;
};

const DynamicSparkle = React.memo(function DynamicSparkle(props: {
  d: SparkleSeed;
  t: SharedValue<number>;
  movementX: SharedValue<number>;
  sunDust: ReturnType<typeof useDerivedValue<number>>;
  spreadDriver: ReturnType<typeof useDerivedValue<number>>;
}) {
  const { d, t, movementX, sunDust, spreadDriver } = props;

  const animProgress = useDerivedValue(() => {
    const val = Math.sin(t.value * d.speed + d.phase);
    return 0.4 + (val + 1) * 0.3;
  });

  const strictPower = useDerivedValue(() => {
    const v = sunDust.value;
    if (v < d.activationThreshold) return 0;
    return (v - d.activationThreshold) / (1 - d.activationThreshold);
  });

  const transform = useDerivedValue(() => {
    const power = strictPower.value;
    if (power <= 0.001) return [{ scale: 0 }];

    const driftX = movementX.value * 0.03;
    const spreadProgress = spreadDriver.value;
    const currentR =
      SPARKLE_MIN_R + (d.maxDist - SPARKLE_MIN_R) * spreadProgress;

    const x = Math.cos(d.angle) * currentR + driftX;
    const y = Math.sin(d.angle) * currentR;

    const currentScale = animProgress.value * d.scaleMax;
    const finalScale = power * currentScale;

    return [{ translate: [x, y] }, { scale: finalScale }];
  });

  const opacity = useDerivedValue(() => strictPower.value * 2);

  return (
    <Group opacity={opacity} transform={transform as unknown as Transforms3d}>
      <Group>
        <Path
          color="rgba(255, 235, 140, 1)"
          path={getElegantStarPath()}
          style="fill"
        />
        <BlurMask blur={4} style="normal" />
      </Group>

      <Path
        color="rgba(255, 250, 235, 1.0)"
        path={getElegantStarPath()}
        style="fill"
      />
    </Group>
  );
});

export const CleanGodRays = React.memo(function CleanGodRays({
  isDark,
  windowGlowX,
  windowGlowY,
}: Props) {
  const intensity = useSunStore((s: SunStoreState) => s.intensity);
  const movementX = useSunStore((s: SunStoreState) => s.movementX);

  const X = windowGlowX ?? WINDOW_GLOW_X_DEFAULT;
  const Y = windowGlowY ?? WINDOW_GLOW_Y_DEFAULT;

  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [t]);

  const sparkles = useMemo<SparkleSeed[]>(() => {
    let s = 999;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
      angle: (i * (Math.PI * 2)) / SPARKLE_COUNT + rand() * 0.6,
      maxDist: SPARKLE_MIN_R + rand() * (SPARKLE_MAX_R - SPARKLE_MIN_R),
      scaleMax: 0.7 + rand() * 0.6,
      phase: rand() * Math.PI * 2,
      speed: 0.8 + rand(),
      activationThreshold: 0.1 + (i / SPARKLE_COUNT) * 0.5,
    }));
  }, []);

  const sunValues = useDerivedValue(() => {
    const v = clamp01(intensity.value);
    const sunRaw = clamp01((v - OFF_DEADZONE) / (1 - OFF_DEADZONE));
    const sunVisual = sunRaw ** INTENSITY_POWER;
    const sunSpread = sunRaw ** SPREAD_POWER;
    const baseR = interpolate(sunVisual, [0, 1], [54, 74]);
    const unifiedR = baseR * 1.52;
    const groupR = unifiedR + 150;
    const unifiedOpacity = (0.1 + 0.9 * sunVisual) * BRIGHT_BOOST;
    const unifiedBlur = interpolate(sunVisual, [0, 1], [12, 34]);
    const punchR = interpolate(sunVisual, [0, 1], [9, 14]);
    const punchOpacity = interpolate(sunVisual, [0, 1], [0.25, 1.9]);
    const punchBlur = interpolate(sunVisual, [0, 1], [10, 24]);
    return {
      sunVisual,
      sunSpread,
      unifiedR,
      groupR,
      unifiedOpacity,
      unifiedBlur,
      punchR,
      punchOpacity,
      punchBlur,
    };
  });

  const sunVisual = useDerivedValue(() => sunValues.value.sunVisual);
  const sunSpread = useDerivedValue(() => sunValues.value.sunSpread);
  const unifiedR = useDerivedValue(() => sunValues.value.unifiedR);
  const groupDerivedValue = useDerivedValue(() => sunValues.value.groupR);
  const unifiedOpacity = useDerivedValue(() => sunValues.value.unifiedOpacity);
  const unifiedBlur = useDerivedValue(() => sunValues.value.unifiedBlur);
  const punchR = useDerivedValue(() => sunValues.value.punchR);
  const punchOpacity = useDerivedValue(() => sunValues.value.punchOpacity);
  const punchBlur = useDerivedValue(() => sunValues.value.punchBlur);

  const skiaTransform = useDerivedValue(() => [
    { translate: [X + movementX.value * 0.04, Y] as const },
  ]);

  if (isDark) return null;

  return (
    <View collapsable={false} pointerEvents="none" style={styles.fullScreen}>
      <Canvas style={styles.canvas}>
        <Group blendMode="screen" transform={skiaTransform}>
          <Group
            clip={
              (
                <Circle cx={0} cy={0} r={groupDerivedValue} />
              ) as unknown as ClipDef
            }
          >
            <Circle cx={0} cy={0} opacity={unifiedOpacity} r={unifiedR}>
              <RadialGradient
                c={vec(0, 0)}
                colors={[
                  "rgba(255,253,240,1.0)",
                  "rgba(255,250,235,0.96)",
                  "rgba(255,248,230,0.88)",
                  "rgba(255,245,220,0.7)",
                  "rgba(255,242,210,0.46)",
                  "rgba(255,240,200,0.3)",
                  "rgba(255,238,195,0.18)",
                  "rgba(255,236,190,0.1)",
                  "rgba(255,236,190,0.05)",
                  "rgba(255,236,190,0.0)",
                ]}
                positions={[0, 0.02, 0.05, 0.1, 0.18, 0.3, 0.46, 0.64, 0.8, 1]}
                r={unifiedR}
              />
              <BlurMask blur={unifiedBlur} style="normal" />
            </Circle>
            <Group blendMode="screen">
              <Circle cx={0} cy={0} opacity={punchOpacity} r={punchR}>
                <RadialGradient
                  c={vec(0, 0)}
                  colors={["rgba(255,252,245,1.0)", "rgba(255,252,245,0.0)"]}
                  positions={[0, 1]}
                  r={punchR}
                />
                <BlurMask blur={punchBlur} style="normal" />
              </Circle>
            </Group>
            <Group>
              {sparkles.map((d, i) => (
                <DynamicSparkle
                  d={d}
                  key={String(i)}
                  movementX={movementX}
                  spreadDriver={sunSpread}
                  sunDust={sunVisual}
                  t={t}
                />
              ))}
            </Group>
          </Group>
        </Group>
      </Canvas>
    </View>
  );
});

const styles = StyleSheet.create({
  fullScreen: { ...StyleSheet.absoluteFillObject, zIndex: -1, elevation: 1 },
  canvas: { ...StyleSheet.absoluteFillObject },
});
