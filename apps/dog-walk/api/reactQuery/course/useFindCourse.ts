import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const fetchCourse = async (id: number) => {
  if (!id) throw new Error("Course ID 없음");

  const { data, error } = await supabase
    .from("walking_courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const useFindCourse = (id: number) => {
  return useQuery({
    queryKey: [queryKeys.course.findCourse, id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  });
};
