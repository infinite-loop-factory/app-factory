import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

interface InsertReviewPayload {
  userId: string;
  courseId: number;
  rate: number;
  content: string;
  images: string;
}

const insertReview = async ({
  userId,
  courseId,
  rate,
  content,
  images,
}: InsertReviewPayload) => {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      created_at: new Date(),
      user_id: userId,
      course_id: courseId,
      rate,
      content,
      images,
    })
    .select("id")
    .single();

  if (error) throw error;

  return data?.id ?? null;
};

export const useInsertReview = () => {
  return useMutation({
    mutationFn: (payload: InsertReviewPayload) => insertReview(payload),
  });
};
