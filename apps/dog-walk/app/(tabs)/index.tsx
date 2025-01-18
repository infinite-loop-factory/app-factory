import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import CourseCard from "@/components/card/CourseCard";
import ReviewCard from "@/components/card/ReviewCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const recommededCourse = [
    {
      id: "1",
      title: "도시 공원 코스 1",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
    {
      id: "2",
      title: "도시 공원 코스 2",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
    {
      id: "3",
      title: "도시 공원 코스 3",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
    {
      id: "4",
      title: "도시 공원 코스 4",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
  ];

  const latestReviews = [
    {
      id: "review_1",
      image: "http://via.placeholder.com/280",
      name: "사용자1",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-12-01 12:00",
    },
    {
      id: "review_2",
      image: "http://via.placeholder.com/280",
      name: "사용자2",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-11-30 12:00",
    },
    {
      id: "review_3",
      image: "http://via.placeholder.com/280",
      name: "사용자3",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-11-15 12:00",
    },
    {
      id: "review_4",
      image: "http://via.placeholder.com/280",
      name: "사용자4",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-10-31 12:00",
    },
  ];

  return (
    <CustomSafeAreaView>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          <Text className=" text-slate-600 text-sm">안녕하세요 👋</Text>
          <Text className="font-bold text-2xl">댕댕이와 산책해요</Text>
        </View>
        <TouchableOpacity
          className="h-12 w-full rounded-l bg-slate-50 px-2"
          onPress={() => router.push("/search")}
        >
          <View className="flex h-full flex-row items-center">
            <Ionicons name="search" className="pr-2" />
            <Text className="text-slate-500 text-sm">산책 코스 검색하기</Text>
          </View>
        </TouchableOpacity>

        <View>
          <View className="flex w-full flex-row items-center justify-between py-4">
            <Text className="font-bold text-lg">추천 산책 코스</Text>
            <TouchableOpacity
              className=""
              onPress={() => router.push("/search")}
            >
              <View className="flex flex-row items-center ">
                <Text className="text-slate-500 text-sm">전체보기</Text>
                <Ionicons name="arrow-forward" className="pl-2" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={recommededCourse}
              renderItem={CourseCard}
              keyExtractor={(item) => item.id}
              horizontal
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          </View>
        </View>
        <View>
          <View className="flex w-full flex-row items-center justify-between py-4">
            <Text className="font-bold text-lg">최근 리뷰</Text>
            <TouchableOpacity
              className=""
              onPress={() => router.push("/search")}
            >
              <View className="flex flex-row items-center ">
                <Text className="text-slate-500 text-sm">전체보기</Text>
                <Ionicons name="arrow-forward" className="pl-2" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            {latestReviews.map((item) => {
              return <ReviewCard key={item.id} item={item} />;
            })}
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
