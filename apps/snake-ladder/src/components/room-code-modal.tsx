import type { CraftPalette } from "@/game/constants/palettes";

import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { WoodPanel } from "@/components/ui/wood-panel";
import { GAME_FONT } from "@/game/constants/theme";
import {
  isValidRoomCode,
  normalizeRoomCode,
  randomRoomCode,
} from "@/game/lib/room";
import i18n from "@/i18n";
import { lightenColor } from "@/lib/color";

type RoomCodeModalProps = {
  visible: boolean;
  palette: CraftPalette;
  onClose: () => void;
  onStart: (code: string) => void;
};

/** Enter (or roll) a room code — same code, same board, no server. */
export function RoomCodeModal({
  visible,
  palette,
  onClose,
  onStart,
}: RoomCodeModalProps) {
  const [code, setCode] = useState("");
  const valid = isValidRoomCode(code);

  const start = () => {
    if (!valid) return;
    onStart(normalizeRoomCode(code));
    setCode("");
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
        }}
      >
        <Pressable onPress={() => undefined} style={{ width: "100%" }}>
          <WoodPanel
            contentStyle={{ padding: 20, gap: 12 }}
            palette={palette}
            radius={18}
          >
            <Text
              style={{
                color: palette.cream,
                fontFamily: GAME_FONT,
                fontSize: 20,
              }}
            >
              {i18n.t("room.title")}
            </Text>
            <Text style={{ color: palette.creamMuted, lineHeight: 20 }}>
              {i18n.t("room.body")}
            </Text>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={12}
              onChangeText={setCode}
              onSubmitEditing={start}
              placeholder={i18n.t("room.placeholder")}
              placeholderTextColor={`${palette.creamMuted}88`}
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.25)",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: palette.cream,
                backgroundColor: "rgba(0,0,0,0.3)",
                fontFamily: GAME_FONT,
                fontSize: 18,
                letterSpacing: 2,
              }}
              testID="room-code-input"
              value={code}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setCode(randomRoomCode())}
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: "rgba(255,255,255,0.25)",
                  paddingVertical: 11,
                  backgroundColor: "rgba(0,0,0,0.22)",
                }}
                testID="room-code-random"
              >
                <Text
                  style={{
                    color: palette.cream,
                    fontFamily: GAME_FONT,
                    fontSize: 14,
                  }}
                >
                  {i18n.t("room.random")}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!valid}
                onPress={start}
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderRadius: 12,
                  paddingVertical: 11,
                  backgroundColor: valid
                    ? palette.ladder
                    : `${palette.ladder}55`,
                  borderTopWidth: 1.5,
                  borderTopColor: "rgba(255,255,255,0.3)",
                }}
                testID="room-code-start"
              >
                <Text
                  style={{
                    color: valid ? "#fff" : lightenColor(palette.ladder, 0.4),
                    fontFamily: GAME_FONT,
                    fontSize: 14,
                  }}
                >
                  {i18n.t("room.start")}
                </Text>
              </Pressable>
            </View>
          </WoodPanel>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
