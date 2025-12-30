import { Globe, Palette } from "lucide-react-native";
import { Text, View } from "react-native";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTranslation } from "@/hooks/use-translation";

export function LanguageAndThemeToggle() {
  const { t } = useTranslation();

  return (
    <View className="overflow-hidden rounded-xl bg-background-0">
      <Text className="flex h-[42px] items-center px-4 pt-2 pb-2 font-semibold text-base text-typography-100">
        {t("settings")}
      </Text>
      <View className="border-outline-200 border-t">
        <View className="h-[48px] flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Globe className="text-outline-400" size={20} />
            <Text className="text-typography-100">{t("language")}</Text>
          </View>
          <LanguageToggle />
        </View>
        <View className="h-[48px] flex-row items-center justify-between border-outline-200 border-t px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Palette className="text-outline-400" size={20} />
            <Text className="text-typography-100">{t("theme")}</Text>
          </View>
          <ThemeSwitch />
        </View>
      </View>
    </View>
  );
}
