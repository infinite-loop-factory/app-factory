import type { PropsWithChildren } from "react";

import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParallaxScrollView({ children }: PropsWithChildren) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView className="flex-1" style={[{ backgroundColor }]}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <ThemedView className="flex-1 gap-4 overflow-hidden p-8">
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
