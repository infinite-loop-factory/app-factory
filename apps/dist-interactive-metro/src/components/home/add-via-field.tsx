"use client";

import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { cn } from "@infinite-loop-factory/common";

interface AddViaFieldProps {
  label: string
  viaCount: number
  onPress: () => void
  onClearVia?: () => void
  className?: string
  disabled?: boolean
  maxReached?: boolean
}

export function AddViaField({
  label,
  viaCount,
  onPress,
  onClearVia,
  className,
  disabled = false,
  maxReached = false,
}: AddViaFieldProps) {
  const hasVia = viaCount > 0;
  let subText: string | undefined;
  if (hasVia) {
    subText = `${viaCount}개 경유역${maxReached ? " (최대)" : ""}`;
  } else if (maxReached) {
    subText = "최대 3개";
  }

  return (
    <View
      className={cn(
        "min-w-0 flex-1 items-center justify-center rounded-xl border border-outline-200 border-dashed bg-background-50 px-2 py-3",
        disabled && "opacity-50",
        className,
      )}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        className="min-w-0 items-center gap-0.5"
        accessibilityLabel={subText ? `${label}: ${subText}` : label}
        accessibilityRole="button"
      >
        <Plus size={16} className="shrink-0 text-outline-400" />
        <Text
          className="min-w-0 max-w-full font-medium text-typography-700 text-xs"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {subText ?? label}
        </Text>
      </Pressable>
      {hasVia && onClearVia != null && (
        <Pressable
          onPress={onClearVia}
          className="mt-1.5"
          accessibilityLabel="경유 초기화"
          accessibilityRole="button"
        >
          <Text className="text-outline-500 text-xs">초기화</Text>
        </Pressable>
      )}
    </View>
  );
}
