import { themeAtom } from "@/atoms/theme.atom";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import { openLanguageSetting } from "@infinite-loop-factory/common";
import { useAtom } from "jotai";
import { ChevronRight, Moon, Sun } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const [theme, setTheme] = useAtom(themeAtom);
  const toast = useToast();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const [
    background, // 카드 배경, 전체 배경
    borderColor, // 테두리
    errorColor, // 에러 타이틀
    headingColor, // 헤딩 텍스트
    textColor, // 일반 텍스트
    highlightColor, // 스위치 OFF일 때 트랙
    switchBgColor, // iOS 전용 스위치 배경
  ] = useThemeColor([
    "background",
    "outline-200",
    "error-600",
    "typography-900",
    "typography",
    "primary-400",
    "background-100",
  ]);

  const handleLanguageSetting = async () => {
    const openLanguageSettingResult = await openLanguageSetting();
    if (!openLanguageSettingResult) {
      toast.show({
        duration: 3000,
        render: () => {
          return (
            <Toast
              action="error"
              variant="outline"
              style={{
                backgroundColor: background,
                borderColor,
              }}
            >
              <ToastTitle style={{ color: errorColor }}>앗!</ToastTitle>
              <ToastDescription style={{ color: textColor }}>
                설정 &gt; 앱 &gt; 언어설정에서 직접 언어를 바꿔주세요.
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <ParallaxScrollView>
      <Box className="mb-4 px-1 pt-2">
        <Heading className="font-bold text-3xl" style={{ color: headingColor }}>
          {i18n.t("settings.title")}
        </Heading>
      </Box>

      {/* Appearance 그룹 */}
      <Box
        className="mx-1 mb-4 rounded-lg border shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        <Box
          className="border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Heading
            className="font-bold text-xl"
            style={{ color: headingColor }}
          >
            {i18n.t("settings.appearance.title")}
          </Heading>
        </Box>
        <View
          className="flex-row items-center justify-between border-b px-4 android:py-3 ios:py-3 py-4"
          style={{ borderColor }}
        >
          <View className="flex-row items-center">
            <Text
              className="mr-2 font-bold text-base"
              style={{ color: textColor }}
            >
              {i18n.t("settings.appearance.theme")}
            </Text>
            {theme === "light" ? (
              <Sun size={20} color={textColor} />
            ) : (
              <Moon size={20} color={textColor} />
            )}
          </View>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            // iOS 환경에서 배경색
            ios_backgroundColor={switchBgColor}
            // OFF / ON 트랙 색상
            trackColor={{ false: switchBgColor, true: switchBgColor }}
            // Thumb(동그라미) 색상
            thumbColor={highlightColor}
            // @ts-expect-error
            activeThumbColor={highlightColor}
          />
        </View>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4"
          onPress={handleLanguageSetting}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            {i18n.t("settings.appearance.language")}
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
      </Box>

      {/* General 그룹 */}
      <Box
        className="mx-1 mb-4 rounded-lg border shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        <Box
          className="border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Heading
            className="font-bold text-xl"
            style={{ color: headingColor }}
          >
            {i18n.t("settings.general.title")}
          </Heading>
        </Box>
        <TouchableOpacity
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            {i18n.t("settings.general.denylist")}
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            {i18n.t("settings.general.rate-the-app")}
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <Text className="font-bold text-base" style={{ color: textColor }}>
            {i18n.t("settings.general.license")}
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
      </Box>
    </ParallaxScrollView>
  );
}
