import type { ReactNode } from "react";
import type { TastingCategory } from "@/db/schema";

import { Image, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { GlassVessel } from "@/components/ui-domain/glass-vessel";
import { useThemeColors, withAlpha } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";

export type CaskHeroProps = {
  photoUri?: string;
  category?: TastingCategory;
  score?: number | null;
  /** Overlay slot — back button, photo dots, etc. Layered above all treatment. */
  children?: ReactNode;
};

const CORNER_CAP_SIZE = 14;

/**
 * Detail screen hero with cask treatment — photo (or glass fallback)
 * + brand-tinted frame + cask-hoop corner caps + bottom amber gradient
 * + label-style category badge + score badge.
 *
 * Phase 1 signature moment 2 of 2.
 */
export function CaskHero({
  photoUri,
  category,
  score,
  children,
}: CaskHeroProps) {
  const colors = useThemeColors();

  return (
    <View className="aspect-[4/3] overflow-hidden bg-surface-sunken">
      {photoUri ? (
        <Image
          accessibilityIgnoresInvertColors
          className="h-full w-full"
          source={{ uri: photoUri }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <GlassVessel animate={false} fill={1} size={96} />
        </View>
      )}

      <View
        accessibilityElementsHidden
        className="absolute inset-0"
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        <Svg height="100%" preserveAspectRatio="none" width="100%">
          <Defs>
            <LinearGradient id="cask-amber" x1="0" x2="0" y1="1" y2="0">
              <Stop offset="0%" stopColor={colors.brandSoft} stopOpacity={1} />
              <Stop
                offset="100%"
                stopColor={colors.brandSoft}
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>
          <Rect
            fill="url(#cask-amber)"
            height="100%"
            opacity={0.18}
            width="100%"
            x="0"
            y="0"
          />
        </Svg>

        <View
          className="absolute top-0 right-0 left-0 h-px"
          style={{ backgroundColor: withAlpha(colors.brand, 0.45) }}
        />
        <View
          className="absolute right-0 bottom-0 left-0 h-px"
          style={{ backgroundColor: withAlpha(colors.brand, 0.45) }}
        />
        <View
          className="absolute top-0 bottom-0 left-0 w-px"
          style={{ backgroundColor: withAlpha(colors.brand, 0.45) }}
        />
        <View
          className="absolute top-0 right-0 bottom-0 w-px"
          style={{ backgroundColor: withAlpha(colors.brand, 0.45) }}
        />

        <CornerCap colors={colors} corner="topLeft" />
        <CornerCap colors={colors} corner="topRight" />
        <CornerCap colors={colors} corner="bottomLeft" />
        <CornerCap colors={colors} corner="bottomRight" />
      </View>

      <View className="absolute right-3 bottom-3 left-3 flex-row items-end justify-between gap-2">
        {category ? (
          <View
            className="rounded-sm px-2 py-0.5"
            style={{ backgroundColor: withAlpha(colors.brand, 0.55) }}
          >
            <Text
              accessibilityElementsHidden
              className="font-display font-semibold text-overline tracking-wider"
              importantForAccessibility="no-hide-descendants"
              style={{ color: colors.brandOn }}
            >
              {i18n.t(`category.${category}` as const).toUpperCase()}
            </Text>
          </View>
        ) : (
          <View />
        )}
        {score != null && (
          <View
            accessibilityLabel={i18n.t("tasting.a11y.score", {
              score: score.toFixed(1),
            })}
            accessibilityRole="text"
            className="rounded-pill px-3 py-1"
            style={{ backgroundColor: withAlpha(colors.brand, 0.85) }}
          >
            <Text
              className="font-display font-semibold text-h3"
              style={{ color: colors.brandOn }}
            >
              {score.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {children}
    </View>
  );
}

type Corner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

type CornerProps = {
  corner: Corner;
  colors: ReturnType<typeof useThemeColors>;
};

const CORNER_POSITION: Record<Corner, string> = {
  topLeft: "top-0 left-0",
  topRight: "top-0 right-0",
  bottomLeft: "bottom-0 left-0",
  bottomRight: "right-0 bottom-0",
};

const CORNER_PATH: Record<Corner, string> = {
  topLeft: `M0 ${CORNER_CAP_SIZE} L0 0 L${CORNER_CAP_SIZE} 0`,
  topRight: `M0 0 L${CORNER_CAP_SIZE} 0 L${CORNER_CAP_SIZE} ${CORNER_CAP_SIZE}`,
  bottomLeft: `M0 0 L0 ${CORNER_CAP_SIZE} L${CORNER_CAP_SIZE} ${CORNER_CAP_SIZE}`,
  bottomRight: `M0 ${CORNER_CAP_SIZE} L${CORNER_CAP_SIZE} ${CORNER_CAP_SIZE} L${CORNER_CAP_SIZE} 0`,
};

function CornerCap({ corner, colors }: CornerProps) {
  const positionClass = CORNER_POSITION[corner];
  const path = CORNER_PATH[corner];

  return (
    <View className={`absolute ${positionClass}`}>
      <Svg
        height={CORNER_CAP_SIZE}
        viewBox={`0 0 ${CORNER_CAP_SIZE} ${CORNER_CAP_SIZE}`}
        width={CORNER_CAP_SIZE}
      >
        <Path
          d={path}
          fill="none"
          stroke={colors.brand}
          strokeLinecap="round"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
