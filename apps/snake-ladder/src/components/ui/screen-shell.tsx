import type { ReactNode } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GAME_FONT } from "@/game/constants/theme";
import { useAppSettings } from "@/hooks/use-app-settings";
import i18n from "@/i18n";
import { darkenColor } from "@/lib/color";

const FELT_TEXTURE = require("@/assets/images/textures/felt-table.jpg");

type ScreenShellProps = {
  title: string;
  children: ReactNode;
  backTestID?: string;
  scrollTestID?: string;
  headerRight?: ReactNode;
};

/** Felt-table screen scaffold with a wood back button and game-font title. */
export function ScreenShell({
  title,
  children,
  backTestID,
  scrollTestID,
  headerRight,
}: ScreenShellProps) {
  const { palette } = useAppSettings();

  return (
    <View style={{ flex: 1, backgroundColor: palette.tableFeltDeep }}>
      <ImageBackground
        imageStyle={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        source={FELT_TEXTURE}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={[
            `${palette.tableFelt}59`,
            `${palette.tableFelt}26`,
            `${darkenColor(palette.tableFeltDeep, 0.8)}cc`,
          ]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Link asChild href="/">
            <Pressable
              accessibilityLabel={i18n.t("game.back")}
              accessibilityRole="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: palette.frameWood,
                borderWidth: 1.5,
                borderColor: palette.frameWoodEdge,
              }}
              testID={backTestID}
            >
              <MaterialIcons
                color={palette.cream}
                name="arrow-back"
                size={22}
              />
            </Pressable>
          </Link>
          <Text
            style={{
              color: palette.cream,
              fontSize: 22,
              fontFamily: GAME_FONT,
              textShadowColor: "rgba(0,0,0,0.4)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 3,
            }}
          >
            {title}
          </Text>
          {headerRight ?? <View style={{ width: 40, height: 40 }} />}
        </View>
        <ScrollView
          contentContainerStyle={{ gap: 16, padding: 20, paddingTop: 12 }}
          contentInsetAdjustmentBehavior="automatic"
          testID={scrollTestID}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
