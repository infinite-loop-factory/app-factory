import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

interface BlockCoursePayload {
  userId: string;
  courseId: number;
}

const insertBlockCourse = async ({ userId, courseId }: BlockCoursePayload) => {
  const { data, error } = await supabase
    .from("blocked_courses")
    .insert({
      created_at: new Date(),
      user_id: userId,
      course_id: courseId,
    })
    .select("id")
    .single();

  if (error) throw error;

  return data?.id ?? null;
};

export const useInsertBlockCourse = () => {
  return useMutation({
    mutationFn: (payload: BlockCoursePayload) => insertBlockCourse(payload),
  });
};
