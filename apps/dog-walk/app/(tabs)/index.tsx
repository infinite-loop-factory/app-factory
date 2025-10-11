import type { ReviewDataType } from "@/types/review";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFindPopularCourses } from "@/api/reactQuery/course/useFindPopularCourses";
import { useFindLatestReviews } from "@/api/reactQuery/review/useFindLatestReviews";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import CourseCard from "@/components/card/CourseCard";
import ReviewCard from "@/components/card/ReviewCard";

export default function HomeScreen() {
  const router = useRouter();

  const { data: recommededCourse } = useFindPopularCourses();

  const { data: latestReview = [] } = useFindLatestReviews();

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
            <Ionicons className="pr-2" name="search" />
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
                <Ionicons className="pl-2" name="arrow-forward" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              contentContainerStyle={{ gap: 16 }}
              data={recommededCourse}
              horizontal
              keyExtractor={(item) => `popular_course_${item.id}`}
              nestedScrollEnabled={true}
              renderItem={CourseCard}
              showsHorizontalScrollIndicator={false}
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
                <Ionicons className="pl-2" name="arrow-forward" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            {latestReview.map((item: ReviewDataType) => (
              <ReviewCard item={item} key={item.id} />
            ))}
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
