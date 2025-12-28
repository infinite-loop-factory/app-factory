import type { CoursePayload } from "@/types/course";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const findLikedCourse = async ({ userId, courseId }: CoursePayload) => {
  if (!courseId) throw new Error("Course ID 없음");
  if (!userId) return null;

  // NOTE: 좋아요한 코스가 삭제되지 않았는지 확인
  const { data, error } = await supabase
    .from("liked_courses")
    .select("id, deleted_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const useFindLikedCourse = ({ userId, courseId }: CoursePayload) => {
  return useQuery({
    queryKey: [queryKeys.likes.findLikedCourse, courseId, userId],
    queryFn: () => findLikedCourse({ courseId, userId }),
    enabled: !!courseId && !!userId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
