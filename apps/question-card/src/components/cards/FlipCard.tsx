/**
 * FlipCard 컴포넌트
 * Y축 회전으로 앞면/뒷면을 전환하는 카드 애니메이션
 * Reanimated 3 기반 구현
 */

import type React from "react";

import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface FlipCardProps {
  /** 카드 앞면 콘텐츠 */
  frontContent: React.ReactNode;
  /** 카드 뒷면 콘텐츠 */
  backContent: React.ReactNode;
  /** 뒤집힌 상태 여부 */
  isFlipped: boolean;
  /** 카드 너비 (기본값: 화면 너비 - 40) */
  cardWidth?: number;
  /** 애니메이션 지속 시간 (기본값: 400ms) */
  duration?: number;
}

/**
 * Y축 회전 카드 뒤집기 컴포넌트
 * - perspective: 1000으로 3D 효과
 * - backfaceVisibility로 깜빡임 방지
 * - 부드러운 easing 애니메이션
 */
export function FlipCard({
  frontContent,
  backContent,
  isFlipped,
  cardWidth = SCREEN_WIDTH - 40,
  duration = 400,
}: FlipCardProps) {
  const rotation = useSharedValue(0);

  // 뒤집기 상태 변경 시 애니메이션
  useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, {
      duration,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isFlipped, rotation, duration]);

  // 앞면 스타일 (0도 → 90도에서 사라짐)
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    const opacity = interpolate(rotation.value, [0, 89, 90, 180], [1, 1, 0, 0]);

    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
    };
  });

  // 뒷면 스타일 (180도에서 시작, 90도에서 나타남)
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    const opacity = interpolate(rotation.value, [0, 89, 90, 180], [0, 0, 1, 1]);

    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
      backfaceVisibility: "hidden" as const,
    };
  });

  return (
    <View style={[styles.container, { width: cardWidth }]}>
      {/* 앞면 */}
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        {frontContent}
      </Animated.View>

      {/* 뒷면 */}
      <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
        {backContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  card: {
    width: "100%",
  },
  backCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});

export default FlipCard;
