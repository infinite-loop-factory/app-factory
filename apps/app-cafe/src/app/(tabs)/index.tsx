import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { CafeCard } from "@/components/cafe-card";
import { ThemeToggle } from "@/components/theme-toggle";
import i18n from "@/i18n";

const MOCK_CAFES = [
  {
    id: "1",
    name: "커피 브루",
    description: "수제 로스팅의 최상급 에스프레소",
    rating: 4.8,
    reviewCount: 234,
    location: "서울 강남구",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
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
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
    tags: ["모닝", "브런치", "조용"],
    isOpen: true,
  },
  {
    id: "3",
    name: "카페 루미",
    description: "특별한 레시피의 시그니처 음료",
    rating: 4.7,
    reviewCount: 189,
    location: "서울 용산구",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    tags: ["시그니처", "디저트", "분위기"],
    isOpen: false,
  },
];

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="flex-row items-center justify-between px-4 pt-4">
        <View>
          <Text className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">
            {i18n.t("findCafesTitle")}
          </Text>
          <Text className="mb-5 text-xs text-gray-600 dark:text-gray-400">
            {i18n.t("findCafesSubtitle")}
          </Text>
        </View>
        <View className={"flex h-full items-center justify-center"}>
          <ThemeToggle />
        </View>
      </View>

      <View className="mb-10 px-4">
        <Text className="mb-3 font-semibold text-lg text-gray-900 dark:text-white">
          {i18n.t("popularCafes")}
        </Text>
        <ScrollView
          className="p-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex flex-row gap-4">
            {MOCK_CAFES.map((cafe) => (
              <View className="mr-4 w-[280px]" key={cafe.id}>
                <CafeCard
                  cafe={cafe}
                  onPress={() => router.push(`/cafe/${cafe.id}`)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="px-4">
        <Text className="mb-3 font-semibold text-lg text-gray-900 dark:text-white">
          {i18n.t("allCafes")}
        </Text>
        {MOCK_CAFES.map((cafe) => (
          <View className="mb-4" key={cafe.id}>
            <CafeCard
              cafe={cafe}
              onPress={() => router.push(`/cafe/${cafe.id}`)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
