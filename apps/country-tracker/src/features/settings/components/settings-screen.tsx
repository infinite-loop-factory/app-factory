import { themeAtom } from "@/atoms/theme.atom";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import supabase from "@/libs/supabase";
import {
  openLanguageSetting,
  openStorePage,
} from "@infinite-loop-factory/common";
import { get } from "es-toolkit/compat";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { ChevronRight, Moon, Sun } from "lucide-react-native";
import { colorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const [theme, setTheme] = useAtom(themeAtom);
  const toast = useToast();
  const router = useRouter();
  const { user } = useAuthUser();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    colorScheme.set(nextTheme);
  };

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

  const provider = get(user, "identities.0.provider") as string | undefined;

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
              <ToastTitle style={{ color: errorColor }}>
                {i18n.t("settings.toast.language.title")}
              </ToastTitle>
              <ToastDescription style={{ color: textColor }}>
                {i18n.t("settings.toast.language.description")}
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <ParallaxScrollView>
      <Box className="mb-4 px-1 pt-2">
        <Heading className="font-bold text-3xl" style={{ color: headingColor }}>
          {i18n.t("settings.title")}
        </Heading>
      </Box>
      {/* 내 정보 박스 */}
      <Box className="mx-1 mb-4 flex-row items-center justify-between rounded-lg border p-4 shadow-xs">
        <Box className="flex-row items-center">
          <Image
            source={
              user?.user_metadata?.avatar_url
                ? { uri: user.user_metadata.avatar_url }
                : require("@/assets/images/icon.png")
            }
            className="mr-4 h-12 w-12 rounded-full"
            alt="avatar"
          />
          <Box>
            <Text className="font-bold text-lg" style={{ color: headingColor }}>
              {user?.user_metadata?.name || user?.email || "-"}
            </Text>
            <Box className="flex-row items-center">
              <Text className="text-gray-500 text-sm">{user?.email}</Text>
              <Badge action="muted" size="sm" className="ml-2">
                <BadgeText>{provider}</BadgeText>
              </Badge>
            </Box>
          </Box>
        </Box>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="font-bold text-error-600">
            {i18n.t("settings.logout")}
          </Text>
        </TouchableOpacity>
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
              <Sun size={24} color={textColor} style={{ marginLeft: 2 }} />
            ) : (
              <Moon
                size={24}
                color={highlightColor}
                style={{ marginLeft: 2 }}
              />
            )}
          </View>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            ios_backgroundColor={switchBgColor}
            trackColor={{ false: switchBgColor, true: switchBgColor }}
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
          onPress={() => openStorePage({})}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            {i18n.t("settings.general.rate-the-app")}
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between p-4"
          onPress={() => router.push("/settings/license")}
        >
          <Text className="font-bold text-base" style={{ color: textColor }}>
            {i18n.t("settings.general.license")}
          </Text>
          <ChevronRight size={20} color={textColor} />
        </TouchableOpacity>
      </Box>
    </ParallaxScrollView>
  );
}
