import type { CoursePayload } from "@/types/course";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

const deleteLikedCourse = async ({ courseId, userId }: CoursePayload) => {
  // NOTE: Soft Delete 방식으로 삭제 처리
  const { error: deleteError } = await supabase
    .from("liked_courses")
    .update({ deleted_at: new Date() })
    .eq("course_id", courseId)
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  return { courseId };
};

export const useDeleteLikedCourse = () => {
  return useMutation({
    mutationFn: deleteLikedCourse,
  });
};
