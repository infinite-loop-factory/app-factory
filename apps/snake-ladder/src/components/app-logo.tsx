import type { CraftPalette } from "@/game/constants/palettes";

import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import i18n from "@/i18n";

type AppLogoProps = {
  palette: CraftPalette;
  size?: number;
  showTitle?: boolean;
  testID?: string;
};

export function AppLogo({
  palette,
  size = 88,
  showTitle = false,
  testID = "app-logo",
}: AppLogoProps) {
  const iconSize = Math.round(size * 0.38);
  const diceSize = Math.round(size * 0.26);
  const radius = Math.round(size * 0.22);

  return (
    <View
      accessibilityLabel={i18n.t("home.title")}
      accessibilityRole="image"
      className="items-center"
      style={{ gap: showTitle ? 12 : 0 }}
      testID={testID}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: palette.ladder,
          borderWidth: 3,
          borderColor: palette.orbGlow,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons color="#fff" name="grid-on" size={iconSize} />
        <View
          style={{
            position: "absolute",
            right: size * 0.14,
            bottom: size * 0.14,
            width: diceSize + 8,
            height: diceSize + 8,
            borderRadius: (diceSize + 8) / 2,
            backgroundColor: palette.card,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: palette.orbGlow,
          }}
        >
          <MaterialIcons color={palette.snake} name="casino" size={diceSize} />
        </View>
      </View>
      {showTitle ? (
        <Text
          className="text-center font-extrabold"
          style={{ color: palette.text, fontSize: Math.max(20, size * 0.24) }}
        >
          {i18n.t("home.title")}
        </Text>
      ) : null}
    </View>
  );
}
