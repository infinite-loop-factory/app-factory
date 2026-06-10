import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { CraftPalette } from "@/game/constants/palettes";

import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, View } from "react-native";
import { darkenColor } from "@/lib/color";

const WOOD_TEXTURE = require("@/assets/images/textures/wood-planks.jpg");

type WoodPanelProps = {
  palette: CraftPalette;
  radius?: number;
  /** Height of the darker 3D bottom edge. */
  edge?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  testID?: string;
};

/** Real wood-grain surface, tinted to the palette and lit from the top. */
export function WoodPanel({
  palette,
  radius = 14,
  edge = 4,
  style,
  contentStyle,
  children,
  testID,
}: WoodPanelProps) {
  return (
    <View
      style={[
        {
          backgroundColor: palette.frameWoodEdge,
          borderRadius: radius,
          paddingBottom: edge,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
        style,
      ]}
      testID={testID}
    >
      <ImageBackground
        imageStyle={{ borderRadius: radius }}
        resizeMode="cover"
        source={WOOD_TEXTURE}
        style={{ borderRadius: radius, overflow: "hidden" }}
      >
        <LinearGradient
          colors={[
            `${palette.frameWood}8c`,
            `${palette.frameWood}b3`,
            `${darkenColor(palette.frameWood, 0.7)}d9`,
          ]}
          style={{ borderRadius: radius }}
        >
          <View
            style={[
              {
                borderRadius: radius,
                borderTopWidth: 1.5,
                borderTopColor: "rgba(255,255,255,0.22)",
              },
              contentStyle,
            ]}
          >
            {children}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
