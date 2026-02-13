import { cn } from "@infinite-loop-factory/common";
import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import i18n from "@/i18n";

interface AddViaFieldProps {
  label: string;
  viaCount: number;
  onPress: () => void;
  onClearVia?: () => void;
  className?: string;
  disabled?: boolean;
  maxReached?: boolean;
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
    subText = maxReached
      ? i18n.t("via.countMax", { count: viaCount })
      : i18n.t("via.count", { count: viaCount });
  } else if (maxReached) {
    subText = i18n.t("via.max", { max: 3 });
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
        accessibilityLabel={subText ? `${label}: ${subText}` : label}
        accessibilityRole="button"
        className="min-w-0 items-center gap-0.5"
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
      >
        <Plus className="shrink-0 text-outline-400" size={16} />
        <Text
          className="min-w-0 max-w-full font-medium text-typography-700 text-xs"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {subText ?? label}
        </Text>
      </Pressable>
      {hasVia && onClearVia != null && (
        <Pressable
          accessibilityLabel={i18n.t("via.clearAll")}
          accessibilityRole="button"
          className="mt-1.5"
          onPress={onClearVia}
        >
          <Text className="text-outline-500 text-xs">
            {i18n.t("via.clearAll")}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
