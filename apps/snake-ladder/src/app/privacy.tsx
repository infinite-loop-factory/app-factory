import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "@/hooks/use-app-settings";
import i18n from "@/i18n";
import { PRIVACY_POLICY_URL } from "@/lib/monetization/constants";

const SECTION_KEYS = [
  "privacy.section.data.title",
  "privacy.section.ads.title",
  "privacy.section.iap.title",
  "privacy.section.contact.title",
] as const;

export default function PrivacyScreen() {
  const { palette } = useAppSettings();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: palette.background }}
    >
      <ScrollView
        contentContainerStyle={{ gap: 20, padding: 24 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex-row items-center justify-between">
          <Link asChild href="/settings">
            <Pressable
              accessibilityLabel={i18n.t("game.back")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.card }}
            >
              <MaterialIcons color={palette.text} name="arrow-back" size={22} />
            </Pressable>
          </Link>
          <Text
            className="font-extrabold text-xl"
            style={{ color: palette.text }}
          >
            {i18n.t("privacy.title")}
          </Text>
          <View className="h-10 w-10" />
        </View>

        <Text style={{ color: palette.textMuted, lineHeight: 22 }}>
          {i18n.t("privacy.intro")}
        </Text>

        {SECTION_KEYS.map((titleKey) => {
          const bodyKey = titleKey.replace(".title", ".body") as
            | "privacy.section.data.body"
            | "privacy.section.ads.body"
            | "privacy.section.iap.body"
            | "privacy.section.contact.body";
          return (
            <View
              className="gap-2 rounded-2xl border p-4"
              key={titleKey}
              style={{
                backgroundColor: palette.card,
                borderColor: palette.border,
              }}
            >
              <Text
                className="font-bold text-base"
                style={{ color: palette.text }}
              >
                {i18n.t(titleKey)}
              </Text>
              <Text style={{ color: palette.textMuted, lineHeight: 22 }}>
                {i18n.t(bodyKey)}
              </Text>
            </View>
          );
        })}

        <Text
          style={{ color: palette.textMuted, fontSize: 12, lineHeight: 18 }}
        >
          {i18n.t("privacy.publicUrl", { url: PRIVACY_POLICY_URL })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
