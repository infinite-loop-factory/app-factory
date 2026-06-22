import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingModal } from "@/components/onboarding-modal";
import { RollButton } from "@/components/roll-button";
import { RoomCodeModal } from "@/components/room-code-modal";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT, ON_GOLD_INK } from "@/game/constants/theme";
import { getDailySeed } from "@/game/lib/daily";
import { useAppSettings } from "@/hooks/use-app-settings";
import i18n from "@/i18n";
import { darkenColor } from "@/lib/color";
import { loadDailyProgress } from "@/lib/daily-progress";
import { winRate } from "@/lib/stats";

const FELT_TEXTURE = require("@/assets/images/textures/felt-table.jpg");
const HERO_ART = require("@/assets/images/art/hero-snake-ladder.png");
// Match the home emblem to the actual launcher icon for brand consistency.
const LOGO_EMBLEM = require("@/assets/images/icon.png");

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { palette, stats, loaded, onboardingComplete, completeOnboarding } =
    useAppSettings();
  const [dailyDone, setDailyDone] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void loadDailyProgress().then((progress) => {
        setDailyDone(progress.completedSeed === getDailySeed(new Date()));
      });
    }, []),
  );

  const features = [
    {
      icon: "casino",
      color: palette.orbGlow,
      titleKey: "home.feature.dice.title",
    },
    {
      icon: "hub",
      color: palette.interference,
      titleKey: "home.feature.entangle.title",
    },
    {
      icon: "trending-up",
      color: palette.ladder,
      titleKey: "home.feature.ladder.title",
    },
    {
      icon: "compare-arrows",
      color: palette.playerYou,
      titleKey: "home.feature.tunnel.title",
    },
  ] as const;

  if (!loaded) {
    return null;
  }

  const contentWidth = Math.min(width - 48, 520);

  return (
    <View style={{ flex: 1, backgroundColor: palette.tableFeltDeep }}>
      <ImageBackground
        imageStyle={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        source={FELT_TEXTURE}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={[
            `${palette.tableFelt}55`,
            `${palette.tableFelt}99`,
            `${darkenColor(palette.tableFeltDeep, 0.8)}ee`,
          ]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <OnboardingModal
              onComplete={completeOnboarding}
              palette={palette}
              visible={!onboardingComplete}
            />
            <RoomCodeModal
              onClose={() => setRoomModalOpen(false)}
              onStart={(roomCode) => {
                setRoomModalOpen(false);
                router.push(`/game?mode=room&code=${roomCode}`);
              }}
              palette={palette}
              visible={roomModalOpen}
            />
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
                gap: 18,
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: 28,
              }}
              contentInsetAdjustmentBehavior="automatic"
              style={{ flex: 1 }}
            >
              {/* top bar: shop + settings */}
              <View
                style={{
                  width: contentWidth,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                {(
                  [
                    {
                      href: "/shop" as const,
                      icon: "storefront" as const,
                      iconColor: palette.orbGlow,
                      label: i18n.t("shop.title"),
                      testID: "home-shop-button",
                    },
                    {
                      href: "/settings" as const,
                      icon: "settings" as const,
                      iconColor: palette.cream,
                      label: i18n.t("settings.title"),
                      testID: "home-settings-button",
                    },
                  ] as const
                ).map((item) => (
                  <Link asChild href={item.href} key={item.testID}>
                    <Pressable
                      accessibilityLabel={item.label}
                      accessibilityRole="button"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 999,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: palette.frameWood,
                        borderTopWidth: 1.5,
                        borderTopColor: "rgba(255,255,255,0.3)",
                        borderBottomWidth: 2,
                        borderBottomColor: palette.frameWoodEdge,
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 4,
                      }}
                      testID={item.testID}
                    >
                      <MaterialIcons
                        color={item.iconColor}
                        name={item.icon}
                        size={22}
                      />
                    </Pressable>
                  </Link>
                ))}
              </View>

              {/* hero */}
              <View style={{ alignItems: "center", gap: 10 }}>
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="contain"
                  source={LOGO_EMBLEM}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 22,
                    shadowColor: "#000",
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 5 },
                  }}
                />
                <Text
                  style={{
                    color: palette.cream,
                    fontFamily: GAME_FONT,
                    fontSize: 42,
                    textAlign: "center",
                    textShadowColor: "rgba(0,0,0,0.45)",
                    textShadowOffset: { width: 0, height: 3 },
                    textShadowRadius: 4,
                  }}
                >
                  {i18n.t("home.title")}
                </Text>
                <Text
                  style={{
                    color: palette.creamMuted,
                    fontSize: 14,
                    lineHeight: 21,
                    textAlign: "center",
                    maxWidth: contentWidth * 0.92,
                  }}
                >
                  {i18n.t("home.subtitle")}
                </Text>
              </View>

              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={HERO_ART}
                style={{
                  width: contentWidth * 0.8,
                  height: contentWidth * 0.54,
                  shadowColor: "#000",
                  shadowOpacity: 0.45,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 10 },
                }}
              />

              {stats.gamesPlayed > 0 ? (
                <WoodPanel
                  contentStyle={{ paddingHorizontal: 18, paddingVertical: 8 }}
                  palette={palette}
                  radius={999}
                >
                  <Text
                    style={{
                      color: palette.cream,
                      fontFamily: GAME_FONT,
                      fontSize: 14,
                    }}
                  >
                    {i18n.t("home.statsSummary", {
                      played: stats.gamesPlayed,
                      rate: winRate(stats),
                    })}
                  </Text>
                </WoodPanel>
              ) : null}

              {/* feature chips */}
              <View
                style={{
                  width: contentWidth,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {features.map((item) => (
                  <WoodPanel
                    contentStyle={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      minHeight: 46,
                    }}
                    key={item.titleKey}
                    palette={palette}
                    radius={12}
                    style={{ width: (contentWidth - 10) / 2 }}
                  >
                    <MaterialIcons
                      color={item.color}
                      name={item.icon}
                      size={19}
                    />
                    <Text
                      numberOfLines={2}
                      style={{
                        color: palette.cream,
                        fontFamily: GAME_FONT,
                        fontSize: 14,
                        lineHeight: 18,
                        flexShrink: 1,
                      }}
                    >
                      {i18n.t(item.titleKey)}
                    </Text>
                  </WoodPanel>
                ))}
              </View>

              <View style={{ flexGrow: 1 }} />

              <View style={{ alignItems: "center", gap: 6 }}>
                <RollButton
                  accessibilityLabel={i18n.t("home.daily")}
                  backgroundColor={palette.orbGlow}
                  label={i18n.t("home.daily")}
                  onPress={() => router.push("/game?mode=daily")}
                  pulsing={!dailyDone}
                  testID="home-daily-button"
                  textColor={ON_GOLD_INK}
                />
                <Text
                  style={{
                    color: dailyDone ? palette.ladder : palette.creamMuted,
                    fontFamily: GAME_FONT,
                    fontSize: 12,
                  }}
                >
                  {dailyDone
                    ? i18n.t("home.dailyDone")
                    : i18n.t("home.dailyHint")}
                </Text>
              </View>

              <RollButton
                accessibilityLabel={i18n.t("home.play")}
                backgroundColor={palette.ladder}
                label={i18n.t("home.play")}
                onPress={() => router.push("/game")}
                pulsing={false}
                testID="home-play-button"
              />

              <Pressable
                accessibilityLabel={i18n.t("home.room")}
                accessibilityRole="button"
                onPress={() => setRoomModalOpen(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  borderWidth: 1.5,
                  borderColor: "rgba(255,255,255,0.22)",
                  backgroundColor: "rgba(0,0,0,0.22)",
                  paddingHorizontal: 18,
                  paddingVertical: 9,
                }}
                testID="home-room-button"
              >
                <MaterialIcons
                  color={palette.playerYou}
                  name="group"
                  size={17}
                />
                <Text
                  style={{
                    color: palette.cream,
                    fontFamily: GAME_FONT,
                    fontSize: 14,
                  }}
                >
                  {i18n.t("home.room")}
                </Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
