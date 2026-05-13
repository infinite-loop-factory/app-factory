import { Pressable } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { haptic } from "@/lib/haptics";

export type FabProps = {
  onPress: () => void;
  accessibilityLabel: string;
  bottomOffset?: number;
};

export function Fab({
  onPress,
  accessibilityLabel,
  bottomOffset = 96,
}: FabProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="absolute right-5 h-14 w-14 items-center justify-center rounded-pill bg-brand shadow-fab active:opacity-80"
      onPress={() => {
        haptic.light();
        onPress();
      }}
      style={{ bottom: bottomOffset }}
    >
      <Svg fill="none" height={22} viewBox="0 0 24 24" width={22}>
        <Path
          d="M12 5v14M5 12h14"
          stroke={colors.brandOn}
          strokeLinecap="round"
          strokeWidth={2.4}
        />
      </Svg>
    </Pressable>
  );
}
