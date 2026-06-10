import type { CraftPalette } from "@/game/constants/palettes";
import type { LogEntry } from "@/game/types";

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CircuitDiagram } from "@/components/circuit-diagram";
import i18n from "@/i18n";

type QasmLogPanelProps = {
  logs: LogEntry[];
  palette: CraftPalette;
};

function logColor(type: LogEntry["type"], palette: CraftPalette): string {
  if (type === "error") return palette.snake;
  if (type === "qasm") return palette.interference;
  return palette.textMuted;
}

export function QasmLogPanel({ logs, palette }: QasmLogPanelProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const recent = logs.slice(-8);

  if (recent.length === 0) return null;

  return (
    <ScrollView
      className="mx-4 mb-4 max-h-56 rounded-xl border px-3 py-2"
      style={{ backgroundColor: palette.card, borderColor: palette.border }}
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
  );
}
