import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import { useLanguageStore } from "@/hooks/use-language";
import i18n, { setLocale } from "@/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const isEnglish = language === "en";
  const translateX = useRef(new Animated.Value(isEnglish ? 2 : 24)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isEnglish ? 2 : 24,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isEnglish, translateX]);

  const handleLanguageChange = () => {
    setLanguage(isEnglish ? "ko" : "en");
  };

  return (
    <View>
      <Pressable
        className="relative max-w-[52px] flex-row items-center overflow-hidden rounded-full bg-gray-700"
        onPress={handleLanguageChange}
        style={{
          width: 48,
          height: 24,
          padding: 2,
        }}
      >
        <Animated.View
          className="absolute rounded-full"
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              transform: [{ translateX }],
              backgroundColor: "#795548",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: Platform.OS === "ios" ? 0.4 : 0.2,
              shadowRadius: Platform.OS === "ios" ? 4 : 3,
              elevation: Platform.OS === "android" ? 6 : 4,
            },
          ]}
        >
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ borderRadius: 10 }}
          >
            <Text
              className="text-[10px]"
              style={{
                color: "#FFFFFF",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.2,
                shadowRadius: Platform.OS === "ios" ? 2 : 1,
                elevation: Platform.OS === "android" ? 3 : 2,
              }}
            >
              {isEnglish ? "🇺🇸" : "🇰🇷"}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
