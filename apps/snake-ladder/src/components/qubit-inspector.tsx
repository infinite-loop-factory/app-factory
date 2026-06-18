import type { CraftPalette } from "@/game/constants/palettes";
import type { PlacedQubit } from "@/game/types";

import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { WoodPanel } from "@/components/ui/wood-panel";
import { QUBIT_CONFIGS } from "@/game/constants/board";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";

type QubitInspectorProps = {
  /** Cell being inspected, or null when hidden. */
  cell: number | null;
  qubits: PlacedQubit[];
  palette: CraftPalette;
};

function describeQubit(qubit: PlacedQubit): string {
  if (qubit.collapsed === "ladder") {
    return i18n.t("inspect.collapsedLadder", {
      cell: qubit.destinationCell ?? "?",
    });
  }
  if (qubit.collapsed === "snake") {
    return i18n.t("inspect.collapsedSnake", {
      cell: qubit.destinationCell ?? "?",
    });
  }
  if (qubit.collapsed === "interference") {
    return i18n.t("inspect.collapsedInterference");
  }
  const config = QUBIT_CONFIGS[qubit.configIndex];
  return i18n.t("inspect.odds", {
    ladder: Math.round((config?.ladderProb ?? 0.5) * 100),
    snake: Math.round((config?.snakeProb ?? 0.5) * 100),
  });
}

function qubitAccent(qubit: PlacedQubit, palette: CraftPalette): string {
  if (qubit.collapsed === "ladder") return palette.ladder;
  if (qubit.collapsed === "snake") return palette.snake;
  if (qubit.collapsed === "interference") return palette.interference;
  const entangled =
    (QUBIT_CONFIGS[qubit.configIndex]?.entangled ?? false) ||
    Boolean(qubit.entangledPartnerId);
  if (entangled) return palette.interference;
  return qubit.owner === 0 ? palette.playerYou : palette.playerCpu;
}

/** Plain-language card explaining the qubit(s) on a long-pressed cell. */
export function QubitInspector({ cell, qubits, palette }: QubitInspectorProps) {
  const scale = useSharedValue(0);
  const visible = cell !== null;

  useEffect(() => {
    scale.set(
      visible
        ? withSpring(1, { damping: 16, stiffness: 320 })
        : withSpring(0, { damping: 18, stiffness: 380 }),
    );
  }, [visible, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: scale.get(),
    transform: [{ scale: 0.92 + scale.get() * 0.08 }],
  }));

  if (!visible) return null;
  const cellQubits = qubits.filter((q) => q.cell === cell);
  if (cellQubits.length === 0) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, style]}
      testID="qubit-inspector"
    >
      <WoodPanel
        contentStyle={{ paddingHorizontal: 14, paddingVertical: 10, gap: 6 }}
        palette={palette}
        radius={12}
      >
        <Text
          style={{
            color: palette.creamMuted,
            fontFamily: GAME_FONT,
            fontSize: 12,
          }}
        >
          {i18n.t("inspect.cellTitle", { cell })}
        </Text>
        {cellQubits.map((qubit) => {
          const accent = qubitAccent(qubit, palette);
          const entangled =
            (QUBIT_CONFIGS[qubit.configIndex]?.entangled ?? false) ||
            Boolean(qubit.entangledPartnerId);
          return (
            <View key={qubit.id} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: accent }]} />
              <View style={{ flexShrink: 1 }}>
                <Text
                  style={{
                    color: palette.cream,
                    fontFamily: GAME_FONT,
                    fontSize: 14,
                  }}
                >
                  {describeQubit(qubit)}
                </Text>
                <Text style={{ color: palette.creamMuted, fontSize: 11 }}>
                  {i18n.t(
                    qubit.owner === 0
                      ? "inspect.owner.you"
                      : "inspect.owner.cpu",
                  )}
                  {entangled && qubit.collapsed === null
                    ? ` · ${i18n.t("inspect.entangled")}`
                    : ""}
                </Text>
              </View>
            </View>
          );
        })}
      </WoodPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    zIndex: 35,
    maxWidth: 320,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
});
