import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Path,
  Rect,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring, // [추가] 물리 효과(반동)를 위해 필요
  withTiming,
} from "react-native-reanimated";

// --- 좌표 및 설정 ---
const CANVAS_WIDTH = 300;
const CONTAINER_CENTER_X = CANVAS_WIDTH / 2;

export const SwingingLamp = memo(
  ({
    isDark,
    rotation,
    onPress,
    language,
    lampHeight,
    lampLeft,
    showShadow = true,
  }: {
    isDark: boolean;
    rotation: SharedValue<number>;
    onPress?: () => void;
    language?: string;
    lampHeight: number;
    lampLeft?: number;
    showShadow?: boolean;
  }) => {
    // === 애니메이션 값 설정 ===
    const rotationDegrees = useDerivedValue(() => `${rotation.value}deg`);
    const swingStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: rotationDegrees.value }],
    }));

    const skiaTransform = useDerivedValue(() => {
      return [{ rotate: (rotation.value * Math.PI) / 180 }];
    });

    // [핵심 추가] 줄의 관성(Sway) 애니메이션
    // 전등이 회전할 때, 줄은 관성에 의해 반대 방향으로 쳐지려는 성질을 계산
    const stringSway = useDerivedValue(() => {
      return withSpring(rotation.value * -0.6, {
        mass: 0.2, // 줄은 가벼우므로 질량을 작게
        damping: 6, // 적당히 흔들리다 멈춤
        stiffness: 80, // 탄성
      });
    });

    const glowOpacity = useDerivedValue(() => {
      return withTiming(isDark ? 1 : 0, { duration: 400 });
    });

    const pullStringHeight = useSharedValue(50);

    const originVec = useMemo(() => vec(CONTAINER_CENTER_X, 0), []);
    const BULB_CENTER_Y = lampHeight + 42;

    // === 색상 설정 ===
    const bulbColor = isDark ? "#FFF" : "#CFD8DC";
    const shadeColor = isDark ? "#242020" : "#2D3436";
    const wireColor = isDark ? "#242020" : "#2D3436";
    const detailColor = isDark ? "#BCAAA4" : "#FBC02D";
    const stringColor = isDark
      ? "rgba(200, 200, 200, 0.3)"
      : "rgba(0, 0, 0, 0.3)";
    const knobColor = isDark
      ? "rgba(200, 200, 200, 0.2)"
      : "rgba(0, 0, 0, 0.2)";

    // === 인터랙션 ===
    const handlePress = () => {
      pullStringHeight.value = withSequence(
        withTiming(60, { duration: 150 }),
        withDelay(80, withTiming(50, { duration: 150 })),
      );
      setTimeout(() => {
        onPress?.();
      }, 300);
    };

    // [수정] 줄 길이에 더해 '회전(Sway)' 스타일 추가
    const stringSwayDegrees = useDerivedValue(() => `${stringSway.value}deg`);
    const pullStringStyle = useAnimatedStyle(() => ({
      height: pullStringHeight.value,
      transform: [
        { rotate: stringSwayDegrees.value }, // 줄이 따로 흔들리게 함
      ],
    }));

    // === 레이아웃 계산 ===
    const containerLeft = useMemo(() => {
      if (lampLeft !== undefined) return lampLeft - 50;
      return language === "ko" ? 215 : 200;
    }, [language, lampLeft]);

    // 전등갓(사다리꼴) 경로
    const shadePath = useMemo(() => {
      const topX = CONTAINER_CENTER_X;
      const topY = lampHeight;
      const bottomY = lampHeight + 35;
      const halfTopWidth = 0;
      const halfBottomWidth = 22;

      const pathString = `M ${topX - halfTopWidth} ${topY} L ${topX + halfTopWidth} ${topY} L ${topX + halfBottomWidth} ${bottomY} L ${topX - halfBottomWidth} ${bottomY} Z`;
      const path = Skia.Path.MakeFromSVGString(pathString);
      if (!path) {
        throw new Error(`Failed to parse shade path: ${pathString}`);
      }
      return path;
    }, [lampHeight]);

    // 줄 그림자 시작 위치
    const stringStartY = lampHeight + 35;
    const stringShadowXOffset = 4;
    return (
      <View style={[styles.lampContainerPos, { left: containerLeft }]}>
        <Pressable onPress={handlePress} style={styles.pressable}>
          <Canvas style={styles.wideCanvas}>
            <Group origin={originVec} transform={skiaTransform}>
              {/* ================= 조건부 렌더링: 그림자 (Shadow Layer) ================= */}
              {showShadow && (
                <Group opacity={0.2} transform={[{ translate: [15, 13] }]}>
                  <BlurMask blur={5} style="normal" />

                  {/* 1. 천장 연결 전선 (Wire) */}
                  <Rect
                    color="black"
                    height={lampHeight + 10}
                    width={3}
                    x={CONTAINER_CENTER_X - 2}
                    y={-10}
                  />

                  {/* 2. 전등갓 */}
                  <Path color="black" path={shadePath} />

                  {/* 3. 전구 알 */}
                  <Circle
                    color="black"
                    cx={CONTAINER_CENTER_X}
                    cy={lampHeight + 35}
                    r={10}
                  />

                  {/* 4. 당기는 줄 & 손잡이 */}
                  <Group
                    transform={[
                      {
                        translate: [
                          CONTAINER_CENTER_X + stringShadowXOffset,
                          stringStartY,
                        ],
                      },
                    ]}
                  >
                    <Rect color="black" height={50} width={3} x={-1} y={0} />
                    <Circle color="black" cx={0.5} cy={50} r={3} />
                  </Group>
                </Group>
              )}
              {/* ====================================================================== */}

              {/* 광원 효과 (기존 유지) */}
              <Group
                opacity={glowOpacity}
                transform={[{ translate: [CONTAINER_CENTER_X, BULB_CENTER_Y] }]}
              >
                <Group>
                  <BlurMask blur={2} style="normal" />
                  <Circle color="#FFFFFF" cx={0} cy={0} opacity={0.7} r={6.5} />
                </Group>
                <Group>
                  <BlurMask blur={8} style="normal" />
                  <Circle color="#FFFFFF" cx={0} cy={0} opacity={0.35} r={10} />
                  <Circle color="#FFFFFF" cx={1} cy={1} opacity={0.1} r={10} />
                  <Circle color="#FFFFFF" cx={2} cy={2} opacity={0.05} r={10} />
                </Group>
              </Group>
            </Group>
          </Canvas>

          {/* 실제 램프 View */}
          <Animated.View style={[styles.lampOrigin, swingStyle]}>
            <View
              style={[
                styles.wire,
                { backgroundColor: wireColor, height: lampHeight },
              ]}
            />

            <View style={styles.shadeWrapper}>
              <View style={[styles.shade, { borderBottomColor: shadeColor }]} />
              <View
                style={[styles.shadeDetail, { backgroundColor: detailColor }]}
              />
            </View>

            <Animated.View
              style={[
                styles.pullString,
                {
                  backgroundColor: stringColor,
                  top: lampHeight + 35,
                },
                pullStringStyle,
              ]}
            >
              <View style={[styles.pullKnob, { backgroundColor: knobColor }]} />
            </Animated.View>

            <View
              style={[
                styles.bulb,
                {
                  backgroundColor: bulbColor,
                  borderWidth: 0,
                },
              ]}
            />
          </Animated.View>
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  lampContainerPos: {
    position: "absolute",
    top: -15,
    left: 200,
    width: 100,
    height: 250,
    zIndex: 2002,
  },
  pressable: {
    width: 100,
    height: 250,
    pointerEvents: "box-none",
  },
  wideCanvas: {
    position: "absolute",
    width: CANVAS_WIDTH,
    height: 300,
    left: (100 - CANVAS_WIDTH) / 2,
    top: 0,
    zIndex: 1,
  },
  lampOrigin: {
    alignItems: "center",
    width: 100,
    height: 250,
    transformOrigin: "top center",
    zIndex: 10,
  },
  wire: {
    width: 2,
    height: 150,
  },
  shadeWrapper: {
    alignItems: "center",
  },
  shade: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 22,
    borderRightWidth: 22,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  shadeDetail: {
    position: "absolute",
    top: 2,
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  bulb: {
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: -2,
    zIndex: 5,
  },
  pullString: {
    position: "absolute",
    top: 135,
    right: 43,
    width: 1,
    height: 50,
    transformOrigin: "top center",
  },
  pullKnob: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    zIndex: 6,
  },
});
