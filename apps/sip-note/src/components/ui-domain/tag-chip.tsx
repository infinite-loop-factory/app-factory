import { useColorScheme } from "nativewind";
import { Pressable, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useThemeColors } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";

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
  const colors = useThemeColors();
  const { colorScheme } = useColorScheme();
  const isLight = colorScheme === "light";
  const baseClass = "h-7 flex-row items-center rounded-pill px-3";
  const styleClass =
    variant === "filled"
      ? "bg-brand-soft"
      : "border border-border-subtle bg-surface";

  // Light 테마에서 caption text-brand 가 4.18:1 (AA-Large only) →
  // brand-strong (6.89:1 AAA) 으로 swap (Phase 1 Decision §6).
  const filledTextClass = isLight ? "text-brand-strong" : "text-brand";
  const filledStrokeColor = isLight ? colors.brandStrong : colors.brand;

  const content = (
    <>
      <Text
        className={
          variant === "filled"
            ? `font-text text-caption ${filledTextClass}`
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
                variant === "filled" ? filledStrokeColor : colors.textMuted
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
        accessibilityLabel={i18n.t("tasting.a11y.removeTag", { label })}
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
