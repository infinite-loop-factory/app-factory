import type { PropsWithChildren, ReactElement } from "react";

import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import { ThemedView } from "@/components/themed-view";

const _HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const { colorScheme = "light" } = useColorScheme();

  return (
    <ThemedView className="flex-1">
      <ScrollView scrollEventThrottle={16}>
        <View
          className="h-[250px] overflow-hidden"
          style={[{ backgroundColor: headerBackgroundColor[colorScheme] }]}
        >
          {headerImage}
        </View>
        <ThemedView className="flex-1 gap-4 overflow-hidden p-8">
          {children}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
