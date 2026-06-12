import type { CraftPalette } from "@/game/constants/palettes";

import { Text, View } from "react-native";
import { PlayerBadge } from "@/components/player-badge";

type GameHudRowProps = {
  playerName: string;
  opponentName: string;
  positions: readonly [number, number] | number[];
  activePlayer: number | null;
  palette: CraftPalette;
};

/** Player badges flanking the VS divider. */
export function GameHudRow({
  playerName,
  opponentName,
  positions,
  activePlayer,
  palette,
}: GameHudRowProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pb-2">
      <PlayerBadge
        color={palette.playerYou}
        isActive={activePlayer === 0}
        name={playerName}
        palette={palette}
        position={positions[0] ?? 1}
      />
      <Text
        style={{
          color: palette.creamMuted,
          fontSize: 14,
          fontWeight: "900",
          letterSpacing: 2,
        }}
      >
        VS
      </Text>
      <PlayerBadge
        color={palette.playerCpu}
        isActive={activePlayer === 1}
        name={opponentName}
        palette={palette}
        position={positions[1] ?? 1}
      />
    </View>
  );
}
