import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  type ImageSourcePropType,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CategoryItem {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  count: number;
}

// Mock data for all categories
const allCategories: CategoryItem[] = [
  {
    id: "1",
    title: "커피 전문점",
    icon: require("../../assets/images/react-logo.png"),
    count: 120,
  },
  {
    id: "2",
    title: "로스터리 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 85,
  },
  {
    id: "3",
    title: "드립 커피 전문점",
    icon: require("../../assets/images/react-logo.png"),
    count: 64,
  },
  {
    id: "4",
    title: "에스프레소 바",
    icon: require("../../assets/images/react-logo.png"),
    count: 93,
  },
  {
    id: "5",
    title: "커피/디저트",
    icon: require("../../assets/images/react-logo.png"),
    count: 72,
  },
  {
    id: "6",
    title: "카페/브런치",
    icon: require("../../assets/images/react-logo.png"),
    count: 58,
  },
  {
    id: "7",
    title: "스페셜티 커피",
    icon: require("../../assets/images/react-logo.png"),
    count: 47,
  },
  {
    id: "8",
    title: "프리미엄 커피",
    icon: require("../../assets/images/react-logo.png"),
    count: 39,
  },
  {
    id: "9",
    title: "핸드드립 커피",
    icon: require("../../assets/images/react-logo.png"),
    count: 81,
  },
  {
    id: "10",
    title: "콜드브루 전문점",
    icon: require("../../assets/images/react-logo.png"),
    count: 63,
  },
  {
    id: "11",
    title: "오가닉 커피",
    icon: require("../../assets/images/react-logo.png"),
    count: 42,
  },
  {
    id: "12",
    title: "블렌드 커피",
    icon: require("../../assets/images/react-logo.png"),
    count: 37,
  },
];
const CategoryItem = ({ item }: { item: CategoryItem }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center border-gray-200 border-b p-4"
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <Image className="resize-contain mr-4 h-10 w-10" source={item.icon} />
      <View className="flex-1">
        <Text className="mb-1 font-medium text-base">{item.title}</Text>
        <Text className="text-gray-600 text-xs">카페 {item.count}개</Text>
      </View>
      <Ionicons color="#ccc" name="chevron-forward" size={20} />
    </TouchableOpacity>
  );
};

export default function CategoryScreen() {
  const [query, setQuery] = useState("");
  const filtered = allCategories.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["right", "left"]}>
      <View className="border-gray-200 border-b p-4">
        <Text className="mb-2 font-bold text-lg">카테고리</Text>
        <View className="flex-row items-center rounded-md border border-gray-300 px-3 py-2">
          <Ionicons color="#9ca3af" name="search" size={16} />
          <TextInput
            className="ml-2 flex-1 text-base"
            onChangeText={setQuery}
            placeholder="카테고리 검색"
            value={query}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons color="#9ca3af" name="close-circle" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        className="py-2"
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View className="items-center justify-center p-6">
            <Text className="text-gray-500">검색 결과가 없습니다.</Text>
          </View>
        )}
        renderItem={({ item }) => <CategoryItem item={item} />}
      />
    </SafeAreaView>
  );
}
