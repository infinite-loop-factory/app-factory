import { Stack } from "expo-router";
import { AddVisitScreen } from "@/features/home/components/add-visit-screen";

export default function AddVisitPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddVisitScreen />
    </>
  );
}
