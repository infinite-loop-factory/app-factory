import type { PropsWithChildren } from "react";

import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface ParallaxScrollViewProps extends PropsWithChildren {
  scrollEnabled?: boolean;
}

export default function ParallaxScrollView({
  children,
  scrollEnabled = true,
}: ParallaxScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const backgroundColor = useThemeColor("background");

  if (scrollEnabled) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor }}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ThemedView className="flex-1 px-4 pt-2" style={{ backgroundColor }}>
            {children}
          </ThemedView>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor }}>
      <ThemedView className="flex-1 px-4 pt-2" style={{ backgroundColor }}>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}
