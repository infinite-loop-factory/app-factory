import type { CourseRow } from "@/types/course";

import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const PAGE_SIZE = 10;

interface FetchMyCoursesParams {
  userId: string;
  pageParam: number;
}

const fetchMyCourses = async ({ userId, pageParam }: FetchMyCoursesParams) => {
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("walking_courses")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data as CourseRow[],
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
    totalCount: count ?? 0,
  };
};

export const useFindMyCoursesInfinite = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.course.findMyCoursesInfinite, userId],
    queryFn: ({ pageParam = 0 }) => fetchMyCourses({ userId, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!userId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
