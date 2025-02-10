import { useThemeColor } from "@/hooks/useThemeColor";
import type { PropsWithChildren } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "./ThemedView";

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
      <SafeAreaView className="flex-1" style={[{ backgroundColor }]}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ThemedView className="flex-1 gap-4 overflow-hidden p-8">
            {children}
          </ThemedView>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={[{ backgroundColor }]}>
      <ThemedView className="flex-1 gap-4 overflow-hidden p-8">
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}
