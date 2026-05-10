import { useEffect, useId } from "react";
import Animated, {
  Easing,
  type SharedValue,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useThemeColors, withAlpha } from "@/hooks/use-theme-colors";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const GLASS_BODY = "M8 6h24l-2 36a4 4 0 0 1-4 3.6h-12a4 4 0 0 1-4-3.6L8 6z";
const TOP_Y = 9;
const BOTTOM_Y = 43;
const FILL_DURATION = 280;
const WAVE_PERIOD = 2400;
const WAVE_AMPLITUDE = 1.2;

export type GlassVesselProps = {
  /** 0..1 portion full */
  fill: number;
  /** Visual width in px (height = size * 1.3 to match viewBox 40×52) */
  size?: number;
  /** Run wave animation when partially filled. Caller may force off. */
  animate?: boolean;
  /**
   * Optional shared sinusoidal phase. When provided, the vessel uses this
   * external phase instead of running its own — lets a parent batch many
   * glasses on a single rAF for visual sync + perf.
   */
  phase?: SharedValue<number>;
};

/**
 * Liquid-fill whisky-glass vessel SVG.
 *
 * Algorithm ported from the Phase 1 Claude Design handoff
 * (`docs/design/Sip Note — Design System/score-glasses.jsx`):
 * - Glass body clipped path (viewBox 40×52)
 * - Liquid surface y = bottom - (bottom-top) * fill, animated with withTiming
 * - Sinusoidal wave on the surface, animated via shared phase
 *
 * Reduced-motion: wave disabled, fill snaps to value.
 */
export function GlassVessel({
  fill,
  size = 44,
  animate = true,
  phase,
}: GlassVesselProps) {
  const id = useId();
  const c = useThemeColors();
  const reduce = useReducedMotion();
  const partial = fill > 0 && fill < 1;
  const wavy = animate && !reduce && partial;

  const targetY =
    BOTTOM_Y - (BOTTOM_Y - TOP_Y) * Math.max(0, Math.min(1, fill));
  const y = useDerivedValue(
    () => withTiming(targetY, { duration: reduce ? 0 : FILL_DURATION }),
    [targetY, reduce],
  );

  const localPhase = useSharedValue(0);
  useEffect(() => {
    if (!wavy || phase) return;
    localPhase.value = 0;
    localPhase.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: WAVE_PERIOD,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [wavy, phase, localPhase]);
  const p = phase ?? localPhase;

  const waveProps = useAnimatedProps(() => {
    const yy = y.value;
    const dy = wavy ? Math.sin(p.value) * WAVE_AMPLITUDE : 0;
    return {
      d: `M-10 ${yy} Q 5 ${yy + dy} 20 ${yy} T 50 ${yy} L 50 52 L -10 52 Z`,
    };
  });

  const rectProps = useAnimatedProps(() => ({
    y: y.value,
    height: 52 - y.value,
  }));

  const highlightProps = useAnimatedProps(() => ({ cy: y.value }));

  const stroke = c.brand;
  const fillGradId = `gv-grad-${id}`;
  const clipId = `gv-clip-${id}`;

  return (
    <Svg
      accessibilityElementsHidden
      height={size * 1.3}
      importantForAccessibility="no-hide-descendants"
      viewBox="0 0 40 52"
      width={size}
    >
      <Defs>
        <LinearGradient id={fillGradId} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor={c.brand} stopOpacity={0.95} />
          <Stop offset="100%" stopColor={c.brandStrong} stopOpacity={1} />
        </LinearGradient>
        <ClipPath id={clipId}>
          <Path d={GLASS_BODY} />
        </ClipPath>
      </Defs>

      <Path
        d={GLASS_BODY}
        fill="none"
        stroke={stroke}
        strokeLinejoin="round"
        strokeOpacity={0.35}
        strokeWidth={1.4}
      />

      {fill > 0 && (
        <G clipPath={`url(#${clipId})`}>
          <AnimatedRect
            animatedProps={rectProps}
            fill={`url(#${fillGradId})`}
            width={40}
            x={0}
          />
          <AnimatedPath
            animatedProps={waveProps}
            fill={`url(#${fillGradId})`}
            opacity={0.85}
          />
          <AnimatedEllipse
            animatedProps={highlightProps}
            cx={20}
            fill={c.brand}
            opacity={0.5}
            rx={14}
            ry={1.2}
          />
        </G>
      )}

      <Path
        d="M11 16h18"
        stroke={c.brand}
        strokeLinecap="round"
        strokeOpacity={0.18}
        strokeWidth={1}
      />
      <Path
        d="M11 8v32"
        stroke={withAlpha("#FFFFFF", 0.12)}
        strokeLinecap="round"
        strokeWidth={1}
      />
    </Svg>
  );
}
