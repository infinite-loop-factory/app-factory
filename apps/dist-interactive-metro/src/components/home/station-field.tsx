"use client";

import { ChevronRight, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { cn } from "@infinite-loop-factory/common";
import type { Station } from "@/types/station";

export type StationFieldActiveVariant = "departure" | "arrival";

interface StationFieldProps {
  label: string
  placeholder: string
  value: Station | null
  onPress: () => void
  onClear?: () => void
  className?: string
  /** Hide label; rely on position (left = departure, right = arrival) */
  hideLabel?: boolean
  /** This field is currently being selected (highlight style) */
  active?: boolean
  activeVariant?: StationFieldActiveVariant
}

export function StationField({
  label,
  placeholder,
  value,
  onPress,
  onClear,
  className,
  hideLabel = false,
  active = false,
  activeVariant = "departure",
}: StationFieldProps) {
  const displayText = value ? value.name : placeholder;
  const isBlank = !value;
  const canClear = !isBlank && onClear != null;

  const activeBorder =
    active && activeVariant === "departure"
      ? "border-secondary-400 border-2"
      : active && activeVariant === "arrival"
        ? "border-primary-400 border-2"
        : "border-outline-200";
  const activeBg =
    active && activeVariant === "departure"
      ? "bg-secondary-0"
      : active && activeVariant === "arrival"
        ? "bg-primary-0"
        : "bg-background-0";

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center justify-between rounded-xl border px-3 py-3",
        activeBorder,
        activeBg,
        className,
      )}
      accessibilityLabel={`${label}: ${displayText}`}
      accessibilityRole="button"
    >
      <View className="min-w-0 flex-1">
        {!hideLabel && (
          <Text className="mb-0.5 text-outline-500 text-xs">{label}</Text>
        )}
        <Text
          className={cn(
            hideLabel ? "text-sm" : "text-sm",
            isBlank ? "text-outline-400" : "font-medium text-typography-900",
          )}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {displayText}
        </Text>
      </View>
      {canClear ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="mr-2 min-h-[28px] min-w-[28px] items-center justify-center rounded-full"
          accessibilityLabel="초기화"
          accessibilityRole="button"
        >
          <X size={18} className="text-outline-500" />
        </Pressable>
      ) : null}
      <ChevronRight size={16} className="shrink-0 text-outline-400" />
    </Pressable>
  );
}
