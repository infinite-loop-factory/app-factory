import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLogo } from "@/components/app-logo";
import { OnboardingModal } from "@/components/onboarding-modal";
import { useAppSettings } from "@/hooks/use-app-settings";
import i18n from "@/i18n";
import { winRate } from "@/lib/stats";

export default function HomeScreen() {
  const router = useRouter();
  const { palette, stats, loaded, onboardingComplete, completeOnboarding } =
    useAppSettings();

  const features = [
    {
      icon: "casino",
      color: palette.walnut,
      titleKey: "home.feature.dice.title",
      bodyKey: "home.feature.dice.body",
    },
    {
      icon: "hub",
      color: palette.interference,
      titleKey: "home.feature.entangle.title",
      bodyKey: "home.feature.entangle.body",
    },
    {
      icon: "trending-up",
      color: palette.ladder,
      titleKey: "home.feature.ladder.title",
      bodyKey: "home.feature.ladder.body",
    },
    {
      icon: "compare-arrows",
      color: palette.playerYou,
      titleKey: "home.feature.tunnel.title",
      bodyKey: "home.feature.tunnel.body",
    },
  ] as const;

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: palette.background }}
    >
      <OnboardingModal
        onComplete={completeOnboarding}
        palette={palette}
        visible={!onboardingComplete}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          gap: 24,
          paddingHorizontal: 24,
          paddingTop: 40,
          paddingBottom: 32,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-3">
            <AppLogo palette={palette} size={72} />
            <Text
              className="font-extrabold text-4xl"
              style={{ color: palette.text, lineHeight: 44 }}
            >
              {i18n.t("home.title")}
            </Text>
            <Text
              className="font-medium text-base"
              style={{ color: palette.textMuted, lineHeight: 24 }}
            >
              {i18n.t("home.subtitle")}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Link asChild href="/shop">
              <Pressable
                accessibilityLabel={i18n.t("shop.title")}
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.card }}
                testID="home-shop-button"
              >
                <MaterialIcons
                  color={palette.orbGlow}
                  name="storefront"
                  size={22}
                />
              </Pressable>
            </Link>
            <Link asChild href="/settings">
              <Pressable
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.card }}
                testID="home-settings-button"
              >
                <MaterialIcons color={palette.text} name="settings" size={22} />
              </Pressable>
            </Link>
          </View>
        </View>

        {stats.gamesPlayed > 0 ? (
          <View
            className="rounded-2xl border px-4 py-3"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <Text className="font-bold text-sm" style={{ color: palette.text }}>
              {i18n.t("home.statsSummary", {
                played: stats.gamesPlayed,
                rate: winRate(stats),
              })}
            </Text>
          </View>
        ) : null}

        <View
          className="gap-4 rounded-2xl border-2 p-5"
          style={{
            backgroundColor: palette.card,
            borderColor: palette.border,
          }}
        >
          {features.map((item) => (
            <View className="flex-row items-start gap-3" key={item.titleKey}>
              <View
                className="mt-0.5 h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${item.color}22` }}
              >
                <MaterialIcons color={item.color} name={item.icon} size={22} />
              </View>
              <View className="flex-1 gap-1">
                <Text
                  className="font-bold text-base"
                  style={{ color: palette.text }}
                >
                  {i18n.t(item.titleKey)}
                </Text>
                <Text
                  className="font-medium text-sm"
                  style={{ color: palette.textMuted, lineHeight: 20 }}
                >
                  {i18n.t(item.bodyKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityLabel={i18n.t("home.play")}
          accessibilityRole="button"
          className="items-center rounded-2xl px-6 py-4"
          onPress={() => router.push("/game")}
          style={{ backgroundColor: palette.ladder }}
          testID="home-play-button"
        >
          <Text className="font-extrabold text-lg" style={{ color: "#fff" }}>
            {i18n.t("home.play")}
          </Text>
        </Pressable>

        <Text
          className="text-center text-xs"
          style={{ color: palette.textMuted, lineHeight: 18 }}
        >
          {i18n.t("home.offline")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
