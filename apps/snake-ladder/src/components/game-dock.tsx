import type { CraftPalette } from "@/game/constants/palettes";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, Pressable, View } from "react-native";
import { DiceDisplay } from "@/components/dice-display";
import { RollButton } from "@/components/roll-button";
import i18n from "@/i18n";
import { darkenColor } from "@/lib/color";

const WOOD_TEXTURE = require("@/assets/images/textures/wood-planks.jpg");

type GameDockProps = {
  palette: CraftPalette;
  rolling: boolean;
  diceValue: number | null;
  goldActive: boolean;
  canRoll: boolean;
  canConfirmPass: boolean;
  gameOver: boolean;
  onRoll: (charge: number) => void;
  onConfirmPass: () => void;
  onPlayAgain: () => void;
  onShare: () => void;
};

/** Bottom wood dock: dice display + the single context-appropriate action. */
export function GameDock({
  palette,
  rolling,
  diceValue,
  goldActive,
  canRoll,
  canConfirmPass,
  gameOver,
  onRoll,
  onConfirmPass,
  onPlayAgain,
  onShare,
}: GameDockProps) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={WOOD_TEXTURE}
      style={{ marginTop: "auto" }}
    >
      <LinearGradient
        colors={[
          `${palette.frameWood}8c`,
          `${palette.frameWood}b3`,
          `${darkenColor(palette.frameWood, 0.7)}e6`,
        ]}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 14,
          borderTopWidth: 2,
          borderTopColor: "rgba(255,255,255,0.2)",
        }}
      >
        {rolling ? (
          <View style={{ width: 72, height: 102 }} />
        ) : (
          <DiceDisplay
            gold={goldActive}
            palette={palette}
            rolling={false}
            value={diceValue}
          />
        )}
        {canRoll ? (
          <RollButton
            accessibilityLabel={i18n.t("game.roll")}
            backgroundColor={palette.playerYou}
            label={i18n.t("game.roll")}
            onPress={onRoll}
            pulsing
            testID="game-roll-button"
          />
        ) : null}
        {canConfirmPass ? (
          <RollButton
            accessibilityLabel={i18n.t("setup.passTurn")}
            backgroundColor={palette.ladder}
            label={i18n.t("setup.passTurn")}
            onPress={onConfirmPass}
            pulsing
            testID="setup-pass-turn"
          />
        ) : null}
        {gameOver ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable
              accessibilityLabel={i18n.t("share.button")}
              accessibilityRole="button"
              onPress={onShare}
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: palette.playerYou,
                borderTopWidth: 1.5,
                borderTopColor: "rgba(255,255,255,0.35)",
              }}
              testID="game-share-button"
            >
              <MaterialIcons color="#fff" name="ios-share" size={22} />
            </Pressable>
            <RollButton
              accessibilityLabel={i18n.t("game.playAgain")}
              backgroundColor={palette.orbGlow}
              label={i18n.t("game.playAgain")}
              onPress={onPlayAgain}
              pulsing
            />
          </View>
        ) : null}
      </LinearGradient>
    </ImageBackground>
  );
}
