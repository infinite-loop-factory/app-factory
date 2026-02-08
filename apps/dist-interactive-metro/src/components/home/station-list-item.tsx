"use client";

import { Pressable, Text, View } from "react-native";
import { cn } from "@infinite-loop-factory/common";

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
export function StationListItem({
  name,
  lines,
  onPress,
  disabled = false,
  accentBorder,
  className,
}: StationListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "mt-4 rounded-xl border border-outline-200 bg-background-0 px-4 py-3",
        accentBorder,
        disabled && "opacity-50",
        className,
      )}
      accessibilityLabel={lines ? `${name}, ${lines}` : name}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View className="min-w-0">
        <Text
          className="font-medium text-typography-900 text-sm"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        {lines != null && lines !== "" && (
          <Text
            className="mt-0.5 text-xs text-outline-500"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lines}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
