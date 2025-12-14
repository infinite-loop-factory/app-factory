import type { CourseRow } from "@/types/course";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { getBlockedCourseIds } from "@/api/utils/applyBlockFilter";
import { queryKeys } from "../queryKeys";

const findPopularCourses = async (userId?: string) => {
  const blockedIds = await getBlockedCourseIds(userId);

  let query = supabase
    .from("walking_courses")
    .select(
      "id,start_lat,start_lng,image_url,start_name,end_name,total_distance,total_time,average_rating",
    )
    .is("deleted_at", null);

  if (blockedIds.length > 0) {
    query = query.not("id", "in", `(${blockedIds.join(",")})`);
  }

  const { data, error } = await query
    .order("average_rating", { ascending: false })
    .limit(10);

  if (error) throw error;

  return data as CourseRow[];
};

export const useFindPopularCourses = (userId?: string) => {
  return useQuery({
    queryKey: [queryKeys.course.findPopularCourses, userId],
    queryFn: () => findPopularCourses(userId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
