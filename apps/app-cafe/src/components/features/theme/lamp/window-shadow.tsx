import { BlurMask, Canvas, Group, Line, vec } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { interpolate, useDerivedValue } from "react-native-reanimated";
import {
  type SunStoreState,
  useSunStore,
} from "@/hooks/sun-drive/use-sun-drive";

interface WindowShadowProps {
  isDark: boolean;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const SKEW_X = 10 * (Math.PI / 180);
const ROTATE = 15 * (Math.PI / 180);
const SCALE = 1.2;
const SHADOW_BASE_COLOR = "rgba(50, 40, 30, 0.32)";
const STROKE_WIDTH = 33;

export const WindowShadow = ({ isDark }: WindowShadowProps) => {
  const intensity = useSunStore((s: SunStoreState) => s.intensity);
  const movementX = useSunStore((s: SunStoreState) => s.movementX);

  const coords = useMemo(
    () => ({
      origin: vec(SCREEN_W / 2, SCREEN_H / 2),
      longStart: -SCREEN_W * 1.5,
      longEnd: SCREEN_W * 2.5,
      vLineX: SCREEN_W * 0.45,
      hLineY: SCREEN_H * 0.4,
    }),
    [],
  );

  // 1. 투명도 동기화
  // 빛이 없으면(0) 그림자도 없음(0)
  // 빛이 강하면(1) 그림자도 제일 진함(1)
  const currentOpacity = useDerivedValue(() => {
    // isDark면 아예 안 보임
    if (isDark) return 0;

    // intensity 곡선: 빛이 서서히 켜질 때 그림자도 서서히 등장
    const v = intensity.value;

    // 빛이 너무 약할 땐(0.05 미만) 그림자 표시 안 함 (깔끔하게)
    if (v < 0.05) return 0;

    // 약간의 곡선(Math.pow)을 줘서 빛보다 살짝 늦게 진해지는 느낌 (자연스러움)
    return interpolate(v ** 1.5, [0, 1], [0, 0.8]);
  });

  // 2. 블러(선명도) 동기화
  // 물리 법칙: 광원이 강할수록(intensity 높음) -> 그림자는 선명해짐(blur 낮음)
  // 광원이 약할수록 -> 그림자는 흐릿해짐
  const currentBlur = useDerivedValue(() => {
    return interpolate(intensity.value, [0, 1], [40, 4]);
  });

  // 3. 위치 움직임 동기화
  // GodRays가 movementX에 따라 움직이듯, 그림자도 살짝 반대 or 같은 방향으로 움직임
  const currentTransform = useDerivedValue(() => {
    // GodRays가 0.04 배율이었으니, 그림자는 그와 비슷하게 맞춤
    const drift = movementX.value * 0.05;

    return [
      { translateX: -20 + drift }, // 드라이브 움직임 반영
      { scale: SCALE },
      { rotate: ROTATE },
      { skewX: SKEW_X },
    ];
  });

  // 완전히 어둡거나 투명도가 0이면 렌더링 안 함 (성능 최적화)
  if (isDark) return null;

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Group
          blendMode="multiply"
          opacity={currentOpacity}
          origin={coords.origin}
          transform={currentTransform}
        >
          {/* 블러 값도 실시간 연동 */}
          <BlurMask blur={currentBlur} style="normal" />

          <Group
            color={SHADOW_BASE_COLOR}
            strokeWidth={STROKE_WIDTH}
            style="stroke"
          >
            <Line
              p1={vec(coords.longStart, coords.hLineY)}
              p2={vec(coords.longEnd, coords.hLineY)}
              strokeWidth={STROKE_WIDTH * 1.05}
            />
            <Line
              p1={vec(coords.vLineX, -SCREEN_H)}
              p2={vec(coords.vLineX, SCREEN_H * 2)}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -120,
    left: -20,
    width: SCREEN_W * 2,
    height: SCREEN_H * 2,
    zIndex: 100,
    pointerEvents: "none",
  },
  canvas: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
