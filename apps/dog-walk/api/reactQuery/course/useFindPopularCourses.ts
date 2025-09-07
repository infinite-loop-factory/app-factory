import type { CourseRow } from "@/types/course";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const findPopularCourses = async () => {
  const { data, error } = await supabase
    .from("walking_courses")
    .select(
      "id,start_lat,start_lng,image_url,start_name,end_name,total_distance,total_time,average_rating",
    )
    .order("average_rating", { ascending: false })
    .limit(10);

  if (error) throw error;

  return data as CourseRow[];
};

export const useFindPopularCourses = () => {
  return useQuery({
    queryKey: [queryKeys.course.findPopularCourses],
    queryFn: findPopularCourses,
  });
};
