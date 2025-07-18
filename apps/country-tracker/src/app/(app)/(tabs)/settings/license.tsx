import { Stack } from "expo-router";
import LicenseScreen from "@/features/settings/components/license-screen";
import i18n from "@/libs/i18n";

export default function License() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: i18n.t("settings.license.title"),
          headerTitleStyle: { fontSize: 24 },
        }}
      />
      <LicenseScreen />
    </>
  );
}
