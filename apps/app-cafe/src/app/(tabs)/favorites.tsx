/** biome-ignore-all assist/source/useSortedAttributes: lucide-react-native props */

import { Heart } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { CafeCard } from "@/components/cafe-card";
import { useTranslation } from "@/hooks/use-translation";

const FAVORITE_CAFES = [
  {
    id: "1",
    name: "커피 블루",
    description: "수제 로스팅의 최상급 에스프레소",
    rating: 4.8,
    reviewCount: 234,
    location: "서울 강남구",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    tags: ["수제", "원두", "빈티지"],
    isOpen: true,
    isFavorite: true,
  },
  {
    id: "3",
    name: "카페 루미",
    description: "특별한 라떼아트의 시그니처 음료",
    rating: 4.7,
    reviewCount: 189,
    location: "서울 용산구",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    tags: ["시그니처", "디저트", "분위기"],
    isOpen: false,
    isFavorite: true,
  },
];

export default function FavoritesScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-background-100"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="px-4 pt-4">
        <View className="mb-6 flex-row items-center gap-3">
          <Text className="font-bold text-2xl text-typography-0">
            {t("favorites")}
          </Text>
        </View>

        {FAVORITE_CAFES.length === 0 ? (
          <View className="items-center py-12">
            <Heart
              size={64}
              className="mb-4 fill-primary-400 text-primary-400"
            />
            <Text className="text-center text-typography-300">
              {t("noFavorites")}
            </Text>
          </View>
        ) : (
          <View>
            <Text className="mb-3 font-semibold text-typography-0 text-xl">
              {t("myFavorites")} ({FAVORITE_CAFES.length})
            </Text>
            {FAVORITE_CAFES.map((cafe) => (
              <View key={cafe.id} className="mb-4">
                <CafeCard cafe={cafe} />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
