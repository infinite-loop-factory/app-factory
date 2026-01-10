import { memo } from "react";
import { Platform, Text } from "react-native";
import { Toggle } from "@/components/ui/toggle";
import { useThemeStore } from "@/hooks/use-theme";
import { useLanguageStore } from "@/hooks/use-translation";
import { setLocale } from "@/i18n";

export const LanguageToggle = memo(function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const isEnglish = language === "en";
  const mode = useThemeStore((state) => state.mode);

  const handleLanguageChange = () => {
    const newLang = isEnglish ? "ko" : "en";
    setLocale(newLang);
    setLanguage(newLang);
  };

  return (
    <Toggle
      backgroundColor={
        mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
      }
      isActive={isEnglish}
      leftContent={
        <Text
          className="text-[12px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
            shadowRadius: Platform.OS === "ios" ? 2 : 1,
            elevation: Platform.OS === "android" ? 3 : 2,
          }}
        >
          🇰🇷
        </Text>
      }
      onPress={handleLanguageChange}
      rightContent={
        <Text
          className="text-[12px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
            shadowRadius: Platform.OS === "ios" ? 2 : 1,
            elevation: Platform.OS === "android" ? 3 : 2,
          }}
        >
          🇺🇸
        </Text>
      }
    />
  );
});
