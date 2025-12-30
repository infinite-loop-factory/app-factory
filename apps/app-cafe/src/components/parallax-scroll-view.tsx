import type { PropsWithChildren, ReactElement } from "react";

import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { ThemedView } from "@/components/themed-view";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: string;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
      backgroundColor: headerBackgroundColor,
    };
  });

  return (
    <ThemedView className="flex-1">
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          className="h-[250px] overflow-hidden" // 애니메이션 스타일과 배경색을 함께 적용
          style={headerAnimatedStyle}
        >
          {headerImage}
        </Animated.View>
        <ThemedView className="flex-1 gap-4 overflow-hidden p-8">
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}
