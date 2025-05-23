import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  type ImageSourcePropType,
  Text,
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
    title: "카페 맛집",
    icon: require("../../assets/images/react-logo.png"),
    count: 120,
  },
  {
    id: "2",
    title: "테마 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 85,
  },
  {
    id: "3",
    title: "스터디 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 64,
  },
  {
    id: "4",
    title: "디저트 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 93,
  },
  {
    id: "5",
    title: "브런치 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 72,
  },
  {
    id: "6",
    title: "베이커리 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 58,
  },
  {
    id: "7",
    title: "북 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 47,
  },
  {
    id: "8",
    title: "루프탑 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 39,
  },
  {
    id: "9",
    title: "애견 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 81,
  },
  {
    id: "10",
    title: "보드게임 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 63,
  },
  {
    id: "11",
    title: "꽃/식물 카페",
    icon: require("../../assets/images/react-logo.png"),
    count: 42,
  },
  {
    id: "12",
    title: "전통 찻집",
    icon: require("../../assets/images/react-logo.png"),
    count: 37,
  },
];
const CategoryItem = ({ item }: { item: CategoryItem }) => (
  <TouchableOpacity className="flex-row items-center border-gray-200 border-b p-4">
    <Image source={item.icon} className="resize-contain mr-4 h-10 w-10" />
    <View className="flex-1">
      <Text className="mb-1 font-medium text-base">{item.title}</Text>
      <Text className="text-gray-600 text-xs">카페 {item.count}개</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

export default function CategoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["right", "left"]}>
      <View className="border-gray-200 border-b p-4">
        <Text className="font-bold text-lg">카테고리</Text>
      </View>

      <FlatList
        data={allCategories}
        renderItem={({ item }) => <CategoryItem item={item} />}
        keyExtractor={(item) => item.id}
        className="py-2"
      />
    </SafeAreaView>
  );
}
