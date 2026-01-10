import { Search } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { CafeCard } from "@/components/features/cafe/cafe-card";
import { Input, InputField, InputIcon } from "@/components/ui/common/input";
import { BaseLayout } from "@/components/ui/layout/base-layout";
import { ThemedText } from "@/components/ui/themed-text";
import {
  UNSPLASH_IMAGE_1,
  UNSPLASH_IMAGE_2,
  UNSPLASH_IMAGE_3,
} from "@/constants/images";
import { useThemeStore } from "@/hooks/use-theme";
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
    tags: ["수제", "원두", "분위기"],
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
    name: "카페 노엘",
    description: "특별한 라떼아트의 시그니처 음료",
    rating: 4.7,
    reviewCount: 189,
    location: "서울 용산구",
    image: UNSPLASH_IMAGE_3,
    tags: ["시그니처", "디저트", "분위기"],
    isOpen: false,
  },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const { mode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCafes = MOCK_CAFES.filter(
    (cafe) =>
      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cafe.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <BaseLayout scrollable title={t("search.searchCafes")}>
      <View className="gap-1 px-4 pb-10">
        <View className="mb-8">
          <Input variant={"rounded"}>
            <InputIcon>
              <Search size={18} />
            </InputIcon>
            <InputField
              onChangeText={setSearchQuery}
              placeholder={t("search.searchPlaceholder")}
              placeholderTextColor={mode === "dark" ? "#9CA3AF" : "#6B7280"}
              value={searchQuery}
            />
          </Input>
        </View>

        <View>
          <ThemedText
            className="mb-3 font-semibold text-lg text-typography-0"
            translationKey="search.searchResults"
          >
            {" "}
            ({filteredCafes.length})
          </ThemedText>
          {filteredCafes.length === 0 ? (
            <View className="items-center py-12">
              <ThemedText
                className="text-typography-300"
                translationKey="search.noSearchResults"
              />
            </View>
          ) : (
            filteredCafes.map((cafe) => (
              <View className="mb-4" key={cafe.id}>
                <CafeCard cafe={cafe} />
              </View>
            ))
          )}
        </View>
      </View>
    </BaseLayout>
  );
}
