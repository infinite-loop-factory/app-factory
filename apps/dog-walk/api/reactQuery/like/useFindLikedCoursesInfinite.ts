import type { CourseRow } from "@/types/course";

import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const PAGE_SIZE = 10;

interface FetchLikedCoursesParams {
  userId: string;
  pageParam: number;
}

interface FetchLikedCoursesResponse {
  data: CourseRow[];
  nextPage: number | undefined;
  totalCount: number;
}

const fetchLikedCourses = async ({
  userId,
  pageParam,
}: FetchLikedCoursesParams): Promise<FetchLikedCoursesResponse> => {
  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("liked_courses")
    .select("walking_courses(*)", { count: "exact" })
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  // NOTE: walking_courses(*) 로 조회하면 중첩된 객체로 반환되므로 추출
  const courses = data
    .map((item: any) => item.walking_courses)
    .filter(
      (course: CourseRow | null) => course && !course.deleted_at,
    ) as CourseRow[];

  return {
    data: courses,
    nextPage: courses.length === PAGE_SIZE ? pageParam + 1 : undefined,
    totalCount: count ?? 0,
  };
};

export const useFindLikedCoursesInfinite = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.likes.findLikedCoursesInfinite, userId],
    queryFn: ({ pageParam = 0 }) => fetchLikedCourses({ userId, pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!userId,
  });
};
