import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for categories
const categories = {
  "1": {
    id: "1",
    title: "커피 전문점",
    description: "다양한 커피를 전문적으로 제공하는 카페들을 모았습니다.",
    image: require("../../assets/images/react-logo.png"),
    cafes: [
      {
        id: "1",
        title: "블루보틀 커피",
        address: "서울시 강남구 삼성로 123",
        rating: "4.8",
        reviews: "340",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "2",
        title: "스타벅스 리저브",
        address: "서울시 종로구 공평동 100",
        rating: "4.7",
        reviews: "520",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "3",
        title: "커피빈",
        address: "서울시 서초구 서초대로 77길 55",
        rating: "4.5",
        reviews: "280",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "4",
        title: "폴 바셋",
        address: "서울시 강남구 테헤란로 231",
        rating: "4.6",
        reviews: "310",
        image: require("../../assets/images/react-logo.png"),
      },
    ],
  },
  "2": {
    id: "2",
    title: "로스터리 카페",
    description:
      "직접 원두를 로스팅하여 신선한 커피를 제공하는 로스터리 카페들입니다.",
    image: require("../../assets/images/react-logo.png"),
    cafes: [
      {
        id: "5",
        title: "프릳츠 커피",
        address: "서울시 성동구 서울숲길 17",
        rating: "4.9",
        reviews: "420",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "6",
        title: "나무사이로",
        address: "서울시 마포구 와우산로 29길 14",
        rating: "4.7",
        reviews: "290",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "7",
        title: "커피리브레",
        address: "서울시 용산구 이태원로 266",
        rating: "4.6",
        reviews: "350",
        image: require("../../assets/images/react-logo.png"),
      },
    ],
  },
  "3": {
    id: "3",
    title: "드립 커피 전문점",
    description:
      "정성스럽게 핸드드립으로 내린 커피를 즐길 수 있는 카페들입니다.",
    image: require("../../assets/images/react-logo.png"),
    cafes: [
      {
        id: "8",
        title: "커피 한약방",
        address: "서울시 종로구 자하문로 10길 30",
        rating: "4.8",
        reviews: "270",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "9",
        title: "커피 볶는 집",
        address: "서울시 마포구 동교로 46길 8",
        rating: "4.7",
        reviews: "320",
        image: require("../../assets/images/react-logo.png"),
      },
    ],
  },
};

interface ICafe {
  id: string;
  title: string;
  address: string;
  rating: string;
  reviews: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  image: any;
}

// Cafe item component
const CafeItem = ({ item, onPress }: { item: ICafe; onPress: () => void }) => (
  <TouchableOpacity
    className="mb-4 flex-row border-gray-100 border-b pb-4"
    onPress={onPress}
  >
    <Image
      source={item.image}
      className="h-20 w-20 rounded-md bg-gray-200"
      resizeMode="cover"
    />
    <View className="ml-3 flex-1 justify-center">
      <Text className="font-bold text-base">{item.title}</Text>
      <Text className="mt-1 text-gray-600 text-sm">{item.address}</Text>
      <View className="mt-1 flex-row items-center">
        <Text className="font-bold text-yellow-500">{item.rating}</Text>
        <Text className="ml-1 text-gray-500">({item.reviews} 리뷰)</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [sortBy, setSortBy] = useState("인기순");

  // Get category details based on ID
  const category = categories[id as keyof typeof categories];

  if (!category) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>카테고리를 찾을 수 없습니다.</Text>
        <TouchableOpacity
          className="mt-4 rounded-md bg-black px-4 py-2"
          onPress={() => router.back()}
        >
          <Text className="text-white">돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View className="relative">
          <Image
            source={category.image}
            className="h-48 w-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-4 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 p-2"
            onPress={() => router.back()}
          >
            <Text className="text-white">←</Text>
          </TouchableOpacity>
        </View>

        {/* Category Info */}
        <View className="p-4">
          <Text className="font-bold text-2xl">{category.title}</Text>
          <Text className="mt-2 text-gray-600">{category.description}</Text>

          {/* Sort options */}
          <View className="mt-4 flex-row border-gray-200 border-b pb-2">
            <Text className="font-bold">정렬: </Text>
            <TouchableOpacity onPress={() => setSortBy("인기순")}>
              <Text
                className={`ml-2 ${sortBy === "인기순" ? "font-bold text-black" : "text-gray-400"}`}
              >
                인기순
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortBy("거리순")}>
              <Text
                className={`ml-4 ${sortBy === "거리순" ? "font-bold text-black" : "text-gray-400"}`}
              >
                거리순
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortBy("평점순")}>
              <Text
                className={`ml-4 ${sortBy === "평점순" ? "font-bold text-black" : "text-gray-400"}`}
              >
                평점순
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cafe List */}
        <View className="p-4">
          <Text className="mb-4 font-bold text-lg">카페 목록</Text>
          {category.cafes.map((cafe) => (
            <CafeItem
              key={cafe.id}
              item={cafe}
              onPress={() => router.push(`/cafe/${cafe.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
