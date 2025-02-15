import { themeAtom } from "@/atoms/theme.atom";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAtom } from "jotai";
import { ChevronRight, Moon, Sun } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const [theme, setTheme] = useAtom(themeAtom);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const [
    background, // 카드 배경, 전체 배경
    borderColor, // 테두리 색
    headingColor, // 헤딩 텍스트 색
    textColor, // 일반 텍스트 색
    highlightColor, // 스위치 OFF일 때 트랙 색상
    switchBgColor, // iOS 전용 배경색
  ] = useThemeColor([
    "background",
    "outline-200",
    "typography-900",
    "typography",
    "primary-400", // ON 트랙용 (주황색 계열)
    "background-100", // iOS 백그라운드
  ]);

  return (
    <ParallaxScrollView>
      {/* 상단 헤더 영역 */}
      <Box className="mb-4 px-1 pt-6">
        <Heading className="font-bold text-3xl" style={{ color: headingColor }}>
          Settings
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
            Appearance
          </Heading>
        </Box>
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <Text
              className="mr-2 font-bold text-base"
              style={{ color: textColor }}
            >
              Theme
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
        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <Text className="font-bold text-base" style={{ color: textColor }}>
            Language
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
            General
          </Heading>
        </Box>
        <TouchableOpacity
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            Rate the App
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            License
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <Text className="font-bold text-base" style={{ color: textColor }}>
            Denylist Countries
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
      </Box>
    </ParallaxScrollView>
  );
}
