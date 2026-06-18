import type { CraftPalette } from "@/game/constants/palettes";

import { Text, View } from "react-native";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";

type PlayerBadgeProps = {
  name: string;
  color: string;
  position: number;
  isActive: boolean;
  palette: CraftPalette;
};

/** Wood chip showing a player's color, name, and board position. */
export function PlayerBadge({
  name,
  color,
  position,
  isActive,
  palette,
}: PlayerBadgeProps) {
  return (
    <WoodPanel
      contentStyle={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 7,
      }}
      edge={4}
      palette={palette}
      radius={14}
      style={{
        borderWidth: 2,
        borderColor: isActive ? color : "transparent",
        opacity: isActive ? 1 : 0.8,
        elevation: isActive ? 5 : 2,
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: palette.cream,
        }}
      />
      <View>
        <Text
          numberOfLines={1}
          style={{
            color: palette.creamMuted,
            fontSize: 11,
            fontFamily: GAME_FONT,
            maxWidth: 96,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            color: palette.cream,
            fontSize: 21,
            fontFamily: GAME_FONT,
            lineHeight: 24,
          }}
        >
          {position}
        </Text>
      </View>
    </WoodPanel>
  );
}
