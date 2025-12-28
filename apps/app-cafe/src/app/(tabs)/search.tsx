import { Search } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { CafeCard } from "@/components/cafe-card";
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

export default function SearchScreen() {
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
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="px-4 pt-4">
        <Text className="mb-4 font-bold text-2xl text-gray-900 dark:text-white">
          {i18n.t("searchCafes")}
        </Text>

        <View className="mb-6">
          <View className="flex-row items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <Search className="text-gray-400 dark:text-gray-500" size={20} />
            <TextInput
              className="flex-1 text-gray-900 dark:text-white"
              onChangeText={setSearchQuery}
              placeholder={i18n.t("searchPlaceholder")}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
            />
          </View>
        </View>

        <View>
          <Text className="mb-3 font-semibold text-gray-900 text-xl dark:text-white">
            검색 결과 ({filteredCafes.length})
          </Text>
          {filteredCafes.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-gray-500 dark:text-gray-400">
                검색 결과가 없습니다
              </Text>
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
    </ScrollView>
  );
}
