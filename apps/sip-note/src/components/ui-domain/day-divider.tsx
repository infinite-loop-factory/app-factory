import { Text, View } from "react-native";

export type DayDividerProps = {
  label: string;
};

export function DayDivider({ label }: DayDividerProps) {
  return (
    <View className="mt-2 flex-row items-center gap-3">
      <Text className="font-display font-semibold text-brand text-caption tracking-wide">
        {label}
      </Text>
      <View className="h-px flex-1 bg-border-subtle" />
    </View>
  );
}
