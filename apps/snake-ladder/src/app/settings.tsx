import type { DiceSpeed, MovementSpeed, ThemeMode } from "@/lib/settings";

import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { isNativeStorePlatform } from "@/lib/monetization/platform";
import { resolveDisplayName } from "@/lib/settings";
import { winRate } from "@/lib/stats";

function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (next: T) => void;
}) {
  const { palette } = useAppSettings();

  return (
    <View className="gap-2">
      <Text
        className="font-semibold text-sm"
        style={{ color: palette.textMuted }}
      >
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onChange(option)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: palette.border,
                backgroundColor: selected ? palette.playerYou : palette.card,
              }}
            >
              <Text
                style={{
                  color: selected ? "#fff" : palette.text,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {i18n.t(`settings.option.${option}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  const { palette } = useAppSettings();

  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="font-semibold text-base" style={{ color: palette.text }}>
        {label}
      </Text>
      <Switch
        onValueChange={onChange}
        thumbColor="#fff"
        trackColor={{ false: palette.border, true: palette.ladder }}
        value={value}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, stats, palette, updateSettings, resetStats } =
    useAppSettings();
  const { monetization } = useMonetization();
  const nativeStore = isNativeStorePlatform();
  const rate = winRate(stats);
  const playerPreview = resolveDisplayName(
    settings.playerNickname,
    i18n.t("player.defaultName"),
  );
  const opponentPreview = resolveDisplayName(
    settings.opponentNickname,
    i18n.t("opponent.defaultName"),
  );

  const confirmResetStats = () => {
    if (stats.gamesPlayed === 0) return;
    Alert.alert(
      i18n.t("settings.resetStatsTitle"),
      i18n.t("settings.resetStatsMessage"),
      [
        { text: i18n.t("game.newGameCancel"), style: "cancel" },
        {
          text: i18n.t("settings.resetStatsConfirm"),
          style: "destructive",
          onPress: resetStats,
        },
      ],
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: palette.background }}
    >
      <ScrollView
        contentContainerStyle={{ gap: 20, padding: 24 }}
        contentInsetAdjustmentBehavior="automatic"
        testID="settings-screen"
      >
        <View className="flex-row items-center justify-between">
          <Link asChild href="/">
            <Pressable
              accessibilityLabel={i18n.t("game.back")}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.card }}
              testID="settings-back-button"
            >
              <MaterialIcons color={palette.text} name="arrow-back" size={22} />
            </Pressable>
          </Link>
          <Text
            className="font-extrabold text-xl"
            style={{ color: palette.text }}
          >
            {i18n.t("settings.title")}
          </Text>
          <View className="h-10 w-10" />
        </View>

        <View
          className="gap-3 rounded-2xl border p-4"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
          testID="settings-stats-section"
        >
          <Text className="font-bold text-base" style={{ color: palette.text }}>
            {i18n.t("settings.stats.title")}
          </Text>
          <Text style={{ color: palette.textMuted }}>
            {i18n.t("settings.stats.played", { count: stats.gamesPlayed })}
          </Text>
          <Text style={{ color: palette.textMuted }}>
            {i18n.t("settings.stats.wins", { count: stats.wins })}
          </Text>
          <Text style={{ color: palette.textMuted }}>
            {i18n.t("settings.stats.losses", { count: stats.losses })}
          </Text>
          <Text style={{ color: palette.text }}>
            {i18n.t("settings.stats.winRate", { rate })}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={stats.gamesPlayed === 0}
            onPress={confirmResetStats}
            style={{
              marginTop: 8,
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: palette.border,
              opacity: stats.gamesPlayed === 0 ? 0.5 : 1,
            }}
          >
            <Text
              style={{ color: palette.snake, fontWeight: "700", fontSize: 12 }}
            >
              {i18n.t("settings.resetStats")}
            </Text>
          </Pressable>
        </View>

        {nativeStore ? (
          <View
            className="gap-3 rounded-2xl border p-4"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.border,
            }}
          >
            <Text
              className="font-bold text-base"
              style={{ color: palette.text }}
            >
              {i18n.t("settings.monetization.title")}
            </Text>
            <Text style={{ color: palette.textMuted }}>
              {i18n.t("settings.monetization.goldBalance", {
                count: monetization.goldDiceCount,
              })}
            </Text>
            <Text style={{ color: palette.textMuted }}>
              {monetization.adRemovalPurchased
                ? i18n.t("settings.monetization.adRemoved")
                : i18n.t("settings.monetization.adsEnabled")}
            </Text>
            <Link asChild href="/shop">
              <Pressable
                accessibilityRole="button"
                className="mt-1 self-start rounded-full px-3 py-2"
                style={{ backgroundColor: palette.orbGlow }}
              >
                <Text
                  style={{
                    color: palette.text,
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  {i18n.t("settings.monetization.openShop")}
                </Text>
              </Pressable>
            </Link>
          </View>
        ) : null}

        <View
          className="gap-3 rounded-2xl border p-4"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <Text className="font-bold text-base" style={{ color: palette.text }}>
            {i18n.t("settings.legal.title")}
          </Text>
          <Link asChild href="/privacy">
            <Pressable accessibilityRole="button">
              <Text style={{ color: palette.ladder, fontWeight: "700" }}>
                {i18n.t("settings.legal.privacy")}
              </Text>
            </Pressable>
          </Link>
        </View>

        <View
          className="gap-4 rounded-2xl border p-4"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <View className="gap-2">
            <Text
              className="font-semibold text-sm"
              style={{ color: palette.textMuted }}
            >
              {i18n.t("settings.playerNickname")}
            </Text>
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={16}
              onChangeText={(playerNickname) =>
                updateSettings({ playerNickname })
              }
              placeholder={i18n.t("player.defaultName")}
              placeholderTextColor={palette.textMuted}
              style={{
                borderWidth: 1,
                borderColor: palette.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                color: palette.text,
                backgroundColor: palette.background,
              }}
              value={settings.playerNickname}
            />
            <Text style={{ color: palette.textMuted, fontSize: 12 }}>
              {i18n.t("settings.playerPreview", { name: playerPreview })}
            </Text>
          </View>
          <View className="gap-2">
            <Text
              className="font-semibold text-sm"
              style={{ color: palette.textMuted }}
            >
              {i18n.t("settings.opponentNickname")}
            </Text>
            <TextInput
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={16}
              onChangeText={(opponentNickname) =>
                updateSettings({ opponentNickname })
              }
              placeholder={i18n.t("opponent.defaultName")}
              placeholderTextColor={palette.textMuted}
              style={{
                borderWidth: 1,
                borderColor: palette.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                color: palette.text,
                backgroundColor: palette.background,
              }}
              value={settings.opponentNickname}
            />
            <Text style={{ color: palette.textMuted, fontSize: 12 }}>
              {i18n.t("settings.opponentPreview", { name: opponentPreview })}
            </Text>
          </View>
          <OptionRow<MovementSpeed>
            label={i18n.t("settings.movementSpeed")}
            onChange={(movementSpeed) => updateSettings({ movementSpeed })}
            options={["slow", "normal", "fast"]}
            value={settings.movementSpeed}
          />
          <OptionRow<DiceSpeed>
            label={i18n.t("settings.diceSpeed")}
            onChange={(diceSpeed) => updateSettings({ diceSpeed })}
            options={["slow", "normal", "fast"]}
            value={settings.diceSpeed}
          />
          <OptionRow<ThemeMode>
            label={i18n.t("settings.theme")}
            onChange={(theme) => updateSettings({ theme })}
            options={["light", "dark", "system"]}
            value={settings.theme}
          />
          <ToggleRow
            label={i18n.t("settings.haptics")}
            onChange={(hapticsEnabled) => updateSettings({ hapticsEnabled })}
            value={settings.hapticsEnabled}
          />
          <ToggleRow
            label={i18n.t("settings.sound")}
            onChange={(soundEnabled) => updateSettings({ soundEnabled })}
            value={settings.soundEnabled}
          />
          <ToggleRow
            label={i18n.t("settings.reducedMotion")}
            onChange={(reducedMotion) => updateSettings({ reducedMotion })}
            value={settings.reducedMotion}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
