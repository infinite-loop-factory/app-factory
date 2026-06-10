import type { CraftPalette } from "@/game/constants/palettes";
import type { LogEntry } from "@/game/types";

import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CircuitDiagram } from "@/components/circuit-diagram";
import { GAME_FONT } from "@/game/constants/theme";
import i18n from "@/i18n";

type QasmLogPanelProps = {
  logs: LogEntry[];
  palette: CraftPalette;
};

// Light tones — the log tray sits on dark felt in both themes.
function logColor(type: LogEntry["type"], palette: CraftPalette): string {
  if (type === "error") return "#ff9aa8";
  if (type === "qasm") return "#c9b6f0";
  return palette.creamMuted;
}

/**
 * Quantum nerd tray — collapsed by default so vector/QASM internals don't
 * read as debug spew to casual players. Opt-in via the header toggle.
 */
export function QasmLogPanel({ logs, palette }: QasmLogPanelProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const recent = logs.slice(-8);

  if (recent.length === 0) return null;

  return (
    <View className="mx-4 mb-4">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((v) => !v)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          alignSelf: "flex-start",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: `${palette.tableFeltDeep}cc`,
          borderWidth: 1,
          borderColor: palette.frameWoodEdge,
        }}
        testID="qasm-log-toggle"
      >
        <MaterialIcons
          color={palette.creamMuted}
          name={open ? "expand-more" : "chevron-right"}
          size={16}
        />
        <Text
          style={{
            color: palette.creamMuted,
            fontFamily: GAME_FONT,
            fontSize: 12,
          }}
        >
          {i18n.t("game.log.title")}
        </Text>
      </Pressable>

      {open ? (
        <ScrollView
          className="mt-2 max-h-56 rounded-xl border px-3 py-2"
          style={{
            backgroundColor: palette.tableFeltDeep,
            borderColor: palette.frameWoodEdge,
          }}
          testID="qasm-log-panel"
        >
          {recent.map((entry) => {
            const isQasm = entry.type === "qasm";
            const isOpen = expanded === entry.timestamp;
            return (
              <View key={entry.id} style={{ marginBottom: 8 }}>
                <Pressable
                  accessibilityRole={isQasm ? "button" : "text"}
                  disabled={!isQasm}
                  onPress={() =>
                    setExpanded((prev) =>
                      prev === entry.timestamp ? null : entry.timestamp,
                    )
                  }
                >
                  <Text
                    style={{
                      color: logColor(entry.type, palette),
                      fontSize: 11,
                    }}
                  >
                    {isQasm
                      ? `${isOpen ? "▾" : "▸"} ${i18n.t("game.log.qasmTap")}`
                      : entry.message}
                  </Text>
                </Pressable>
                {isQasm && isOpen ? (
                  <View style={{ marginTop: 6 }}>
                    <CircuitDiagram palette={palette} qasm={entry.message} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}
