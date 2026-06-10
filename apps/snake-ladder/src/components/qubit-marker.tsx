import type { ComponentProps } from "react";
import type { CraftPalette } from "@/game/constants/palettes";
import type { PlacedQubit } from "@/game/types";

import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { QUBIT_CONFIGS } from "@/game/constants/board";
import i18n from "@/i18n";
import { darkenColor, lightenColor } from "@/lib/color";

type MarkerIcon = ComponentProps<typeof MaterialIcons>["name"];

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M${start.x.toFixed(2)},${start.y.toFixed(2)} A${r},${r} 0 ${largeArc} 1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
}

/**
 * Circular quantum medallion: an orb with a probability ring.
 * Green arc = ladder odds, red arc = snake odds, purple ring = entangled.
 */
function QuantumMedallion({
  size,
  orbColor,
  ladderProb,
  snakeProb,
  entangled,
  palette,
  icon,
  iconColor = "#fffdf5",
  ringOverride,
}: {
  size: number;
  orbColor: string;
  ladderProb: number;
  snakeProb: number;
  entangled: boolean;
  palette: CraftPalette;
  icon: MarkerIcon;
  iconColor?: string;
  /** Solid ring color for collapsed states (replaces the probability arcs). */
  ringOverride?: string;
}) {
  const ringW = Math.max(2, size * 0.13);
  const c = size / 2;
  const ringR = c - ringW / 2 - 0.5;
  const orbR = ringR - ringW * 0.85;
  const gradientId = `qubit-orb-${orbColor.replace("#", "")}-${size.toFixed(0)}`;

  const ladderSweep = 360 * ladderProb;
  const gap = ladderProb > 0 && snakeProb > 0 ? 4 : 0;

  const ring = (() => {
    if (ringOverride) {
      return (
        <Circle
          cx={c}
          cy={c}
          fill="none"
          r={ringR}
          stroke={ringOverride}
          strokeWidth={ringW}
        />
      );
    }
    if (entangled) {
      return (
        <Circle
          cx={c}
          cy={c}
          fill="none"
          r={ringR}
          stroke={palette.interference}
          strokeDasharray={`${(Math.PI * 2 * ringR) / 14} ${(Math.PI * 2 * ringR) / 28}`}
          strokeLinecap="round"
          strokeWidth={ringW}
        />
      );
    }
    return (
      <>
        <Path
          d={arcPath(c, c, ringR, gap / 2, ladderSweep - gap / 2)}
          fill="none"
          stroke={palette.ladder}
          strokeLinecap="round"
          strokeWidth={ringW}
        />
        <Path
          d={arcPath(c, c, ringR, ladderSweep + gap / 2, 360 - gap / 2)}
          fill="none"
          stroke={palette.snake}
          strokeLinecap="round"
          strokeWidth={ringW}
        />
      </>
    );
  })();

  return (
    <View style={{ width: size, height: size }}>
      <Svg height={size} width={size}>
        <Defs>
          <RadialGradient cx="35%" cy="30%" id={gradientId} r="80%">
            <Stop offset="0" stopColor={lightenColor(orbColor, 0.45)} />
            <Stop offset="0.55" stopColor={orbColor} />
            <Stop offset="1" stopColor={darkenColor(orbColor, 0.6)} />
          </RadialGradient>
        </Defs>
        {/* drop shadow */}
        <Circle
          cx={c}
          cy={c + size * 0.05}
          fill="#000"
          opacity={0.18}
          r={ringR}
        />
        {/* ring */}
        {ring}
        {/* orb */}
        <Circle
          cx={c}
          cy={c}
          fill={`url(#${gradientId})`}
          r={orbR}
          stroke={darkenColor(orbColor, 0.5)}
          strokeOpacity={0.6}
          strokeWidth={0.8}
        />
        {/* specular highlight */}
        <Circle
          cx={c - orbR * 0.32}
          cy={c - orbR * 0.38}
          fill="#fff"
          opacity={0.35}
          r={orbR * 0.32}
        />
      </Svg>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialIcons
          color={iconColor}
          name={icon}
          size={Math.max(9, orbR * 1.15)}
        />
      </View>
    </View>
  );
}

type QubitMarkerProps = {
  qubit: PlacedQubit;
  palette: CraftPalette;
  size: number;
  offsetIndex?: number;
};

function markerLabel(qubit: PlacedQubit, entangled: boolean): string {
  if (qubit.collapsed === "ladder")
    return i18n.t("board.qubit.collapsedLadder");
  if (qubit.collapsed === "snake") return i18n.t("board.qubit.collapsedSnake");
  if (qubit.collapsed === "interference") {
    return i18n.t("board.qubit.collapsedInterference");
  }
  return entangled
    ? i18n.t("board.qubit.entangled")
    : i18n.t("board.qubit.active");
}

export function QubitMarker({
  qubit,
  palette,
  size,
  offsetIndex = 0,
}: QubitMarkerProps) {
  const config = QUBIT_CONFIGS[qubit.configIndex];
  const entangled = config?.entangled ?? Boolean(qubit.entangledPartnerId);
  const ownerColor = qubit.owner === 0 ? palette.playerYou : palette.playerCpu;

  const collapsed = qubit.collapsed;
  const orbColor = (() => {
    if (collapsed === "ladder") return palette.ladder;
    if (collapsed === "snake") return palette.snake;
    if (collapsed === "interference") return palette.interference;
    return entangled ? palette.interference : ownerColor;
  })();
  const icon: MarkerIcon = (() => {
    if (collapsed === "ladder") return "arrow-upward";
    if (collapsed === "snake") return "arrow-downward";
    if (collapsed === "interference") return "compare-arrows";
    return "blur-on";
  })();
  const ringOverride = collapsed ? darkenColor(orbColor, 0.7) : undefined;

  return (
    <View
      accessibilityLabel={markerLabel(qubit, entangled)}
      accessibilityRole="image"
      style={{
        position: "absolute",
        left: 2 + offsetIndex * (size * 0.55),
        bottom: 2,
      }}
      testID={`qubit-marker-cell-${qubit.cell}`}
    >
      <QuantumMedallion
        entangled={entangled}
        icon={icon}
        ladderProb={config?.ladderProb ?? 0.5}
        orbColor={orbColor}
        palette={palette}
        ringOverride={ringOverride}
        size={size}
        snakeProb={config?.snakeProb ?? 0.5}
      />
      {entangled && collapsed === null ? (
        <View
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: size * 0.4,
            height: size * 0.4,
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
    </View>
  );
}

type QubitMarkerChipProps = {
  configIndex: number;
  palette: CraftPalette;
  size?: number;
  selected?: boolean;
};

/** Compact medallion preview for the setup bar (matches board markers). */
export function QubitMarkerChip({
  configIndex,
  palette,
  size = 28,
  selected = false,
}: QubitMarkerChipProps) {
  const config = QUBIT_CONFIGS[configIndex];
  if (!config) return null;

  return (
    <View
      style={{
        marginBottom: 4,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: selected ? palette.playerYou : "transparent",
        padding: 1,
      }}
    >
      <QuantumMedallion
        entangled={config.entangled}
        icon="blur-on"
        ladderProb={config.ladderProb}
        orbColor={config.entangled ? palette.interference : palette.playerYou}
        palette={palette}
        size={size}
        snakeProb={config.snakeProb}
      />
      {config.entangled ? (
        <View
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: size * 0.38,
            height: size * 0.38,
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
