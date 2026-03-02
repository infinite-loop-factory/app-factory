import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Providers from "@/provider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Providers>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Providers>
    </SafeAreaProvider>
  );
}
