import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="detail/[id]" options={{ gestureEnabled: false }} />
      <Stack.Screen name="dog/register" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
