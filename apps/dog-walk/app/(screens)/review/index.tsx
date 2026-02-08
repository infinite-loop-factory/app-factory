import type { ReviewDataType } from "@/types/review";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useFindCourseReviewsInfinite } from "@/api/reactQuery/review/useFindCourseReviewsInfinite";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import HeaderBar from "@/components/HeaderBar";
import ImageModal from "@/components/modal/ImageModal";
import ReviewItem from "@/components/molecules/ReviewItem";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ReviewScreen() {
  const { courseId } = useLocalSearchParams();

  const primary500Color = useThemeColor({}, "--color-primary-500");

  const { data: reviewData, fetchNextPage } = useFindCourseReviewsInfinite(
    Number(courseId),
  );

  const [reviewList, setReviewList] = useState<ReviewDataType[]>([]);

  const [reviewImages, setReviewImages] = useState<string[]>([]);

  const [showImageModal, setShowImageModal] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const onPressCloseModal = () => {
    setShowImageModal(false);
    setReviewImages([]);
  };

  useEffect(() => {
    if (reviewData?.pages) {
      const data = reviewData.pages.flatMap((page) => page.list);
      setReviewList(() => data);
    }
  }, [reviewData]);

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"리뷰 전체 보기"} />
      <View className="flex-1">
        <FlatList
          contentContainerStyle={{
            rowGap: 12,
            paddingVertical: 12,
          }}
          data={reviewList}
          keyExtractor={(data) => `course_review_${data.id}`}
          onEndReached={() => {
            fetchNextPage();
          }}
          onEndReachedThreshold={0.8}
          renderItem={({ item }) => (
            <ReviewItem
              key={`course_review_${item.id}`}
              reviewData={item}
              setReviewImages={setReviewImages}
              setSelectedImageIndex={setSelectedImageIndex}
              setShowImageModal={setShowImageModal}
              starIconColor={primary500Color}
            />
          )}
        />
      </View>
      <ImageModal
        data={reviewImages}
        initialPage={selectedImageIndex}
        onClose={onPressCloseModal}
        visible={showImageModal}
      />
    </CustomSafeAreaView>
  );
}
