import type { CraftPalette } from "@/game/constants/palettes";

import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

type KetCircuit = typeof import("@kirkelliott/ket").Circuit;

// Lazy-loaded: @kirkelliott/ket uses top-level await, which breaks the
// synchronous web bundle when imported statically.
let cachedCircuit: KetCircuit | null = null;

type CircuitDiagramProps = {
  qasm: string;
  palette: CraftPalette;
  width?: number;
  height?: number;
};

export function CircuitDiagram({
  qasm,
  palette,
  width = 280,
  height = 120,
}: CircuitDiagramProps) {
  const [circuit, setCircuit] = useState<KetCircuit | null>(cachedCircuit);

  useEffect(() => {
    if (circuit) return;
    let cancelled = false;
    import("@kirkelliott/ket")
      .then((mod) => {
        cachedCircuit = mod.Circuit;
        if (!cancelled) setCircuit(() => mod.Circuit);
      })
      .catch(() => {
        // keep the QASM text fallback
      });
    return () => {
      cancelled = true;
    };
  }, [circuit]);

  const svg = useMemo(() => {
    if (!circuit) return null;
    try {
      return circuit.fromQASM(qasm).toSVG();
    } catch {
      return null;
    }
  }, [circuit, qasm]);

  if (!svg) {
    return (
      <Text style={{ color: palette.textMuted, fontSize: 11 }}>
        {qasm.split("\n").slice(0, 4).join("\n")}
      </Text>
    );
  }

  return (
    <View
      style={{
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: palette.border,
        backgroundColor: palette.card,
      }}
    >
      <SvgXml height={height} width={width} xml={svg} />
    </View>
  );
}
