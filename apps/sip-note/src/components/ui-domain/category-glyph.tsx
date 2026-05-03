import type React from "react";
import type { TastingCategory } from "@/db/schema";

import { Path, Rect, Svg } from "react-native-svg";
import { useThemeColors } from "@/hooks/use-theme-colors";

const PATHS: Record<TastingCategory, React.ReactNode> = {
  whiskey: (
    <>
      <Path d="M6 4h12l-1 14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3L6 4z" />
      <Path d="M7 13h10" />
    </>
  ),
  wine: (
    <>
      <Path d="M8 3h8l-.7 6a4 4 0 0 1-7.6 0L7 3z" />
      <Path d="M12 13v8M9 21h6" />
    </>
  ),
  beer: (
    <>
      <Rect height={17} rx={1.2} width={9} x={6} y={4} />
      <Path d="M15 8h2a2.5 2.5 0 0 1 2.5 2.5v3A2.5 2.5 0 0 1 17 16h-2" />
    </>
  ),
  sake: (
    <>
      <Rect height={4} rx={0.8} width={10} x={7} y={3} />
      <Path d="M8 7l-.7 11a1.6 1.6 0 0 0 1.6 1.7h6.2a1.6 1.6 0 0 0 1.6-1.7L16 7" />
    </>
  ),
  cocktail: <Path d="M3 5h18l-9 11zM12 16v6M9 22h6" />,
  etc: (
    <>
      <Path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
      <Path d="M8 12h8M12 8v8" />
    </>
  ),
};

export type CategoryGlyphProps = {
  category: TastingCategory;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function CategoryGlyph({
  category,
  size = 24,
  color,
  strokeWidth = 1.5,
}: CategoryGlyphProps) {
  const colors = useThemeColors();
  const stroke = color ?? colors.drink[category];

  return (
    <Svg
      fill="none"
      height={size}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {PATHS[category]}
    </Svg>
  );
}
