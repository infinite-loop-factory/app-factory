import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import i18n from "@/i18n";

export default function HomeScreen() {
  return (
    <View>
      <ThemedView className="flex-row items-center gap-2">
        <ThemedText type="title">{i18n.t("welcome")}!</ThemedText>
      </ThemedView>
      <ThemedText>질문카드</ThemedText>
    </View>
  );
}
