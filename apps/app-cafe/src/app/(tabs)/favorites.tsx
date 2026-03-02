/** biome-ignore-all assist/source/useSortedAttributes: lucide-react-native props */

import { View } from "react-native";
import { CafeCard } from "@/components/features/cafe/cafe-card";
import { BaseLayout } from "@/components/ui/layout/base-layout";
import { ThemedText } from "@/components/ui/themed-text";
import { UNSPLASH_IMAGE_1, UNSPLASH_IMAGE_2 } from "@/constants/images";
import { useTranslation } from "@/hooks/use-translation";

const FAVORITE_CAFES = [
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
    isFavorite: true,
  },
  {
    id: "3",
    name: "카페 루미",
    description: "특별한 라떼아트의 시그니처 음료",
    rating: 4.7,
    reviewCount: 189,
    location: "서울 용산구",
    image: UNSPLASH_IMAGE_2,
    tags: ["시그니처", "디저트", "분위기"],
    isOpen: false,
    isFavorite: true,
  },
];

export default function FavoritesScreen() {
  const { t } = useTranslation();

  return (
    <BaseLayout
      title={t(
        `favorites.${FAVORITE_CAFES.length ? "myFavorites" : "noFavorites"}`,
      )}
      scrollable={true}
    >
      <View className="px-4 pt-4">
        <View>
          <ThemedText
            className="mb-3 font-semibold text-lg text-typography-0"
            translationKey="favorites.myFavorites"
          >
            {" "}
            ({FAVORITE_CAFES.length})
          </ThemedText>
          {FAVORITE_CAFES.map((cafe) => (
            <View key={cafe.id} className="mb-4">
              <CafeCard cafe={cafe} />
            </View>
          ))}
        </View>
      </View>
    </BaseLayout>
  );
}
