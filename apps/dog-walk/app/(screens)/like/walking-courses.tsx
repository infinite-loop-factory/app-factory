import type { CourseRow } from "@/types/course";

import { useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { useFindLikedCoursesInfinite } from "@/api/reactQuery/like/useFindLikedCoursesInfinite";
import { userAtom } from "@/atoms/userAtom";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import MyCourseCard from "@/components/card/MyCourseCard";
import MyCourseCardSkeleton from "@/components/card/MyCourseCardSkeleton";
import HeaderBar from "@/components/HeaderBar";
import EmptyData from "@/components/molecules/EmptyData";
import { VStack } from "@/components/ui/vstack";

export default function LikeWalkingCoursesScreen() {
  const userInfo = useAtomValue(userAtom);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFindLikedCoursesInfinite(userInfo.id);

  const courses = data?.pages.flatMap((page) => page.data) ?? [];

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <MyCourseCardSkeleton />
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"내가 찜한 산책 코스"} />
      <View className="flex-1 bg-slate-50">
        {isLoading ? (
          <VStack className="gap-4 px-4 py-4">
            <MyCourseCardSkeleton />
            <MyCourseCardSkeleton />
            <MyCourseCardSkeleton />
            <MyCourseCardSkeleton />
            <MyCourseCardSkeleton />
          </VStack>
        ) : (
          <FlatList
            contentContainerStyle={{ padding: 16, gap: 16, flex: 1 }}
            data={courses}
            keyExtractor={(item) => `my_walking_courses_${item.id}}`}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <EmptyData
                  description={
                    "아직 저장한 산책 코스가 없습니다.\n마음에 드는 코스를 찜해보세요!"
                  }
                  title="찜한 코스가 없습니다"
                />
              </View>
            }
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }: { item: CourseRow }) => (
              <MyCourseCard item={item} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </CustomSafeAreaView>
  );
}
