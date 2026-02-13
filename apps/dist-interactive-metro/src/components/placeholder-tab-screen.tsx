import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface PlaceholderTabScreenProps {
  title: string;
  description: string;
}

/**
 * Reusable placeholder screen for tabs that are not yet implemented.
 */
export function PlaceholderTabScreen({
  title,
  description,
}: PlaceholderTabScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <ThemedView className="flex-1">
        <View className="flex-1 items-center justify-center px-6">
          <ThemedText type="title">{title}</ThemedText>
          <ThemedText className="mt-2 text-center text-typography-600">
            {description}
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
