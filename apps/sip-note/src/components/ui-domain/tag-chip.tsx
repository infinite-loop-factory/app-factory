import { Pressable, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";

export type TagChipProps = {
  label: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: "filled" | "outline";
};

export function TagChip({
  label,
  dismissible = false,
  onDismiss,
  variant = "filled",
}: TagChipProps) {
  const baseClass = "h-7 flex-row items-center rounded-pill px-3";
  const styleClass =
    variant === "filled"
      ? "bg-brand-soft"
      : "border border-border-subtle bg-surface";

  const content = (
    <>
      <Text
        className={
          variant === "filled"
            ? "font-text text-brand text-caption"
            : "font-text text-caption text-text-muted"
        }
      >
        {label}
      </Text>
      {dismissible && (
        <View className="ml-1">
          <Svg fill="none" height={10} viewBox="0 0 24 24" width={10}>
            <Path
              d="M6 6l12 12M18 6L6 18"
              stroke={
                variant === "filled"
                  ? "rgb(var(--color-brand))"
                  : "rgb(var(--color-text-muted))"
              }
              strokeLinecap="round"
              strokeWidth={2.5}
            />
          </Svg>
        </View>
      )}
    </>
  );

  if (dismissible && onDismiss) {
    return (
      <Pressable
        accessibilityLabel={`${label} 제거`}
        accessibilityRole="button"
        className={`${baseClass} ${styleClass} gap-1`}
        onPress={onDismiss}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={`${baseClass} ${styleClass}`}>{content}</View>;
}
