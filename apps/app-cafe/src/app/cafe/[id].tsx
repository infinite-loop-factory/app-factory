import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Clock, MapPin, Phone, Star } from "lucide-react-native";
import { useLayoutEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useThemeStore } from "@/hooks/use-theme";

const MOCK_CAFE_DETAIL = {
  id: "1",
  name: "커피 브루",
  description:
    "수제 로스팅의 최상급 에스프레소와 특별한 디저트를 만나는 곳. 매일 아침 신선한 원두로 로스팅하여 차별화된 맛을 제공합니다.",
  rating: 4.8,
  reviewCount: 234,
  location: "서울 강남구 테헤란로 123",
  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
  tags: ["수제", "원두", "빈티지"],
  isOpen: true,
  phone: "02-1234-5678",
  hours: "월-금: 08:00 - 22:00\n토: 09:00 - 21:00\n일: 휴무",
  images: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  ],
  menu: [
    { name: "아메리카노", price: "4,500원", description: "에티오피아 원두" },
    { name: "라떼", price: "5,500원", description: "스무스한 우유" },
    { name: "콜드브루", price: "5,000원", description: "12시간 추출" },
  ],
  reviews: [
    {
      author: "김철수",
      rating: 5,
      comment: "커피가 정말 맛있어요!",
      date: "2024-01-15",
    },
    {
      author: "이영희",
      rating: 4,
      comment: "분위기도 좋고 커피도 좋아요.",
      date: "2024-01-10",
    },
  ],
};

export default function CafeDetailScreen() {
  const cafe = MOCK_CAFE_DETAIL;
  const navigation = useNavigation();
  const mode = useThemeStore((state) => state.mode);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: cafe.name,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerStyle: {
        backgroundColor: mode === "dark" ? "#1A1614" : "#FFFFFF",
      },
    });
  }, [navigation, cafe.name, mode]);

  return (
    <View className="flex-1 bg-background-100">
      <ScrollView>
        <View className="relative">
          <Image
            className="h-72 w-full"
            contentFit="cover"
            source={{ uri: cafe.image }}
          />
          <View className="absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        </View>
        <View className="-mt-8 overflow-hidden rounded-t-3xl bg-background-0">
          <View className="p-4">
            <View className="mb-4 flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="mb-2 font-bold text-2xl text-typography-0">
                  {cafe.name}
                </Text>
                <View className="mb-2 flex-row items-center gap-1">
                  <Star
                    className="fill-warning-500 text-warning-500"
                    size={16}
                  />
                  <Text className="font-semibold text-typography-0">
                    {cafe.rating}
                  </Text>
                  <Text className="text-sm text-typography-300">
                    ({cafe.reviewCount} 리뷰)
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MapPin className="text-outline-400" size={14} />
                  <Text className="text-sm text-typography-300">
                    {cafe.location}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 font-semibold text-base text-typography-0">
                소개
              </Text>
              <Text className="text-typography-700">{cafe.description}</Text>
            </View>

            <View className="mb-6">
              <Text className="mb-3 font-semibold text-base text-typography-0">
                영업정보
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center gap-2">
                  <Clock
                    className={
                      cafe.isOpen ? "text-success-500" : "text-error-500"
                    }
                    size={18}
                  />
                  <Text
                    className={`font-medium ${
                      cafe.isOpen ? "text-success-500" : "text-error-500"
                    }`}
                  >
                    {cafe.isOpen ? "영업 중" : "영업 종료"}
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <Clock className="mt-1 text-outline-400" size={18} />
                  <Text className="text-typography-700">{cafe.hours}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Phone className="text-outline-400" size={18} />
                  <Text className="text-typography-700">{cafe.phone}</Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 font-semibold text-base text-typography-0">
                메뉴
              </Text>
              <View className="space-y-3">
                {cafe.menu.map((item) => (
                  <View
                    className="rounded-xl border border-outline-100 p-4"
                    key={item.name}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="font-bold text-typography-0">
                          {item.name}
                        </Text>
                        <Text className="text-sm text-typography-300">
                          {item.description}
                        </Text>
                      </View>
                      <Text className="font-bold text-typography-0">
                        {item.price}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 font-semibold text-base text-typography-0">
                사진
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cafe.images.map((image) => (
                  <Image
                    className="mr-3 h-32 w-32 rounded-2xl"
                    contentFit="cover"
                    key={image}
                    source={{ uri: image }}
                  />
                ))}
              </ScrollView>
            </View>

            <View>
              <Text className="mb-3 font-semibold text-base text-typography-0">
                리뷰 ({cafe.reviews.length})
              </Text>
              <View className="space-y-4">
                {cafe.reviews.map((review) => (
                  <View
                    className="rounded-xl border border-outline-100 p-4"
                    key={review.date}
                  >
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="font-semibold text-typography-0">
                        {review.author}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Star
                          className="fill-warning-500 text-warning-500"
                          size={14}
                        />
                        <Text className="font-semibold text-sm text-typography-0">
                          {review.rating}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-typography-700">
                      {review.comment}
                    </Text>
                    <Text className="mt-2 text-typography-300 text-xs">
                      {review.date}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
