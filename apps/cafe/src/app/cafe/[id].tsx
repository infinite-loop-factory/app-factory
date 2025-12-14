import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, Star } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NaverMapView } from "../../components/NaverMapView";
import { ReviewForm } from "../../components/ReviewForm";
import { useFavorites } from "../../hooks/use-favorites";

// Mock data for cafe details
const cafeDetails = {
  "1": {
    id: "1",
    title: "블루보틀 커피",
    description: "프리미엄 스페셜티 커피를 제공하는 미국 발 커피 체인",
    address: "서울시 강남구 삼성로 123",
    phone: "02-123-4567",
    hours: "매일 07:00 - 21:00",
    rating: "4.8",
    reviews: "340",
    members: "멤버 2,340명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
    menu: [
      {
        id: "m1",
        name: "아메리카노",
        price: "4,500원",
        description: "깊고 풍부한 맛의 에스프레소에 물을 더한 음료",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "m2",
        name: "카페 라떼",
        price: "5,500원",
        description: "에스프레소에 스팀 밀크를 더한 부드러운 음료",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "m3",
        name: "콜드 브루",
        price: "6,000원",
        description: "차가운 물로 오랜 시간 추출한 부드러운 커피",
        image: require("../../assets/images/react-logo.png"),
      },
    ],
    posts: [
      {
        id: "p1",
        title: "신메뉴 출시 - 피스타치오 라떼",
        content: "고소한 피스타치오와 부드러운 우유의 조화를 느껴보세요.",
        date: "2023-05-15",
        comments: "45",
      },
      {
        id: "p2",
        title: "주말 브런치 세트 할인 이벤트",
        content: "주말에는 브런치 세트를 20% 할인된 가격으로 즐기세요.",
        date: "2023-05-10",
        comments: "32",
      },
    ],
  },
  "2": {
    id: "2",
    title: "스타벅스 리저브",
    description: "프리미엄 커피 경험을 제공하는 스타벅스의 특별한 매장",
    address: "서울시 종로구 공평동 100",
    phone: "02-456-7890",
    hours: "매일 08:00 - 22:00",
    rating: "4.7",
    reviews: "520",
    members: "멤버 1,890명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
    menu: [
      {
        id: "m1",
        name: "리저브 드립 커피",
        price: "7,000원",
        description: "희귀한 원두로 추출한 프리미엄 드립 커피",
        image: require("../../assets/images/react-logo.png"),
      },
      {
        id: "m2",
        name: "콜드 브루 리저브",
        price: "6,500원",
        description: "특별 원두로 추출한 풍부한 맛의 콜드 브루",
        image: require("../../assets/images/react-logo.png"),
      },
    ],
    posts: [
      {
        id: "p1",
        title: "리저브 원두 시음회",
        content: "이번 주말, 새롭게 출시된 리저브 원두를 무료로 시음해보세요.",
        date: "2023-05-18",
        comments: "28",
      },
    ],
  },
};

