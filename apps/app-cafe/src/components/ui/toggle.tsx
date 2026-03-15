import type { ReactNode } from "react";

import { useEffect } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ToggleProps {
  isActive: boolean;
  onPress: () => void;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  backgroundColor?: string;
  duration?: number;
  easing?: "ease" | "spring";
}

export function Toggle({
  isActive,
  onPress,
  leftContent,
  rightContent,
  backgroundColor = "#E5E7EB",
  duration = 300,
  easing = "ease",
}: ToggleProps) {
  const TOGGLE_WIDTH = 48;
  const TOGGLE_HEIGHT = 24;
  const PADDING = 2;
  const THUMB_SIZE = TOGGLE_HEIGHT - PADDING * 2; // 20
  const TRAVEL_DISTANCE = TOGGLE_WIDTH - PADDING * 2 - THUMB_SIZE; // 24

  const translateX = useSharedValue(isActive ? TRAVEL_DISTANCE : 0);

  useEffect(() => {
    const targetX = isActive ? TRAVEL_DISTANCE : 0;
    if (easing === "spring") {
      translateX.value = withSpring(targetX, { duration });
    } else {
      translateX.value = withTiming(targetX, {
        duration,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isActive, duration, easing, TRAVEL_DISTANCE]);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // ▼▼▼▼▼ 수정된 부분 ▼▼▼▼▼
  // 활성/비활성 상태에 따른 투명도 조절 (0으로 설정하여 완전히 숨김)
  const leftIconStyle = useAnimatedStyle(() => ({
    // isActive가 true(오른쪽)이면 왼쪽 아이콘 투명도 0, 아니면 1
    opacity: withTiming(isActive ? 0 : 1, { duration }),
  }));

  const rightIconStyle = useAnimatedStyle(() => ({
    // isActive가 true(오른쪽)이면 오른쪽 아이콘 투명도 1, 아니면 0
    opacity: withTiming(isActive ? 1 : 0, { duration }),
  }));
  // ▲▲▲▲▲ 수정된 부분 ▲▲▲▲▲

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: TOGGLE_WIDTH,
        height: TOGGLE_HEIGHT,
        backgroundColor,
        borderRadius: 9999,
        justifyContent: "center",
        padding: PADDING,
        overflow: "hidden",
      }}
    >
      {/* 1. 움직이는 썸 (흰색 원) - zIndex: 0 */}
      <Animated.View
        style={[
          {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: "#FFFFFF",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: Platform.OS === "ios" ? 0.2 : 0.2,
            shadowRadius: 2,
            elevation: 2,
            zIndex: 0,
          },
          thumbAnimatedStyle,
        ]}
      />

      {/* 2. 아이콘 레이어 (고정) - zIndex: 1 */}
      <View
        className="absolute inset-0 flex-row items-center justify-between"
        pointerEvents="none"
        style={{
          paddingHorizontal: PADDING,
          width: TOGGLE_WIDTH,
          height: TOGGLE_HEIGHT,
          zIndex: 1,
        }}
      >
        {/* 왼쪽 아이콘 영역 */}
        <Animated.View
          style={[
            leftIconStyle,
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          {leftContent}
        </Animated.View>

        {/* 오른쪽 아이콘 영역 */}
        <Animated.View
          style={[
            rightIconStyle,
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          {rightContent}
        </Animated.View>
      </View>
    </Pressable>
  );
}
