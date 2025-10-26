import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useFindLatestCourseReviews } from "@/api/reactQuery/review/useFindLatestCourseReviews";
import { useThemeColor } from "@/hooks/useThemeColor";
import ReviewScoreCard from "../card/ReviewScoreCard";
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

  const { data = [] } = useFindLatestCourseReviews(courseId);

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
        <TouchableOpacity>
          <View className="flex flex-row items-center">
            <Text className="text-slate-500 text-sm">전체보기</Text>
            <Ionicons className="pl-2" name="arrow-forward" />
          </View>
        </TouchableOpacity>
      </View>

      <VStack className="gap-1">
        {data.map((reviewData) => (
          <ReviewItem
            key={`review_${reviewData.id}`}
            reviewData={reviewData}
            starIconColor={primary500Color}
          />
        ))}
      </VStack>
    </View>
  );
}
