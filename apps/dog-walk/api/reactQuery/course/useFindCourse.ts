import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { getBlockedCourseIds } from "@/api/utils/applyBlockFilter";
import { queryKeys } from "../queryKeys";

const fetchCourse = async (id: number, userId?: string) => {
  if (!id) throw new Error("Course ID 없음");

  const blockedIds = await getBlockedCourseIds(userId);

  let query = supabase.from("walking_courses").select("*").eq("id", id);

  if (blockedIds.length > 0) {
    query = query.not("id", "in", `(${blockedIds.join(",")})`);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data;
};

export const useFindCourse = (id: number, userId?: string) => {
  return useQuery({
    queryKey: [queryKeys.course.findCourse, id, userId],
    queryFn: () => fetchCourse(id, userId),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
