import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <ThemedView className="flex-1 items-center justify-center p-5">
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link className="mt-4 py-4" href="/">
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
      </SafeAreaView>
    </>
  );
}
