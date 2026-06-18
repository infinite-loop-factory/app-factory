import type { CraftPalette } from "@/game/constants/palettes";

import { Text } from "react-native";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";
import { lightenColor } from "@/lib/color";
import { type JourneyCounts, journeyLine } from "@/lib/share";

type ResultCardProps = {
  won: boolean;
  rolls: number;
  journey: JourneyCounts;
  palette: CraftPalette;
  /** Daily-only extras — hidden when zero. */
  streak?: number;
  attempts?: number;
};

/** End-of-game summary: what the share text says, visible on screen. */
export function ResultCard({
  won,
  rolls,
  journey,
  palette,
  streak = 0,
  attempts = 0,
}: ResultCardProps) {
  const resultLine = `${i18n.t(won ? "share.win" : "share.lose", {
    count: rolls,
  })}${attempts > 1 ? i18n.t("share.tryCount", { n: attempts }) : ""}`;

  return (
    <WoodPanel
      contentStyle={{
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
        gap: 4,
      }}
      palette={palette}
      radius={12}
      style={{ marginHorizontal: 16, marginBottom: 10 }}
      testID="result-card"
    >
      <Text
        style={{
          color: won ? lightenColor(palette.orbGlow, 0.2) : palette.cream,
          fontFamily: GAME_FONT,
          fontSize: 16,
        }}
      >
        {resultLine}
      </Text>
      {journeyLine(journey).length > 0 ? (
        <Text
          style={{
            color: palette.creamMuted,
            fontFamily: GAME_FONT,
            fontSize: 13,
          }}
        >
          {journeyLine(journey)}
        </Text>
      ) : null}
      {streak > 1 ? (
        <Text
          style={{
            color: lightenColor(palette.ladder, 0.3),
            fontFamily: GAME_FONT,
            fontSize: 13,
          }}
        >
          {i18n.t("share.streak", { count: streak })}
        </Text>
      ) : null}
    </WoodPanel>
  );
}
