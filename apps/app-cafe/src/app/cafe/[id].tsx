import { cn } from "@gluestack-ui/utils";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Calendar, Clock, MapPin, Phone, Star } from "lucide-react-native";
import { useLayoutEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ui/themed-text";
import {
  UNSPLASH_IMAGE_1,
  UNSPLASH_IMAGE_2,
  UNSPLASH_IMAGE_3,
} from "@/constants/images";
import { useThemeStore } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";

const MOCK_CAFE_DETAIL = {
  id: "1",
  name: "커피 브루",
  description:
    "수제 로스팅의 최상급 에스프레소와 특별한 디저트를 만나는 곳. 매일 아침 신선한 원두로 로스팅하여 차별화된 맛을 제공합니다.",
  rating: 4.8,
  reviewCount: 234,
  location: "서울 강남구 테헤란로 123",
  image: UNSPLASH_IMAGE_1,
  tags: ["수제", "원두", "빈티지"],
  isOpen: true,
  phone: "02-1234-5678",
  hours: "월-금: 08:00 - 22:00\n토: 09:00 - 21:00\n일: 휴무",
  images: [UNSPLASH_IMAGE_1, UNSPLASH_IMAGE_2, UNSPLASH_IMAGE_3],
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
  const { currentHex } = useThemeStore();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: cafe.name,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerStyle: {
        backgroundColor: currentHex["--color-background-50"],
      },
      headerTintColor: currentHex["--color-typography-0"],
      headerTitleAlign: "center",
      headerTransparent: false,
    });
  }, [navigation, cafe.name, currentHex]);

  return (
    <SafeAreaView className="flex-1 bg-background-100" edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="relative">
          <Image
            contentFit="cover"
            source={{ uri: cafe.image }}
            style={{ height: 300, width: "100%" }}
          />
          <View className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-background-100/90 via-background-100/60 to-transparent" />
        </View>
        <View className="-mt-8 overflow-hidden rounded-t-3xl bg-background-0">
          <View className="p-4">
            <View className="mb-4 flex-row items-start justify-between">
              <View className="flex-1">
                <ThemedText className="mb-2 font-bold text-2xl text-typography-0">
                  {cafe.name}
                </ThemedText>
                <View className="mb-2 flex-row items-center gap-1">
                  <Star color="#FBBF24" fill="#FBBF24" size={16} />
                  <ThemedText className="font-semibold text-typography-0">
                    {cafe.rating}
                  </ThemedText>
                  <ThemedText className="text-typography-300">
                    ({cafe.reviewCount} {t("cafe.reviews")})
                  </ThemedText>
                </View>
                <View className="flex-row items-center gap-1">
                  <MapPin color="rgba(156, 163, 175, 1)" size={14} />
                  <ThemedText className="text-typography-300">
                    {cafe.location}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <ThemedText className="mb-2 font-semibold text-base text-typography-0">
                {t("cafe.intro")}
              </ThemedText>
              <ThemedText className="text-typography-700">
                {cafe.description}
              </ThemedText>
            </View>

            <View className="mb-6">
              <ThemedText className="mb-2 font-semibold text-base text-typography-0">
                {t("cafe.businessInfo")}
              </ThemedText>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Clock
                    color={
                      currentHex[
                        cafe.isOpen
                          ? "--color-success-400"
                          : "--color-error-400"
                      ]
                    }
                    size={14}
                  />
                  <ThemedText
                    className={cn(
                      "font-medium",
                      cafe.isOpen ? "text-success-400" : "text-error-400",
                    )}
                  >
                    {cafe.isOpen ? t("cafe.open") : t("cafe.closed")}
                  </ThemedText>
                </View>
                <View className="flex-row items-start gap-2">
                  <Calendar
                    color="rgba(156, 163, 175, 1)"
                    size={14}
                    style={{ marginTop: 3 }}
                  />
                  <ThemedText className="text-typography-700">
                    {cafe.hours}
                  </ThemedText>
                </View>
                <View className="flex-row items-center gap-2">
                  <Phone color="rgba(156, 163, 175, 1)" size={14} />
                  <ThemedText className="text-typography-700">
                    {cafe.phone}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <ThemedText
                className="mb-3 font-semibold text-base text-typography-0"
                translationKey="cafe.menu"
              />
              <View className="gap-2">
                {cafe.menu.map((item) => (
                  <View
                    className="rounded-xl border border-outline-200 p-4"
                    key={item.name}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <ThemedText className="font-bold text-typography-0">
                          {item.name}
                        </ThemedText>
                        <ThemedText className="text-typography-300">
                          {item.description}
                        </ThemedText>
                      </View>
                      <ThemedText className="font-bold text-typography-0">
                        {item.price}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <ThemedText
                className="mb-3 font-semibold text-base text-typography-0"
                translationKey="cafe.photos"
              />
              <ScrollView
                horizontal={false}
                showsHorizontalScrollIndicator={false}
              >
                <View className={"flex-row gap-1"}>
                  {cafe.images.map((image) => (
                    <View
                      className={"h-36 w-36 overflow-hidden rounded-md"}
                      key={image}
                    >
                      <Image
                        contentFit="cover"
                        key={image}
                        source={{ uri: image }}
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View>
              <ThemedText
                className="mb-3 font-semibold text-base text-typography-0"
                translationKey="cafe.reviews"
              >
                {" "}
                ({cafe.reviews.length})
              </ThemedText>
              <View className="gap-2">
                {cafe.reviews.map((review) => (
                  <View
                    className="rounded-xl border border-outline-100 p-4"
                    key={review.date}
                  >
                    <View className="mb-2 flex-row items-center justify-between">
                      <ThemedText className="font-semibold text-typography-0">
                        {review.author}
                      </ThemedText>
                      <View className="flex-row items-center gap-1">
                        <Star color="#FBBF24" fill="#FBBF24" size={14} />
                        <ThemedText className="font-semibold text-typography-0">
                          {review.rating}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText className="text-typography-700">
                      {review.comment}
                    </ThemedText>
                    <ThemedText className="mt-2 text-typography-300 text-xs">
                      {review.date}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
