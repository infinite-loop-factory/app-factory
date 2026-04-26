import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

interface UpdateReviewParams {
  reviewId: number;
  courseId: number;
  rate: number;
  content: string;
  images: string;
}

const updateReview = async ({
  reviewId,
  rate,
  content,
  images,
}: UpdateReviewParams) => {
  const { error } = await supabase
    .from("reviews")
    .update({ rate, content, images, updated_at: new Date() })
    .eq("id", reviewId);

  if (error) throw error;
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.reviews.findLatestCourseReviews, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.reviews.findCourseReviewsInfinite, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.reviews.findLatestReviews],
      });
    },
  });
};
