import { supabase } from "../supabaseClient";

export const getBlockedCourseIds = async (
  userId?: string,
): Promise<number[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("blocked_courses")
    .select("course_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch blocked courses:", error);
    return [];
  }

  return data.map((item) => item.course_id);
};
