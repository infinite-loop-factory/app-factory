import type { Station } from "@/types/station";

import { View } from "react-native";
import { lines } from "@/data/stations";
import { LineBadge } from "./line-badge";

const lineColorByName = new Map(lines.map((l) => [l.name, l.color]));

interface StationLineBadgesProps {
  station: Station;
  size?: "sm" | "md";
}

/**
 * Renders a LineBadge for the station's own line plus one for each
 * connected (transfer) line listed in station.connections.
 */
export function StationLineBadges({
  station,
  size = "md",
}: StationLineBadgesProps) {
  return (
    <View className="flex-row flex-wrap gap-1">
      <LineBadge color={station.lineColor} line={station.line} size={size} />
      {station.connections?.map((connLine) => {
        const color = lineColorByName.get(connLine) ?? "#888888";
        return (
          <LineBadge color={color} key={connLine} line={connLine} size={size} />
        );
      })}
    </View>
  );
}
