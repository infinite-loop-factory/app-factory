import type { ReviewDataType } from "@/types/review";

import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

type Cursor = { created_at: string; id: number } | null;

const PAGE_SIZE = 10;

const findCourseReviews = async (courseId: number, cursor: Cursor) => {
  let query = supabase
    .from("reviews")
    .select(
      `
    *,
    users (
      id,
      name,
      profile_image_url
    )
  `,
    )
    .eq("course_id", courseId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (cursor) {
    query = query.or(
      `and(created_at.lt.${cursor.created_at}),and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`,
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  const hasMore = (data?.length ?? 0) > PAGE_SIZE;
  const list = hasMore
    ? (data?.slice(0, PAGE_SIZE) as ReviewDataType[])
    : ((data ?? []) as ReviewDataType[]);
  const last = list[list.length - 1];
  const nextCursor =
    hasMore && last ? { created_at: last.created_at, id: last.id } : null;

  return { list, nextCursor };
};

export const useFindCourseReviewsInfinite = (courseId: number) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.reviews.findCourseReviewsInfinite, courseId],
    queryFn: ({ pageParam = null }) => findCourseReviews(courseId, pageParam),
    initialPageParam: null as Cursor,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!courseId,
  });
};
