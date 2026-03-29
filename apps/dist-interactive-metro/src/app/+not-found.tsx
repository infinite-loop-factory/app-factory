import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import i18n from "@/i18n";

const screenOptions = { title: "Oops!" } as const;

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={screenOptions} />
      <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
        <ThemedView className="flex-1 items-center justify-center p-5">
          <ThemedText type="title">{i18n.t("notFound.title")}</ThemedText>
          <Link accessibilityRole="link" className="mt-4 py-4" href="/">
            <ThemedText type="link">{i18n.t("notFound.goHome")}</ThemedText>
          </Link>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}
