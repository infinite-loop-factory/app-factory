import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { memo, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type CloudVariant = "A" | "B" | "C";

interface CloudProps {
  isMorning: boolean;
  type: CloudVariant;
  x?: number;
  y?: number;
  zIndex?: number;
}

// ☁️ 구름 설정 (속도와 딜레이 정밀 튜닝)
const CLOUD_CONFIG = {
  // [Type A: 메인 구름] - 묵직하고 천천히
  A: {
    width: 14,
    height: 8,
    opacity: 0.9,
    circles: [
      { cx: 3.5, cy: 5, r: 2.2 },
      { cx: 7, cy: 4, r: 3.0 },
      { cx: 10.5, cy: 5, r: 2.0 },
    ],
    // 25초 동안 이동 (느림), 1초 뒤 출발
    anim: { duration: 25000, delay: 1000, bobSpeed: 3000 },
  },

  // [Type B: 중간 구름] - ✅ 살짝 빠름 (포인트)
  B: {
    width: 10,
    height: 6,
    opacity: 0.8,
    circles: [
      { cx: 3, cy: 3.5, r: 2.2 },
      { cx: 6.5, cy: 3.5, r: 2.5 },
    ],
    // 18초 동안 이동 (상대적으로 빠름), 바로 출발 (0초 딜레이)
    anim: { duration: 18000, delay: 0, bobSpeed: 2000 },
  },

  // [Type C: 배경 구름] - 아주 천천히 흘러감
  C: {
    width: 12,
    height: 7,
    opacity: 0.7,
    circles: [
      { cx: 3.5, cy: 3.5, r: 2.5 },
      { cx: 7.5, cy: 4.0, r: 2.0 },
    ],
    anim: { duration: 35000, delay: 5000, bobSpeed: 4000 },
  },
};

export const Cloud = memo(
  ({ isMorning, type, x = 0, y = 0, zIndex }: CloudProps) => {
    const config = CLOUD_CONFIG[type];

    const appearanceProbability = { A: 1.0, B: 0.9, C: 0.8 };

    // 애니메이션 값
    const opacityVal = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
      // 1. ✨ 투명도 (등장)
      // 설정된 delay만큼 기다렸다가 3초 동안 서서히 나타남
      opacityVal.value = withDelay(
        config.anim.delay,
        withTiming(config.opacity, { duration: 3000 }),
      );

      // 2. ➡️ 좌우 이동 (Seamless Loop)
      // - 처음에는 중간(0)에서 오른쪽 끝(60)으로 이동
      // - 그 뒤로는 왼쪽 끝(-60)에서 오른쪽 끝(60)으로 무한 반복
      const moveAnimation = withSequence(
        // Phase 1: 첫 등장 (중앙 -> 오른쪽 끝)
        // 절반 거리(60)이므로 시간도 절반만 사용 -> 속도 일정 유지
        withTiming(60, {
          duration: config.anim.duration / 2,
          easing: Easing.linear,
        }),

        // Phase 2: 무한 루프 (왼쪽 끝 -> 오른쪽 끝)
        withRepeat(
          withSequence(
            withTiming(-60, { duration: 0 }), // 순간이동
            withTiming(60, {
              duration: config.anim.duration, // 전체 시간
              easing: Easing.linear,
            }),
          ),
          -1, // 무한 반복
          false,
        ),
      );

      // 이동 시작 딜레이 적용
      translateX.value = withDelay(config.anim.delay, moveAnimation);

      // 3. ☁️ 위아래 둥실둥실
      translateY.value = withRepeat(
        withTiming(2, {
          duration: config.anim.bobSpeed,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
    }, [opacityVal, config, translateX, translateY]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacityVal.value,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
        zIndex,
      };
    });

    if (!isMorning) return null;
    if (Math.random() > appearanceProbability[type]) return null;

    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            left: x,
            top: y,
            width: config.width + 4,
            height: config.height + 4,
            zIndex: -1,
          },
          animatedStyle,
        ]}
      >
        <Canvas style={{ flex: 1 }}>
          <Group>
            {config.circles.map((c, i) => (
              <Circle
                color="white"
                cx={c.cx}
                cy={c.cy}
                key={String(i)}
                r={c.r}
              />
            ))}
          </Group>
        </Canvas>
      </Animated.View>
    );
  },
);
