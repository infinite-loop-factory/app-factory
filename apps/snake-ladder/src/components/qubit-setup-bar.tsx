import type { CraftPalette } from "@/game/constants/palettes";

import { Pressable, ScrollView, Text } from "react-native";
import { QubitMarkerChip } from "@/components/qubit-marker";
import { QUBIT_CONFIGS } from "@/game/constants/board";
import i18n from "@/i18n";

type QubitSetupBarProps = {
  remaining: number[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  palette: CraftPalette;
  disabled?: boolean;
};

export function QubitSetupBar({
  remaining,
  selectedIndex,
  onSelect,
  palette,
  disabled,
}: QubitSetupBarProps) {
  return (
    <ScrollView
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {remaining.map((configIndex) => {
        const config = QUBIT_CONFIGS[configIndex];
        if (!config) return null;
        const selected = selectedIndex === configIndex;
        return (
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            key={configIndex}
            onPress={() => onSelect(configIndex)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: selected ? palette.playerYou : palette.border,
              backgroundColor: selected ? palette.card : palette.background,
              minWidth: 88,
              alignItems: "center",
            }}
            testID={`qubit-config-${configIndex}`}
          >
            <QubitMarkerChip
              configIndex={configIndex}
              palette={palette}
              selected={selected}
            />
            <Text
              style={{
                fontWeight: "800",
                color: palette.text,
                fontSize: 13,
              }}
            >
              {config.label}
            </Text>
            <Text
              style={{ color: palette.textMuted, fontSize: 11, marginTop: 2 }}
            >
              ↑{Math.round(config.ladderProb * 100)}%
            </Text>
            {config.entangled ? (
              <Text
                style={{
                  color: palette.interference,
                  fontSize: 10,
                  marginTop: 2,
                }}
              >
                {i18n.t("setup.entangledBadge")}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
