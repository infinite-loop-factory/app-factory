import type { CraftPalette } from "@/game/constants/palettes";

import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { GoldDicePanel } from "@/components/gold-dice-panel";
import i18n from "@/i18n";
import { isNativeStorePlatform } from "@/lib/monetization/platform";

type GoldDiceControlsProps = {
  canRoll: boolean;
  goldDiceCount: number;
  desiredFace: number;
  enabled: boolean;
  onSelectFace: (face: number) => void;
  onToggle: () => void;
  palette: CraftPalette;
  /** Hide the shop CTA (e.g. right after a snake bite — no setback upsells). */
  suppressCta?: boolean;
};

/** Gold dice panel when the player owns dice, shop CTA when they ran out. */
export function GoldDiceControls({
  canRoll,
  goldDiceCount,
  desiredFace,
  enabled,
  onSelectFace,
  onToggle,
  palette,
  suppressCta = false,
}: GoldDiceControlsProps) {
  if (!canRoll) return null;

  if (goldDiceCount > 0) {
    return (
      <GoldDicePanel
        balance={goldDiceCount}
        desiredFace={desiredFace}
        enabled={enabled}
        onSelectFace={onSelectFace}
        onToggle={onToggle}
        palette={palette}
      />
    );
  }

  if (suppressCta || !isNativeStorePlatform()) return null;

  return (
    <Link asChild href="/shop">
      <Pressable
        accessibilityLabel={i18n.t("game.shopCta")}
        accessibilityRole="button"
        className="mx-4 mb-3"
        style={{
          backgroundColor: palette.frameWood,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1.5,
          borderColor: palette.orbGlow,
          borderBottomWidth: 4,
          borderBottomColor: palette.frameWoodEdge,
        }}
      >
        <Text
          style={{
            color: palette.orbGlow,
            fontWeight: "900",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {i18n.t("game.shopCta")}
        </Text>
      </Pressable>
    </Link>
  );
}
