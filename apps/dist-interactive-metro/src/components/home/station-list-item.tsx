import { cn } from "@infinite-loop-factory/common";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export interface StationListItemProps {
  name: string;
  lines?: string;
  onPress: () => void;
  disabled?: boolean;
  /** Optional accent border (e.g. border-secondary-200 for departure list) */
  accentBorder?: string;
  className?: string;
}

/**
 * Reusable station row for selection panels. Prevents text overflow with numberOfLines.
 */
export const StationListItem = memo(function StationListItem({
  name,
  lines,
  onPress,
  disabled = false,
  accentBorder,
  className,
}: StationListItemProps) {
  return (
    <Pressable
      accessibilityLabel={lines ? `${name}, ${lines}` : name}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={cn(
        "mt-4 rounded-xl border border-outline-200 bg-background-0 px-4 py-3",
        accentBorder,
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      onPress={onPress}
    >
      <View className="min-w-0">
        <Text
          className="font-medium text-sm text-typography-900"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {name}
        </Text>
        {lines != null && lines !== "" && (
          <Text
            className="mt-0.5 text-outline-500 text-xs"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {lines}
          </Text>
        )}
      </View>
    </Pressable>
  );
});
