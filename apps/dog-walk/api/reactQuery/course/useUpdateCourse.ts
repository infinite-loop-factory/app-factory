import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

interface UpdateCourseParams {
  courseId: number;
  userId: string;
  visitedDate: Date;
  imageUrl: string;
  recommendReason: string;
}

const updateCourse = async ({
  courseId,
  userId,
  visitedDate,
  imageUrl,
  recommendReason,
}: UpdateCourseParams) => {
  const { error } = await supabase
    .from("walking_courses")
    .update({
      visited_date: visitedDate,
      image_url: imageUrl,
      recommend_reason: recommendReason,
    })
    .eq("id", courseId)
    .eq("user_id", userId);

  if (error) throw error;

  return { courseId };
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.course.findCourse, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.course.findMyCoursesInfinite],
      });
    },
  });
};
