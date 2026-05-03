import { Stack } from "expo-router";

export default function PlaceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
