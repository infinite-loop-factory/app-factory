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
      className="mx-4 mb-3"
      style={{
        backgroundColor: palette.tableFeltDeep,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: palette.frameWoodEdge,
      }}
      testID="gold-dice-panel"
    >
      <View className="flex-row items-center justify-between">
        <Text
          style={{ color: palette.orbGlow, fontWeight: "900", fontSize: 14 }}
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
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: enabled ? palette.orbGlow : palette.frameWood,
            borderWidth: 1.5,
            borderColor: palette.frameWoodEdge,
          }}
          testID="gold-dice-toggle"
        >
          <Text
            style={{
              color: enabled ? "#3a2a06" : palette.creamMuted,
              fontWeight: "900",
              fontSize: 12,
              letterSpacing: 0.5,
            }}
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
                width: 38,
                height: 38,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1.5,
                borderColor: palette.frameWoodEdge,
                borderBottomWidth: 3,
                backgroundColor:
                  desiredFace === face ? palette.orbGlow : palette.frameWood,
              }}
              testID={`gold-dice-face-${face}`}
            >
              <Text
                style={{
                  color: desiredFace === face ? "#3a2a06" : palette.cream,
                  fontWeight: "900",
                  fontSize: 16,
                }}
              >
                {face}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
