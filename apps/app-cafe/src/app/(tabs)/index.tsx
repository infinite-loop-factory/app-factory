import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { CafeCard } from "@/components/features/cafe/cafe-card";
import ThemeToggle from "@/components/features/theme/controls/theme-toggle/theme-toggle.tsx";
import { SpotlightTheme } from "@/components/features/theme/lamp/spotlight-theme";
import { Stars } from "@/components/features/theme/stars/stars";
import { BaseLayout } from "@/components/ui/layout/base-layout";
import { ThemedText } from "@/components/ui/themed-text";
import { TitleText } from "@/components/ui/title.text";
import {
  UNSPLASH_IMAGE_1,
  UNSPLASH_IMAGE_2,
  UNSPLASH_IMAGE_3,
} from "@/constants/images";
import { THEME_STYLE_ENUM, useThemeStore } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";

const MOCK_CAFES = [
  {
    id: "1",
    name: "커피 블루",
    description: "수제 로스팅의 최상급 에스프레소",
    rating: 4.8,
    reviewCount: 234,
    location: "서울 강남구",
    image: UNSPLASH_IMAGE_1,
    tags: ["수제", "원두", "빈티지"],
    isOpen: true,
  },
  {
    id: "2",
    name: "모닝 블렌드",
    description: "아침에 어울리는 부드러운 커피",
    rating: 4.6,
    reviewCount: 156,
    location: "서울 마포구",
    image: UNSPLASH_IMAGE_2,
    tags: ["모닝", "브런치", "조용"],
    isOpen: true,
  },
  {
    id: "3",
    name: "카페 루미",
    description: "특별한 라떼아트의 시그니처 음료",
    rating: 4.7,
    reviewCount: 189,
    location: "서울 용산구",
    image: UNSPLASH_IMAGE_3,
    tags: ["시그니처", "디저트", "분위기"],
    isOpen: false,
  },
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDark, themeStyle } = useThemeStore();

  const masterRotation = useSharedValue(3);

  useEffect(() => {
    masterRotation.value = withRepeat(
      withTiming(-3, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [masterRotation]);

  return (
    <BaseLayout
      className="flex-1"
      enableTransition={true}
      isSafeArea={false}
      scrollable={true}
    >
      <Stars isDark={isDark} themeStyle={themeStyle} />
      <SpotlightTheme isDark={isDark} themeStyle={themeStyle} />
      <View className="relative px-4" style={{ zIndex: 2000 }}>
        <View className="flex-row items-center justify-between pt-[110px] pb-[40px]">
          <View className="relative flex-1" style={{ height: 85 }}>
            <TitleText className={"text-3xl"} enableTransition={true}>
              {t("home.findCafesTitle")}
            </TitleText>
            <View className="absolute" style={{ top: 43 }}>
              <ThemedText
                className="absolute font-medium text-primary-950"
                style={{ left: 1, top: 1, opacity: 0.5 }}
                translationKey="home.findCafesSubtitle"
              />
              <ThemedText
                className="font-medium text-primary-800"
                translationKey="home.findCafesSubtitle"
              />
            </View>
          </View>
          {themeStyle === THEME_STYLE_ENUM.STARS && (
            <View>
              <ThemeToggle />
            </View>
          )}
        </View>

        <View className="mb-10">
          <ThemedText
            className="mb-3 font-semibold text-lg text-typography-0"
            translationKey="home.popularCafes"
          />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 12 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View className="flex flex-row gap-3">
              {MOCK_CAFES.map((cafe) => (
                <View className={"min-w-[280px]"} key={cafe.id}>
                  <CafeCard
                    cafe={cafe}
                    onPress={() => router.push(`/cafe/${cafe.id}`)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View>
          <ThemedText
            className="mb-3 font-semibold text-lg text-typography-0"
            translationKey="home.allCafes"
          />
          {MOCK_CAFES.map((cafe) => (
            <View className="mb-4" key={cafe.id}>
              <CafeCard
                cafe={cafe}
                onPress={() => router.push(`/cafe/${cafe.id}`)}
              />
            </View>
          ))}
        </View>
      </View>
    </BaseLayout>
  );
}
