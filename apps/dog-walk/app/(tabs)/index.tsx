import type { ReviewDataType } from "@/types/review";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { useFindPopularCourses } from "@/api/reactQuery/course/useFindPopularCourses";
import { useFindLatestReviews } from "@/api/reactQuery/review/useFindLatestReviews";
import { userAtom } from "@/atoms/userAtom";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import CourseCard from "@/components/card/CourseCard";
import CourseCardSkeleton from "@/components/card/CourseCardSkeleton";
import ReviewCard from "@/components/card/ReviewCard";
import ReviewCardSkeleton from "@/components/card/ReviewCardSkeleton";
import EmptyCourse from "@/components/molecules/EmptyCourse";
import { TAB_BAR_HEIGHT } from "@/components/organisms/CustomTabBar";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const router = useRouter();

  const userInfo = useAtomValue(userAtom);

  const {
    data: recommededCourse = [],
    refetch,
    isLoading,
  } = useFindPopularCourses(userInfo.id);

  const { data: latestReview = [], isLoading: isReviewLoading } =
    useFindLatestReviews();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <CustomSafeAreaView>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          <Text className="text-slate-600" size="sm">
            안녕하세요 👋
          </Text>
          <Text className="font-bold" size="2xl">
            댕댕이와 산책해요
          </Text>
        </View>
        <TouchableOpacity
          className="h-12 w-full rounded-l bg-slate-50 px-2"
          onPress={() => router.push("/search")}
        >
          <View className="flex h-full flex-row items-center">
            <Ionicons className="pr-2" name="search" />
            <Text className="text-slate-500" size="sm">
              산책 코스 검색하기
            </Text>
          </View>
        </TouchableOpacity>

        <View>
          <View className="flex w-full flex-row items-center justify-between py-4">
            <Text className="font-bold" size="lg">
              추천 산책 코스
            </Text>
            <TouchableOpacity
              className=""
              onPress={() => router.push("/search")}
            >
              <View className="flex flex-row items-center">
                <Text className="text-slate-500" size="sm">
                  전체보기
                </Text>
                <Ionicons className="pl-2" name="arrow-forward" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            {isLoading ? (
              <HStack className="gap-4">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </HStack>
            ) : (
              <FlatList
                contentContainerStyle={{
                  gap: 16,
                  width: recommededCourse.length === 0 ? "100%" : "auto",
                }}
                data={recommededCourse}
                horizontal
                keyExtractor={(item) => `popular_course_${item.id}`}
                ListEmptyComponent={<EmptyCourse />}
                nestedScrollEnabled={true}
                renderItem={CourseCard}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </View>
        <View>
          <Text className="flex-start py-4 font-bold text-lg">최근 리뷰</Text>
          <View>
            {isReviewLoading ? (
              <>
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
              </>
            ) : (
              latestReview.map((item: ReviewDataType) => (
                <ReviewCard item={item} key={item.id} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
