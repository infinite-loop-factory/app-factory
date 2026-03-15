import type { TrackingModeType } from "@/hooks/location/use-location";

import { useEffect, useId } from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { useThemeStore } from "@/hooks/use-theme.ts";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface LocationMarkerIconProps {
  size?: number;
  trackingMode: TrackingModeType;
  isLoading: boolean;
}

export function LocationMarkerIcon({
  size = 120,
  trackingMode,
  isLoading,
}: LocationMarkerIconProps) {
  const variant = trackingMode === "Face" ? "cone" : "arrow";
  const { currentHex } = useThemeStore();

  const color = currentHex["--color-info-500"];

  const uid = useId();
  const idPrefix = uid.replace(/[^a-zA-Z0-9_-]/g, "_");
  const ids = {
    markerShadow: `${idPrefix}_markerShadow`,
    coneFillGradient: `${idPrefix}_coneFillGradient`,
    coneLineGradient: `${idPrefix}_coneLineGradient`,
    centerGlow: `${idPrefix}_centerGlow`,
  } as const;

  // 치수 계산
  const center = size / 2;
  const markerRadius = 7;
  const coneRadius = 60;
  const coneAngle = 40;
  const coneLineRadius = coneRadius;

  // Path 계산 함수들
  const getConePath = () => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = center + coneRadius * Math.sin(toRad(-coneAngle));
    const y1 = center - coneRadius * Math.cos(toRad(-coneAngle));
    const x2 = center + coneRadius * Math.sin(toRad(coneAngle));
    const y2 = center - coneRadius * Math.cos(toRad(coneAngle));
    return `M ${center} ${center} L ${x1} ${y1} A ${coneRadius} ${coneRadius} 0 0 1 ${x2} ${y2} Z`;
  };

  const getConeLinePath = () => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = center + coneLineRadius * Math.sin(toRad(-coneAngle));
    const y1 = center - coneLineRadius * Math.cos(toRad(-coneAngle));
    const x2 = center + coneLineRadius * Math.sin(toRad(coneAngle));
    const y2 = center - coneLineRadius * Math.cos(toRad(coneAngle));
    return `M ${x1} ${y1} L ${center} ${center} L ${x2} ${y2}`;
  };

  const getSoftArrowPath = () => {
    const tipY = center - 17;
    const baseY = center - 9.5;
    const width = 5;
    return `M ${center} ${tipY} L ${center - width} ${baseY} Q ${center} ${baseY - 2.5} ${center + width} ${baseY} Z`;
  };

  const pulseAnim = useSharedValue(0);

  useEffect(() => {
    if (isLoading) {
      pulseAnim.value = withRepeat(
        withTiming(1, {
          duration: 1500,
          easing: Easing.out(Easing.quad),
        }),
        -1,
        false,
      );
    } else {
      pulseAnim.value = 0;
    }
  }, [isLoading, pulseAnim]);

  const pulseProps = useAnimatedProps(() => {
    return {
      r: interpolate(pulseAnim.value, [0, 1], [7, 25]),
      opacity: interpolate(pulseAnim.value, [0, 1], [0.5, 0]),
      strokeWidth: interpolate(pulseAnim.value, [0, 1], [0, 0]),
    };
  });

  return (
    <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <Defs>
        <RadialGradient cx="50%" cy="50%" id={ids.markerShadow} r="50%">
          <Stop offset="0%" stopColor="black" stopOpacity="0.2" />
          <Stop offset="50%" stopColor="black" stopOpacity="0.05" />
          <Stop offset="100%" stopColor="black" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient cx="50%" cy="50%" id={ids.coneFillGradient} r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="35%" stopColor={color} stopOpacity="0.15" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient
          id={ids.coneLineGradient}
          x1="50%"
          x2="50%"
          y1="55%"
          y2="0%"
        >
          <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <Stop offset="35%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </LinearGradient>
        <RadialGradient cx="50%" cy="50%" id={ids.centerGlow} r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="50%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <G>
        {/* 파동(Ripple) 효과 */}
        {pulseProps && (
          <AnimatedCircle
            animatedProps={pulseProps}
            cx={center}
            cy={center}
            fill={color}
          />
        )}

        {variant === "cone" && (
          <>
            <Path
              d={getConePath()}
              fill={`url(#${ids.coneFillGradient})`}
              stroke="none"
            />
            <Path
              d={getConeLinePath()}
              fill="none"
              stroke={`url(#${ids.coneLineGradient})`}
              strokeLinecap="round"
              strokeWidth={1.5}
            />
          </>
        )}

        {/* 기존 글로우 효과 */}
        {/*<Circle*/}
        {/*  cx={center}*/}
        {/*  cy={center}*/}
        {/*  fill={`url(#${ids.centerGlow})`}*/}
        {/*  r={trackingMode === "Face" ? 20 : 25}*/}
        {/*/>*/}
        {/* 그림자 */}
        <Circle
          cx={center}
          cy={center + 1}
          fill={`url(#${ids.markerShadow})`}
          r={markerRadius + 2}
        />
        {/* 하얀 테두리 메인 원 */}
        <Circle
          cx={center}
          cy={center}
          fill={color}
          r={markerRadius}
          stroke="white"
          strokeWidth={2.5}
        />
        {/* 외곽선 데코 */}
        <Circle
          cx={center}
          cy={center}
          fill="none"
          opacity={0.1}
          r={markerRadius + 1.25 + 0.5}
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1}
        />
        {variant === "arrow" && (
          <>
            <Path
              d={getSoftArrowPath()}
              fill="none"
              stroke="#00000030"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
            <Path
              d={getSoftArrowPath()}
              fill={color}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
          </>
        )}
      </G>
    </Svg>
  );
}
