import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const deleteReview = async (reviewId: number) => {
  const { error } = await supabase
    .from("reviews")
    .update({ deleted_at: new Date() })
    .eq("id", reviewId);

  if (error) throw error;
};

export const useDeleteReview = (courseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
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
