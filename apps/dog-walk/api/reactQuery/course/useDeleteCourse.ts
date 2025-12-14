import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

interface DeleteCourseParams {
  courseId: number;
  userId: string;
}

const deleteCourse = async ({ courseId, userId }: DeleteCourseParams) => {
  // NOTE: 본인이 등록한 코스인지 확인
  const { data: course, error: fetchError } = await supabase
    .from("walking_courses")
    .select("user_id")
    .eq("id", courseId)
    .single();

  if (fetchError) throw fetchError;

  if (course.user_id !== userId) {
    throw new Error("본인이 등록한 코스만 삭제할 수 있습니다.");
  }

  // NOTE: Soft Delete 방식으로 삭제 처리
  const { error: deleteError } = await supabase
    .from("walking_courses")
    .update({ deleted_at: new Date() })
    .eq("id", courseId)
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  return { courseId };
};

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: deleteCourse,
  });
};
