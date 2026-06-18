import type { DiceFaceValue } from "@/components/dice/dice-orientations";
import type { DiceVariant } from "@/components/dice/dice-variant";
import type { CraftPalette } from "@/game/constants/palettes";

import { Text, View } from "react-native";
import { resolveDiceMaterial } from "@/components/dice/dice-glass-material";
import { PIP_POSITIONS } from "@/components/dice/dice-pips";

type DiceFaceProps = {
  face: DiceFaceValue | null;
  palette: CraftPalette;
  size: number;
  variant?: DiceVariant;
};

/** Flat face for reduced-motion fallback — plain views, no GL. */
export function DiceFace({
  face,
  palette,
  size,
  variant = "default",
}: DiceFaceProps) {
  if (!face) {
    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size * 0.18,
          backgroundColor: palette.card,
        }}
      >
        <Text style={{ color: palette.textMuted, fontWeight: "700" }}>?</Text>
      </View>
    );
  }

  const material = resolveDiceMaterial(variant);
  const pipSize = Math.max(6, size * 0.16);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.18,
        backgroundColor: material.faceLight(face),
        borderWidth: Math.max(1.5, size * 0.03),
        borderColor: material.edge,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: size * 0.45,
          backgroundColor: material.faceDark(face),
          opacity: 0.35,
        }}
      />
      {PIP_POSITIONS[face].map(([u, v]) => (
        <View
          key={`pip-${u}-${v}`}
          style={{
            position: "absolute",
            left: u * size - pipSize / 2,
            top: v * size - pipSize / 2,
            width: pipSize,
            height: pipSize,
            borderRadius: 999,
            backgroundColor: material.pip,
            shadowColor: material.pipShadow,
            shadowOpacity: 0.6,
            shadowRadius: 1.5,
            shadowOffset: { width: 0, height: 1 },
          }}
        />
      ))}
    </View>
  );
}
