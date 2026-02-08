import type { CourseRow } from "@/types/course";

import { useAtomValue } from "jotai";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { useDeleteCourse } from "@/api/reactQuery/course/useDeleteCourse";
import { useFindMyCoursesInfinite } from "@/api/reactQuery/course/useFindMyCoursesInfinite";
import { userAtom } from "@/atoms/userAtom";
import OptionsActionsheet from "@/components/actionsheet/OptionsActionsheet";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import { getGlobalHandleToast } from "@/components/CustomToast";
import MyCourseCard from "@/components/card/MyCourseCard";
import MyCourseCardSkeleton from "@/components/card/MyCourseCardSkeleton";
import HeaderBar from "@/components/HeaderBar";
import EmptyData from "@/components/molecules/EmptyData";
import { VStack } from "@/components/ui/vstack";

export default function MyWalkingCoursesScreen() {
  const userInfo = useAtomValue(userAtom);

  const [showOptionsActionsheet, setShowOptionsActionsheet] = useState(false);

  const [selectedId, setSelectedId] = useState(0);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFindMyCoursesInfinite(userInfo.id);

  const courses = data?.pages.flatMap((page) => page.data) ?? [];

  const { mutateAsync: deleteCourse } = useDeleteCourse();

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <MyCourseCardSkeleton />
      </View>
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const { courseId } = await deleteCourse({
        courseId: id,
        userId: userInfo.id,
      });

      if (courseId) {
        setShowOptionsActionsheet(false);
        getGlobalHandleToast("삭제가 완료되었습니다.");
        refetch();
      }
    } catch {
      getGlobalHandleToast("삭제에 실패했습니다.");
    }
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"내가 등록한 산책 코스"} />
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
                    "아직 등록한 산책 코스가 없습니다.\n마음에 드는 코스를 등록해보세요!"
                  }
                  title="등록한 코스가 없습니다"
                />
              </View>
            }
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }: { item: CourseRow }) => (
              <MyCourseCard
                item={item}
                onPressOptions={() => {
                  setSelectedId(item.id);
                  setShowOptionsActionsheet(true);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <OptionsActionsheet
        onPressOption={() => handleDelete(selectedId)}
        setShowActionsheet={setShowOptionsActionsheet}
        showActionsheet={showOptionsActionsheet}
        type={"DELETE"}
      />
    </CustomSafeAreaView>
  );
}
