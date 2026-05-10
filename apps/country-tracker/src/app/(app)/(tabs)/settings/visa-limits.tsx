import { Stack } from "expo-router";
import { VisaLimitsScreen } from "@/features/settings/components/visa-limits-screen";

export default function VisaLimitsPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <VisaLimitsScreen />
    </>
  );
}
