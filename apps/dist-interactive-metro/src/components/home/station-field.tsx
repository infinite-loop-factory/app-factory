import type { Station } from "@/types/station";

import { cn } from "@infinite-loop-factory/common";
import { ChevronRight, X } from "lucide-react-native";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import i18n from "@/i18n";

export type StationFieldActiveVariant = "departure" | "arrival";

function getActiveStyle(
  active: boolean,
  variant: StationFieldActiveVariant,
  styles: { departure: string; arrival: string; inactive: string },
): string {
  if (!active) return styles.inactive;
  if (variant === "departure") return styles.departure;
  return styles.arrival;
}

interface StationFieldProps {
  label: string;
  placeholder: string;
  value: Station | null;
  onPress: () => void;
  onClear?: () => void;
  className?: string;
  /** Hide label; rely on position (left = departure, right = arrival) */
  hideLabel?: boolean;
  /** This field is currently being selected (highlight style) */
  active?: boolean;
  activeVariant?: StationFieldActiveVariant;
}

export const StationField = memo(function StationField({
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

  const activeBorder = getActiveStyle(active, activeVariant, {
    departure: "border-secondary-400 border-2",
    arrival: "border-primary-400 border-2",
    inactive: "border-outline-200",
  });
  const activeBg = getActiveStyle(active, activeVariant, {
    departure: "bg-secondary-0",
    arrival: "bg-primary-0",
    inactive: "bg-background-0",
  });

  return (
    <View
      accessibilityLabel={`${label}: ${displayText}`}
      className={cn(
        "flex-row items-center justify-between rounded-xl border px-3 py-3",
        activeBorder,
        activeBg,
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        className="min-w-0 flex-1"
        onPress={onPress}
      >
        {!hideLabel && (
          <Text className="mb-0.5 text-outline-500 text-xs">{label}</Text>
        )}
        <Text
          className={cn(
            "text-sm",
            isBlank ? "text-outline-400" : "font-medium text-typography-900",
          )}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {displayText}
        </Text>
      </Pressable>
      {canClear && (
        <Pressable
          accessibilityLabel={i18n.t("via.clearAll")}
          accessibilityRole="button"
          className="mr-2 min-h-[28px] min-w-[28px] items-center justify-center rounded-full"
          onPress={onClear}
        >
          <X className="text-outline-500" size={18} />
        </Pressable>
      )}
      <Pressable onPress={onPress}>
        <ChevronRight className="shrink-0 text-outline-400" size={16} />
      </Pressable>
    </View>
  );
});
