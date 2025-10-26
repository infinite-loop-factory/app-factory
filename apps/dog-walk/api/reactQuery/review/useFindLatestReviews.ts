import type { ReviewDataType } from "@/types/review";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const findLatestReviews = async () => {
  const { data, error } = await supabase
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
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw error;

  return data as ReviewDataType[];
};

export const useFindLatestReviews = () => {
  return useQuery({
    queryKey: [queryKeys.reviews.findLatestReviews],
    queryFn: findLatestReviews,
  });
};
