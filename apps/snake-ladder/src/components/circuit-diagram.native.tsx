import type { CraftPalette } from "@/game/constants/palettes";

import { Text } from "react-native";

type CircuitDiagramProps = {
  qasm: string;
  palette: CraftPalette;
  width?: number;
  height?: number;
};

/** Native fallback — @kirkelliott/ket targets web/Node and is not Hermes-safe yet. */
export function CircuitDiagram({ qasm, palette }: CircuitDiagramProps) {
  return (
    <Text style={{ color: palette.textMuted, fontSize: 11 }}>
      {qasm.split("\n").slice(0, 4).join("\n")}
    </Text>
  );
}
