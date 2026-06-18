import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GAME_FONT } from "@/game/constants/theme";
import { useAppSettings } from "@/hooks/use-app-settings";
import i18n from "@/i18n";

export default function NotFoundScreen() {
  const { palette } = useAppSettings();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.tableFeltDeep }}>
      <Stack.Screen options={{ title: i18n.t("notFound.title") }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
        }}
      >
        <Text
          style={{
            color: palette.cream,
            fontFamily: GAME_FONT,
            fontSize: 26,
            textAlign: "center",
          }}
        >
          {i18n.t("notFound.title")}
        </Text>
        <Link
          href="/"
          style={{
            color: palette.orbGlow,
            fontFamily: GAME_FONT,
            fontSize: 17,
            padding: 12,
          }}
        >
          {i18n.t("notFound.goHome")}
        </Link>
      </View>
    </SafeAreaView>
  );
}
