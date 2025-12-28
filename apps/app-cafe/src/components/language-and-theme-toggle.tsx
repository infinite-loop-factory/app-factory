import { Globe, Palette } from "lucide-react-native";
import { Text, View } from "react-native";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function LanguageAndThemeToggle() {
  return (
    <View className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
      <Text className="px-4 pt-3 pb-2 font-semibold text-base text-gray-900 dark:text-white">
        설정
      </Text>
      <View className="border-t border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Globe className="text-gray-400 dark:text-gray-500" size={20} />
            <Text className="text-gray-900 dark:text-white">언어</Text>
          </View>
          <LanguageToggle />
        </View>
        <View className="flex-row items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Palette className="text-gray-400 dark:text-gray-500" size={20} />
            <Text className="text-gray-900 dark:text-white">테마</Text>
          </View>
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
}
