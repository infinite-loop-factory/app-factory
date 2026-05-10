import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

export type DayDividerProps = {
  label: string;
};

/**
 * Day divider — caption-size brand text + bottom hairline.
 *
 * Light 테마에서는 `text-brand-strong` 으로 swap (Phase 1 Decision §6 carry-over).
 * caption-size text-brand 가 light bg 위 4.18:1 (AA-Large 만 통과) → strong = 6.89:1 AAA.
 */
export function DayDivider({ label }: DayDividerProps) {
  const { colorScheme } = useColorScheme();
  const brandClass =
    colorScheme === "light" ? "text-brand-strong" : "text-brand";
  return (
    <View className="mt-2 flex-row items-center gap-3">
      <Text
        className={`font-display font-semibold text-caption tracking-wide ${brandClass}`}
      >
        {label}
      </Text>
      <View className="h-px flex-1 bg-border-subtle" />
    </View>
  );
}
