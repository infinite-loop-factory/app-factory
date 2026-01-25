import { Stack } from "expo-router";
import DenylistScreen from "@/features/settings/components/denylist-screen";
import i18n from "@/lib/i18n";

export default function Denylist() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: i18n.t("settings.general.denylist"),
          headerTitleStyle: { fontSize: 24 },
        }}
      />
      <DenylistScreen />
    </>
  );
}
