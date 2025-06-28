import { ThemedView } from "@/components/themed-view";
import { Text } from "@/components/ui/text";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView className="flex-1 items-center justify-center p-5">
        <Text className="font-bold text-textDark text-xl dark:text-textLight">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-primary-600 underline dark:text-primary-400">
            Go to home screen!
          </Text>
        </Link>
      </ThemedView>
    </>
  );
}
