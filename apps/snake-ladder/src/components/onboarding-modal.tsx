import type { CraftPalette } from "@/game/constants/palettes";

import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { AppLogo } from "@/components/app-logo";
import i18n from "@/i18n";

type OnboardingModalProps = {
  visible: boolean;
  palette: CraftPalette;
  onComplete: () => void;
};

const STEPS = [
  {
    icon: "grid-on",
    titleKey: "onboarding.step1.title",
    bodyKey: "onboarding.step1.body",
  },
  {
    icon: "hub",
    titleKey: "onboarding.step2.title",
    bodyKey: "onboarding.step2.body",
  },
  {
    icon: "casino",
    titleKey: "onboarding.step3.title",
    bodyKey: "onboarding.step3.body",
  },
] as const;

export function OnboardingModal({
  visible,
  palette,
  onComplete,
}: OnboardingModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      >
        <View
          className="w-full max-w-md gap-4 rounded-2xl border-2 p-5"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <View className="items-center" style={{ gap: 12 }}>
            <AppLogo palette={palette} size={64} />
            <Text
              className="font-extrabold text-2xl"
              style={{ color: palette.text }}
            >
              {i18n.t("onboarding.title")}
            </Text>
          </View>
          <Text style={{ color: palette.textMuted, lineHeight: 22 }}>
            {i18n.t("onboarding.subtitle")}
          </Text>
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {STEPS.map((step) => (
              <View className="flex-row items-start gap-3" key={step.titleKey}>
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${palette.ladder}22` }}
                >
                  <MaterialIcons
                    color={palette.ladder}
                    name={step.icon}
                    size={22}
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text
                    className="font-bold text-base"
                    style={{ color: palette.text }}
                  >
                    {i18n.t(step.titleKey)}
                  </Text>
                  <Text
                    className="text-sm"
                    style={{ color: palette.textMuted, lineHeight: 20 }}
                  >
                    {i18n.t(step.bodyKey)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <Pressable
            accessibilityRole="button"
            className="items-center rounded-2xl px-6 py-4"
            onPress={onComplete}
            style={{ backgroundColor: palette.ladder }}
            testID="onboarding-start-button"
          >
            <Text
              className="font-extrabold text-base"
              style={{ color: "#fff" }}
            >
              {i18n.t("onboarding.start")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