export default function CafeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("메뉴");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [reviews, setReviews] = useState<
    Array<{
      id: string;
      rating: number;
      content: string;
      date: string;
      author: string;
    }>
  >([]);

  // Get cafe details based on ID
  const cafe = cafeDetails[id as keyof typeof cafeDetails];

  if (!cafe) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>카페를 찾을 수 없습니다.</Text>
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
            className="h-64 w-full"
            resizeMode="cover"
            source={cafe.image}
          />
          <TouchableOpacity
            className="absolute top-4 left-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 p-2"
            onPress={() => router.back()}
          >
            <Text className="text-white">←</Text>
          </TouchableOpacity>

          {/* Favorite button */}
          <TouchableOpacity
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50"
            onPress={() => {
              toggleFavorite(cafe.id);
            }}
          >
            <Heart
              color="#fff"
              fill={isFavorite(cafe.id) ? "#ef4444" : "transparent"}
              size={20}
            />
          </TouchableOpacity>
        </View>

        {/* Cafe Info */}
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-2xl">{cafe.title}</Text>
            <View className="rounded bg-gray-100 px-2 py-1">
              <Text className="text-sm">{cafe.tag}</Text>
            </View>
          </View>

          <Text className="mt-2 text-gray-600">{cafe.description}</Text>

          <View className="mt-4 flex-row items-center">
            <Text className="font-bold text-lg text-yellow-500">
              {cafe.rating}
            </Text>
            <Star className="ml-1" color="#fbbf24" fill="#fbbf24" size={16} />
            <Text className="ml-1 text-gray-500">({cafe.reviews} 리뷰)</Text>
            <Text className="ml-4 text-gray-500">{cafe.members}</Text>
          </View>

          <View className="mt-4 rounded-lg bg-gray-100 p-3">
            <View className="mb-2 flex-row items-center">
              <Text className="w-20 font-bold">주소</Text>
              <Text className="text-gray-700">{cafe.address}</Text>
            </View>
            <View className="mb-2 flex-row items-center">
              <Text className="w-20 font-bold">전화번호</Text>
              <Text className="text-gray-700">{cafe.phone}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="w-20 font-bold">영업시간</Text>
              <Text className="text-gray-700">{cafe.hours}</Text>
            </View>
          </View>

          {/* Naver Map View */}
          <View className="mt-4">
            <Text className="mb-2 font-bold text-lg">위치</Text>
            <NaverMapView address={cafe.address} height={180} width={350} />
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-gray-200 border-b">
          <TouchableOpacity
            className={`flex-1 items-center py-3 ${
              activeTab === "메뉴" ? "border-black border-b-2" : ""
            }`}
            onPress={() => setActiveTab("메뉴")}
          >
            <Text
              className={`${
                activeTab === "메뉴"
                  ? "font-semibold text-black"
                  : "text-gray-400"
              }`}
            >
              메뉴
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-3 ${
              activeTab === "소식" ? "border-black border-b-2" : ""
            }`}
            onPress={() => setActiveTab("소식")}
          >
            <Text
              className={`${
                activeTab === "소식"
                  ? "font-semibold text-black"
                  : "text-gray-400"
              }`}
            >
              소식
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-3 ${
              activeTab === "리뷰" ? "border-black border-b-2" : ""
            }`}
            onPress={() => setActiveTab("리뷰")}
          >
            <Text
              className={`${
                activeTab === "리뷰"
                  ? "font-semibold text-black"
                  : "text-gray-400"
              }`}
            >
              리뷰
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="p-4">
          {activeTab === "메뉴" && (
            <>
              <Text className="mb-4 font-bold text-lg">인기 메뉴</Text>
              {cafe.menu.map((item) => (
                <View
                  className="mb-4 flex-row border-gray-100 border-b pb-4"
                  key={item.id}
                >
                  <Image
                    className="h-20 w-20 rounded-md bg-gray-200"
                    resizeMode="cover"
                    source={item.image}
                  />
                  <View className="ml-3 flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-bold">{item.name}</Text>
                      <Text className="font-bold">{item.price}</Text>
                    </View>
                    <Text className="mt-1 text-gray-600 text-sm">
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {activeTab === "소식" && (
            <>
              <Text className="mb-4 font-bold text-lg">최근 소식</Text>
              {cafe.posts.map((post) => (
                <View
                  className="mb-4 border-gray-100 border-b pb-4"
                  key={post.id}
                >
                  <Text className="font-bold text-base">{post.title}</Text>
                  <Text className="mt-1 text-gray-600">{post.content}</Text>
                  <View className="mt-2 flex-row justify-between">
                    <Text className="text-gray-400 text-xs">{post.date}</Text>
                    <Text className="text-gray-400 text-xs">
                      댓글 {post.comments}개
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {activeTab === "리뷰" &&
            (showReviewForm ? (
              <ReviewForm
                cafeId={cafe.id}
                onCancel={() => setShowReviewForm(false)}
                onSubmit={(review) => {
                  const newReview = {
                    id: Date.now().toString(),
                    rating: review.rating,
                    content: review.content,
                    date: String(new Date().toISOString().split("T")[0]),
                    author: "사용자",
                  };
                  setReviews([newReview, ...reviews]);
                  setShowReviewForm(false);
                }}
              />
            ) : (
              <View className="py-4">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="font-bold text-lg">
                    리뷰 {reviews.length}개
                  </Text>
                  <TouchableOpacity
                    className="rounded-md bg-black px-4 py-2"
                    onPress={() => setShowReviewForm(true)}
                  >
                    <Text className="text-white">리뷰 작성하기</Text>
                  </TouchableOpacity>
                </View>

                {reviews.length === 0 ? (
                  <View className="items-center justify-center py-8">
                    <Text className="text-gray-500">아직 리뷰가 없습니다.</Text>
                  </View>
                ) : (
                  reviews.map((review) => (
                    <View
                      className="mb-4 border-gray-100 border-b pb-4"
                      key={review.id}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="font-bold">{review.author}</Text>
                        <Text className="text-gray-400 text-xs">
                          {review.date}
                        </Text>
                      </View>
                      <View className="my-1 flex-row items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            color="#fbbf24"
                            fill={
                              review.rating >= star ? "#fbbf24" : "transparent"
                            }
                            key={star}
                            size={16}
                          />
                        ))}
                      </View>
                      <Text className="mt-1 text-gray-600">
                        {review.content}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
