import LicenseScreen from "@/features/settings/components/license-screen";
import i18n from "@/i18n";
import { Stack } from "expo-router";

export default function License() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: i18n.t("settings.license.title"),
        }}
      />
      <LicenseScreen />
    </>
  );
}
