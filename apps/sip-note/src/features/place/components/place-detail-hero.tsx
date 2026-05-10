import type { ReactNode } from "react";
import type { PlaceCategory } from "@/features/place/repo/types";

import { Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { GlassVessel } from "@/components/ui-domain/glass-vessel";
import { useThemeColors, withAlpha } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";

export type PlaceDetailHeroProps = {
  category?: PlaceCategory;
  visitCount?: number;
  /** Overlay slot — back button, wishlist toggle, etc. */
  children?: ReactNode;
};

const CORNER_CAP_SIZE = 14;

/**
 * Place detail hero — CaskHero 의 place 변형.
 * frame / corner caps / amber gradient 색조를 place.* 카테고리 색으로 dynamic.
 * 사진이 없으므로 항상 GlassVessel fallback (Phase 1 시그니처 시각 연결).
 *
 * Phase 2 signature moment.
 */
export function PlaceDetailHero({
  category,
  visitCount,
  children,
}: PlaceDetailHeroProps) {
  const colors = useThemeColors();
  const tint = category ? colors.place[category] : colors.brand;

  return (
    <View className="aspect-[4/3] overflow-hidden bg-surface-sunken">
      <View className="flex-1 items-center justify-center">
        <GlassVessel animate={false} fill={1} size={96} />
      </View>

      <View
        accessibilityElementsHidden
        className="absolute inset-0"
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        <Svg height="100%" preserveAspectRatio="none" width="100%">
          <Defs>
            <LinearGradient id="place-tint" x1="0" x2="0" y1="1" y2="0">
              <Stop offset="0%" stopColor={tint} stopOpacity={1} />
              <Stop offset="100%" stopColor={tint} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect
            fill="url(#place-tint)"
            height="100%"
            opacity={0.18}
            width="100%"
            x="0"
            y="0"
          />
        </Svg>

        <View
          className="absolute top-0 right-0 left-0 h-px"
          style={{ backgroundColor: withAlpha(tint, 0.45) }}
        />
        <View
          className="absolute right-0 bottom-0 left-0 h-px"
          style={{ backgroundColor: withAlpha(tint, 0.45) }}
        />
        <View
          className="absolute top-0 bottom-0 left-0 w-px"
          style={{ backgroundColor: withAlpha(tint, 0.45) }}
        />
        <View
          className="absolute top-0 right-0 bottom-0 w-px"
          style={{ backgroundColor: withAlpha(tint, 0.45) }}
        />

        <CornerCap corner="topLeft" tint={tint} />
        <CornerCap corner="topRight" tint={tint} />
        <CornerCap corner="bottomLeft" tint={tint} />
        <CornerCap corner="bottomRight" tint={tint} />
      </View>

      <View className="absolute right-3 bottom-3 left-3 flex-row items-end justify-between gap-2">
        {category ? (
          <View
            className="rounded-sm px-2 py-0.5"
            style={{ backgroundColor: withAlpha(tint, 0.55) }}
          >
            <Text
              accessibilityElementsHidden
              className="font-display font-semibold text-overline tracking-wider"
              importantForAccessibility="no-hide-descendants"
              style={{ color: colors.textOnBrand }}
            >
              {i18n.t(`placeCategory.${category}` as const).toUpperCase()}
            </Text>
          </View>
        ) : (
          <View />
        )}
        {visitCount != null && visitCount > 0 && (
          <View
            accessibilityLabel={i18n.t("place.detail.visitCount", {
              count: visitCount,
            })}
            accessibilityRole="text"
            className="rounded-pill px-3 py-1"
            style={{ backgroundColor: withAlpha(tint, 0.85) }}
          >
            <Text
              className="font-display font-semibold text-h3"
              style={{ color: colors.textOnBrand }}
            >
              {visitCount}
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
  tint: string;
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

function CornerCap({ corner, tint }: CornerProps) {
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
          stroke={tint}
          strokeLinecap="round"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
