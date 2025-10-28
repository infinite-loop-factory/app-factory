import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const hasUserReviewed = async (courseId: number, userId: string) => {
  const { count, error } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (error) throw error;

  return (count ?? 0) > 0;
};

export const useHasUserReviewed = (courseId: number, userId: string) => {
  return useQuery({
    queryKey: [queryKeys.reviews.hasUserReviewed, courseId, userId],
    queryFn: () => hasUserReviewed(courseId, userId),
  });
};
