import type { ReviewDataType } from "@/types/review";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const findLatestCourseReviews = async (courseId: number) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
    *,
    users (
      id,
      name,
      profile_image_url
    )
  `,
    )
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw error;

  return data as ReviewDataType[];
};

export const useFindLatestCourseReviews = (courseId: number) => {
  return useQuery({
    queryKey: [queryKeys.reviews.findLatestCourseReviews, courseId],
    queryFn: () => findLatestCourseReviews(courseId),
  });
};
