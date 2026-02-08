import type { LucideIcon } from "lucide-react-native";

import { TouchableOpacity, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text } from "../ui/text";

export type TabDef = {
  key: string;
  label: string;
  icon: LucideIcon;
};

type TabItemProps = {
  tab: TabDef;
  isActive: boolean;
  onPress: () => void;
};

export default function TabItem({ tab, isActive, onPress }: TabItemProps) {
  const primary500Color = useThemeColor({}, "--color-primary-500");
  const typography300Color = useThemeColor({}, "--color-typography-300");
  const Icon = tab.icon;

  return (
    <View className="flex-1 items-center">
      <TouchableOpacity
        className="w-full items-center justify-center py-2"
        onPress={onPress}
      >
        <View className="relative items-center justify-center">
          {isActive && (
            <View className="absolute -top-1.5 -right-2 -bottom-1.5 -left-2 rounded-2xl bg-primary-500/15" />
          )}
          <View className="h-9 w-11 items-center justify-center">
            <Icon
              color={
                isActive
                  ? `rgb(${primary500Color})`
                  : `rgb(${typography300Color})`
              }
              size={24}
              strokeWidth={2}
            />
          </View>
          <Text
            className={
              isActive
                ? "font-bold text-primary-500"
                : "font-semibold text-typography-300"
            }
            size="xs"
          >
            {tab.label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
