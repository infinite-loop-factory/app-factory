import type { CraftPalette } from "@/game/constants/palettes";
import type { AppSettings } from "@/lib/settings";

import { Switch, Text, View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";

type AudioSettingsPatch = Partial<
  Pick<AppSettings, "musicEnabled" | "soundEnabled" | "hapticsEnabled">
>;

type GameSettingsSheetProps = {
  visible: boolean;
  onClose: () => void;
  musicEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onUpdate: (patch: AudioSettingsPatch) => void;
  palette: CraftPalette;
};

function ToggleRow({
  label,
  value,
  onChange,
  palette,
  testID,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  palette: CraftPalette;
  testID: string;
}) {
  return (
    <View className="w-full flex-row items-center justify-between py-2">
      {/* palette colors are runtime values from the craft theme */}
      <Text
        style={{ color: palette.cream, fontSize: 17, fontFamily: GAME_FONT }}
      >
        {label}
      </Text>
      <Switch
        onValueChange={onChange}
        testID={testID}
        thumbColor="#fff"
        trackColor={{ false: "rgba(0,0,0,0.4)", true: palette.ladder }}
        value={value}
      />
    </View>
  );
}

export function GameSettingsSheet({
  visible,
  onClose,
  musicEnabled,
  soundEnabled,
  hapticsEnabled,
  onUpdate,
  palette,
}: GameSettingsSheetProps) {
  return (
    <Actionsheet isOpen={visible} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent
        style={{
          backgroundColor: palette.frameWood,
          borderTopWidth: 2,
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderColor: palette.frameWoodEdge,
        }}
        testID="game-settings-sheet"
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator
            style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          />
        </ActionsheetDragIndicatorWrapper>
        <View className="w-full px-2 pt-1 pb-4">
          <Text
            style={{
              color: palette.cream,
              fontSize: 21,
              fontFamily: GAME_FONT,
              marginBottom: 8,
            }}
          >
            {i18n.t("settings.title")}
          </Text>
          <ToggleRow
            label={i18n.t("settings.music")}
            onChange={(next) => onUpdate({ musicEnabled: next })}
            palette={palette}
            testID="sheet-music-toggle"
            value={musicEnabled}
          />
          <ToggleRow
            label={i18n.t("settings.sound")}
            onChange={(next) => onUpdate({ soundEnabled: next })}
            palette={palette}
            testID="sheet-sound-toggle"
            value={soundEnabled}
          />
          <ToggleRow
            label={i18n.t("settings.haptics")}
            onChange={(next) => onUpdate({ hapticsEnabled: next })}
            palette={palette}
            testID="sheet-haptics-toggle"
            value={hapticsEnabled}
          />
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
}
