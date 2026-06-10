import type { ComponentProps } from "react";
import type { CraftPalette } from "@/game/constants/palettes";
import type { PlacedQubit } from "@/game/types";

import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { QUBIT_CONFIGS } from "@/game/constants/board";
import i18n from "@/i18n";

type QubitMarkerProps = {
  qubit: PlacedQubit;
  palette: CraftPalette;
  size: number;
  offsetIndex?: number;
};

type MarkerIcon = ComponentProps<typeof MaterialIcons>["name"];

function markerStyle(
  qubit: PlacedQubit,
  palette: CraftPalette,
): {
  backgroundColor: string;
  borderColor: string;
  icon: MarkerIcon;
  iconColor: string;
  label: string;
} {
  const config = QUBIT_CONFIGS[qubit.configIndex];
  const ownerColor = qubit.owner === 0 ? palette.playerYou : palette.playerCpu;

  if (qubit.collapsed === "ladder") {
    return {
      backgroundColor: `${palette.ladder}33`,
      borderColor: palette.ladder,
      icon: "arrow-upward",
      iconColor: palette.ladder,
      label: i18n.t("board.qubit.collapsedLadder"),
    };
  }
  if (qubit.collapsed === "snake") {
    return {
      backgroundColor: `${palette.snake}33`,
      borderColor: palette.snake,
      icon: "arrow-downward",
      iconColor: palette.snake,
      label: i18n.t("board.qubit.collapsedSnake"),
    };
  }
  if (qubit.collapsed === "interference") {
    return {
      backgroundColor: `${palette.interference}33`,
      borderColor: palette.interference,
      icon: "compare-arrows",
      iconColor: palette.interference,
      label: i18n.t("board.qubit.collapsedInterference"),
    };
  }

  const entangled = config?.entangled ?? Boolean(qubit.entangledPartnerId);
  return {
    backgroundColor: entangled
      ? `${palette.interference}28`
      : `${ownerColor}22`,
    borderColor: entangled ? palette.interference : ownerColor,
    icon: "blur-on",
    iconColor: entangled ? palette.interference : ownerColor,
    label: entangled
      ? i18n.t("board.qubit.entangled")
      : i18n.t("board.qubit.active"),
  };
}

export function QubitMarker({
  qubit,
  palette,
  size,
  offsetIndex = 0,
}: QubitMarkerProps) {
  const style = markerStyle(qubit, palette);
  const iconSize = Math.max(10, size * 0.52);
  const config = QUBIT_CONFIGS[qubit.configIndex];
  const showConfigLabel = size >= 22 && qubit.collapsed === null;

  return (
    <View
      accessibilityLabel={style.label}
      accessibilityRole="image"
      style={{
        position: "absolute",
        left: 2 + offsetIndex * (size * 0.55),
        bottom: 2,
        width: size,
        height: size,
        borderRadius: Math.max(4, size * 0.22),
        borderWidth: 2,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
      testID={`qubit-marker-cell-${qubit.cell}`}
    >
      <MaterialIcons
        color={style.iconColor}
        name={style.icon}
        size={iconSize}
      />
      {config?.entangled && qubit.collapsed === null ? (
        <View
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: size * 0.38,
            height: size * 0.38,
            borderRadius: 999,
            backgroundColor: palette.interference,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: palette.card,
          }}
        >
          <MaterialIcons
            color="#fff"
            name="hub"
            size={Math.max(7, size * 0.22)}
          />
        </View>
      ) : null}
      {showConfigLabel ? (
        <Text
          style={{
            position: "absolute",
            bottom: 1,
            fontSize: Math.max(6, size * 0.2),
            fontWeight: "800",
            color: palette.textMuted,
          }}
        >
          {config?.label === "Entangled" ? "⧗" : config?.label.slice(0, 3)}
        </Text>
      ) : null}
    </View>
  );
}

type QubitMarkerChipProps = {
  configIndex: number;
  palette: CraftPalette;
  size?: number;
  selected?: boolean;
};

/** Compact marker preview for the setup bar (matches board tiles). */
export function QubitMarkerChip({
  configIndex,
  palette,
  size = 28,
  selected = false,
}: QubitMarkerChipProps) {
  const config = QUBIT_CONFIGS[configIndex];
  if (!config) return null;

  const previewQubit: PlacedQubit = {
    id: `preview-${configIndex}`,
    cell: 0,
    owner: 0,
    configIndex,
    collapsed: null,
  };
  const style = markerStyle(previewQubit, palette);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(4, size * 0.22),
        borderWidth: 2,
        borderColor: selected ? palette.playerYou : style.borderColor,
        backgroundColor: style.backgroundColor,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
      }}
    >
      <MaterialIcons
        color={style.iconColor}
        name="blur-on"
        size={Math.max(12, size * 0.5)}
      />
      {config.entangled ? (
        <View
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: size * 0.36,
            height: size * 0.36,
            borderRadius: 999,
            backgroundColor: palette.interference,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons
            color="#fff"
            name="hub"
            size={Math.max(8, size * 0.24)}
          />
        </View>
      ) : null}
    </View>
  );
}
