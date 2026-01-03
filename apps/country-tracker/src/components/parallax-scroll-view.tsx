import type { PropsWithChildren } from "react";

import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface ParallaxScrollViewProps extends PropsWithChildren {
  scrollEnabled?: boolean;
}

export default function ParallaxScrollView({
  children,
  scrollEnabled = true,
}: ParallaxScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const backgroundColor = useThemeColor("background-50");

  if (scrollEnabled) {
    return (
      <SafeAreaView
        className="flex-1"
        edges={["top", "left", "right"]}
        style={{ backgroundColor }}
      >
        <Animated.ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          ref={scrollRef}
          scrollEventThrottle={16}
        >
          <ThemedView className="flex-1 px-4 pt-2" style={{ backgroundColor }}>
            {children}
          </ThemedView>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor }}
    >
      <ThemedView className="flex-1 px-4 pt-2" style={{ backgroundColor }}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}
