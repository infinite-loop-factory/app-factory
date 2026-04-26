import type { ReviewDataType } from "@/types/review";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDeleteReview } from "@/api/reactQuery/review/useDeleteReview";
import { useFindLatestCourseReviews } from "@/api/reactQuery/review/useFindLatestCourseReviews";
import { userAtom } from "@/atoms/userAtom";
import { useThemeColor } from "@/hooks/useThemeColor";
import ReviewScoreCard from "../card/ReviewScoreCard";
import ImageModal from "../modal/ImageModal";
import ReviewItem from "../molecules/ReviewItem";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import ReviewEmptyState from "./ReviewEmptyState";

interface ReviewsProps {
  courseId: number;
  rate: number;
}

export default function Reviews({ courseId, rate }: ReviewsProps) {
  const primary500Color = useThemeColor({}, "--color-primary-500");
  const userInfo = useAtomValue(userAtom);

  const { data = [] } = useFindLatestCourseReviews(courseId);
  const { mutate: deleteReview } = useDeleteReview(courseId);

  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleDelete = (reviewId: number) => {
    deleteReview(reviewId, { onSuccess: () => router.back() });
  };

  const handleEdit = (reviewData: ReviewDataType) => {
    router.push({
      pathname: "/(screens)/review/edit" as never,
      params: {
        reviewId: reviewData.id,
        courseId,
        initialRate: reviewData.rate,
        initialContent: reviewData.content,
        initialImages: reviewData.images ?? "[]",
      },
    });
  };

  const onPressCloseModal = () => {
    setShowImageModal(false);
    setReviewImages([]);
  };

  const onPressReviewWrite = () => {
    router.push({
      pathname: "/(screens)/review/write",
      params: {
        courseId,
      },
    });
  };

  if (!data.length) {
    return <ReviewEmptyState onPressReviewWrite={onPressReviewWrite} />;
  }

  return (
    <View className="gap-6 py-6">
      <ReviewScoreCard
        count={data.length}
        courseId={courseId}
        onPressReviewWrite={onPressReviewWrite}
        rate={rate}
        starIconColor={primary500Color}
      />

      <View className="items-end">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(screens)/review",
              params: {
                courseId,
              },
            });
          }}
        >
          <View className="flex flex-row items-center">
            <Text className="text-slate-500 text-sm">전체보기</Text>
            <Ionicons className="pl-2" name="arrow-forward" />
          </View>
        </TouchableOpacity>
      </View>

      <VStack className="gap-1">
        {data.map((reviewData) => (
          <ReviewItem
            currentUserId={userInfo.id}
            key={`review_${reviewData.id}`}
            onDelete={handleDelete}
            onEdit={handleEdit}
            reviewData={reviewData}
            setReviewImages={setReviewImages}
            setSelectedImageIndex={setSelectedImageIndex}
            setShowImageModal={setShowImageModal}
            starIconColor={primary500Color}
          />
        ))}
      </VStack>
      <ImageModal
        data={reviewImages}
        initialPage={selectedImageIndex}
        onClose={onPressCloseModal}
        visible={showImageModal}
      />
    </View>
  );
}
