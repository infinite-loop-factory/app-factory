import type { CraftPalette } from "@/game/constants/palettes";

import { Pressable, Text, View } from "react-native";
import i18n from "@/i18n";

type GoldDicePanelProps = {
  balance: number;
  enabled: boolean;
  desiredFace: number;
  palette: CraftPalette;
  onToggle: () => void;
  onSelectFace: (face: number) => void;
};

export function GoldDicePanel({
  balance,
  enabled,
  desiredFace,
  palette,
  onToggle,
  onSelectFace,
}: GoldDicePanelProps) {
  return (
    <View
      className="mx-4 mb-3 rounded-2xl border px-4 py-3"
      style={{ backgroundColor: palette.card, borderColor: palette.border }}
      testID="gold-dice-panel"
    >
      <View className="flex-row items-center justify-between">
        <Text
          style={{ color: palette.text, fontWeight: "700" }}
          testID="gold-dice-balance"
        >
          {i18n.t("game.goldDice.balance", { count: balance })}
        </Text>
        <Pressable
          accessibilityLabel={
            enabled ? i18n.t("game.goldDice.on") : i18n.t("game.goldDice.off")
          }
          accessibilityRole="switch"
          accessibilityState={{ checked: enabled }}
          onPress={onToggle}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: enabled ? palette.orbGlow : palette.background,
            borderWidth: 1,
            borderColor: palette.border,
          }}
          testID="gold-dice-toggle"
        >
          <Text
            style={{ color: palette.text, fontWeight: "700", fontSize: 12 }}
          >
            {enabled ? i18n.t("game.goldDice.on") : i18n.t("game.goldDice.off")}
          </Text>
        </Pressable>
      </View>
      {enabled ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((face) => (
            <Pressable
              accessibilityRole="button"
              key={face}
              onPress={() => onSelectFace(face)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: palette.border,
                backgroundColor:
                  desiredFace === face ? palette.orbGlow : palette.background,
              }}
              testID={`gold-dice-face-${face}`}
            >
              <Text style={{ color: palette.text, fontWeight: "800" }}>
                {face}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
