import type { CoursePayload } from "@/types/course";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

const insertLikedCourse = async ({ userId, courseId }: CoursePayload) => {
  const { data, error } = await supabase
    .from("liked_courses")
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

export const useInsertLikedCourse = () => {
  return useMutation({
    mutationFn: (payload: CoursePayload) => insertLikedCourse(payload),
  });
};
