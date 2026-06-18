import type { DiceSpeed, MovementSpeed, ThemeMode } from "@/lib/settings";

import { Link } from "expo-router";
import { Alert, Pressable, Switch, Text, TextInput, View } from "react-native";
import { ScreenShell } from "@/components/ui/screen-shell";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import { useAppSettings } from "@/hooks/use-app-settings";
import { useMonetization } from "@/hooks/use-monetization";
import i18n from "@/i18n";
import { lightenColor } from "@/lib/color";
import { isNativeStorePlatform } from "@/lib/monetization/platform";
import { resolveDisplayName } from "@/lib/settings";
import { winRate } from "@/lib/stats";

const INPUT_BG = "rgba(0,0,0,0.28)";
const INPUT_BORDER = "rgba(255,255,255,0.18)";

function SectionTitle({ children }: { children: string }) {
  const { palette } = useAppSettings();
  return (
    <Text
      style={{
        color: palette.cream,
        fontFamily: GAME_FONT,
        fontSize: 17,
        marginBottom: 2,
      }}
    >
      {children}
    </Text>
  );
}

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
        style={{ color: palette.creamMuted }}
      >
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option}
              onPress={() => onChange(option)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: selected
                  ? lightenColor(palette.ladder, 0.35)
                  : INPUT_BORDER,
                backgroundColor: selected ? palette.ladder : INPUT_BG,
              }}
            >
              <Text
                style={{
                  color: selected ? "#fff" : palette.cream,
                  fontFamily: GAME_FONT,
                  fontSize: 13,
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
    <View className="flex-row items-center justify-between py-1">
      <Text
        className="font-semibold text-base"
        style={{ color: palette.cream }}
      >
        {label}
      </Text>
      <Switch
        onValueChange={onChange}
        thumbColor="#fff"
        trackColor={{ false: "rgba(0,0,0,0.4)", true: palette.ladder }}
        value={value}
      />
    </View>
  );
}

function NicknameField({
  label,
  value,
  placeholder,
  preview,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  preview: string;
  onChange: (next: string) => void;
}) {
  const { palette } = useAppSettings();

  return (
    <View className="gap-2">
      <Text
        className="font-semibold text-sm"
        style={{ color: palette.creamMuted }}
      >
        {label}
      </Text>
      <TextInput
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={16}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={`${palette.creamMuted}99`}
        style={{
          borderWidth: 1,
          borderColor: INPUT_BORDER,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          color: palette.cream,
          backgroundColor: INPUT_BG,
        }}
        value={value}
      />
      <Text style={{ color: palette.creamMuted, fontSize: 12 }}>{preview}</Text>
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
    <ScreenShell
      backTestID="settings-back-button"
      scrollTestID="settings-screen"
      title={i18n.t("settings.title")}
    >
      <WoodPanel
        contentStyle={{ padding: 16, gap: 8 }}
        palette={palette}
        testID="settings-stats-section"
      >
        <SectionTitle>{i18n.t("settings.stats.title")}</SectionTitle>
        <Text style={{ color: palette.creamMuted }}>
          {i18n.t("settings.stats.played", { count: stats.gamesPlayed })}
        </Text>
        <Text style={{ color: palette.creamMuted }}>
          {i18n.t("settings.stats.wins", { count: stats.wins })}
        </Text>
        <Text style={{ color: palette.creamMuted }}>
          {i18n.t("settings.stats.losses", { count: stats.losses })}
        </Text>
        <Text style={{ color: palette.cream, fontFamily: GAME_FONT }}>
          {i18n.t("settings.stats.winRate", { rate })}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={stats.gamesPlayed === 0}
          onPress={confirmResetStats}
          style={{
            marginTop: 6,
            alignSelf: "flex-start",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: lightenColor(palette.snake, 0.25),
            backgroundColor: INPUT_BG,
            opacity: stats.gamesPlayed === 0 ? 0.45 : 1,
          }}
        >
          <Text
            style={{
              color: lightenColor(palette.snake, 0.4),
              fontFamily: GAME_FONT,
              fontSize: 13,
            }}
          >
            {i18n.t("settings.resetStats")}
          </Text>
        </Pressable>
      </WoodPanel>

      {nativeStore ? (
        <WoodPanel contentStyle={{ padding: 16, gap: 8 }} palette={palette}>
          <SectionTitle>{i18n.t("settings.monetization.title")}</SectionTitle>
          <Text style={{ color: palette.creamMuted }}>
            {i18n.t("settings.monetization.goldBalance", {
              count: monetization.goldDiceCount,
            })}
          </Text>
          <Text style={{ color: palette.creamMuted }}>
            {monetization.adRemovalPurchased
              ? i18n.t("settings.monetization.adRemoved")
              : i18n.t("settings.monetization.adsEnabled")}
          </Text>
          <Link asChild href="/shop">
            <Pressable
              accessibilityRole="button"
              style={{
                marginTop: 4,
                alignSelf: "flex-start",
                borderRadius: 999,
                paddingHorizontal: 16,
                paddingVertical: 9,
                backgroundColor: palette.orbGlow,
                borderTopWidth: 1,
                borderTopColor: "rgba(255,255,255,0.4)",
              }}
            >
              <Text
                style={{
                  color: "#3a2c10",
                  fontFamily: GAME_FONT,
                  fontSize: 13,
                }}
              >
                {i18n.t("settings.monetization.openShop")}
              </Text>
            </Pressable>
          </Link>
        </WoodPanel>
      ) : null}

      <WoodPanel contentStyle={{ padding: 16, gap: 14 }} palette={palette}>
        <NicknameField
          label={i18n.t("settings.playerNickname")}
          onChange={(playerNickname) => updateSettings({ playerNickname })}
          placeholder={i18n.t("player.defaultName")}
          preview={i18n.t("settings.playerPreview", { name: playerPreview })}
          value={settings.playerNickname}
        />
        <NicknameField
          label={i18n.t("settings.opponentNickname")}
          onChange={(opponentNickname) => updateSettings({ opponentNickname })}
          placeholder={i18n.t("opponent.defaultName")}
          preview={i18n.t("settings.opponentPreview", {
            name: opponentPreview,
          })}
          value={settings.opponentNickname}
        />
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
          label={i18n.t("settings.music")}
          onChange={(musicEnabled) => updateSettings({ musicEnabled })}
          value={settings.musicEnabled}
        />
      </WoodPanel>

      <WoodPanel contentStyle={{ padding: 16, gap: 8 }} palette={palette}>
        <SectionTitle>{i18n.t("settings.legal.title")}</SectionTitle>
        <Link asChild href="/privacy">
          <Pressable accessibilityRole="button">
            <Text
              style={{
                color: lightenColor(palette.ladder, 0.35),
                fontFamily: GAME_FONT,
                fontSize: 14,
              }}
            >
              {i18n.t("settings.legal.privacy")}
            </Text>
          </Pressable>
        </Link>
      </WoodPanel>
    </ScreenShell>
  );
}
