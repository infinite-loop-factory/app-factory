import type { CraftPalette } from "@/game/constants/palettes";

import { Text } from "react-native";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";

type GameMessagePlankProps = {
  message: string;
  /** Shared-seed fairness seed; null hides the line. */
  seed: number | null;
  palette: CraftPalette;
};

/** Status plank under the board, with the fairness seed for preset modes. */
export function GameMessagePlank({
  message,
  seed,
  palette,
}: GameMessagePlankProps) {
  return (
    <WoodPanel
      contentStyle={{ paddingHorizontal: 16, paddingVertical: 9 }}
      edge={4}
      palette={palette}
      radius={12}
      style={{ marginHorizontal: 16, marginBottom: 10 }}
    >
      <Text
        style={{
          color: palette.cream,
          fontFamily: GAME_FONT,
          fontSize: 16,
          textAlign: "center",
        }}
      >
        {message}
      </Text>
      {seed !== null ? (
        <Text
          style={{
            color: `${palette.creamMuted}cc`,
            fontSize: 10,
            textAlign: "center",
            marginTop: 3,
          }}
          testID="fairness-seed"
        >
          {i18n.t("fairness.seed", { seed })}
        </Text>
      ) : null}
    </WoodPanel>
  );
}
