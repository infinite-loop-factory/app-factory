import type { CraftPalette } from "@/game/constants/palettes";

import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";

type GameHeaderProps = {
  title: string;
  onOpenSettings: () => void;
  onRestart: () => void;
  palette: CraftPalette;
};

function HeaderButton({
  label,
  icon,
  onPress,
  palette,
  testID,
}: {
  label: string;
  icon: "settings" | "refresh";
  onPress: () => void;
  palette: CraftPalette;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className="h-10 w-10 items-center justify-center rounded-full"
      onPress={onPress}
      style={{
        backgroundColor: palette.frameWood,
        borderWidth: 1.5,
        borderColor: palette.frameWoodEdge,
      }}
      testID={testID}
    >
      <MaterialIcons color={palette.cream} name={icon} size={22} />
    </Pressable>
  );
}

/** Top bar: wood back button, game-font title, settings + restart buttons. */
export function GameHeader({
  title,
  onOpenSettings,
  onRestart,
  palette,
}: GameHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <Link asChild href="/">
        <Pressable
          accessibilityLabel={i18n.t("game.back")}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: palette.frameWood,
            borderWidth: 1.5,
            borderColor: palette.frameWoodEdge,
          }}
        >
          <MaterialIcons color={palette.cream} name="arrow-back" size={22} />
        </Pressable>
      </Link>
      <Text
        style={{
          color: palette.cream,
          fontSize: 22,
          fontFamily: GAME_FONT,
          letterSpacing: 1,
          textShadowColor: "rgba(0,0,0,0.3)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 2,
        }}
      >
        {title}
      </Text>
      <View className="flex-row items-center gap-2">
        <HeaderButton
          icon="settings"
          label={i18n.t("settings.title")}
          onPress={onOpenSettings}
          palette={palette}
          testID="game-settings-button"
        />
        <HeaderButton
          icon="refresh"
          label={i18n.t("game.restart")}
          onPress={onRestart}
          palette={palette}
        />
      </View>
    </View>
  );
}
