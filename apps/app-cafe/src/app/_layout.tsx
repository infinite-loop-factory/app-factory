import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StorybookHeader } from "@/components/ui/header/storybook-header";
import { useGlobalHeader } from "@/config/storybook-config";
import Providers from "@/provider";

export default function RootLayout() {
  const screenOptions = useGlobalHeader();

  return (
    <SafeAreaProvider>
      <Providers>
        <Stack screenOptions={screenOptions as any}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Protected guard={__DEV__}>
            <Stack.Screen
              name="storybook/index"
              options={{ headerTitle: StorybookHeader }}
            />
          </Stack.Protected>
          <Stack.Screen name="+not-found" />
        </Stack>
      </Providers>
    </SafeAreaProvider>
  );
}
