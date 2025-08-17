import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

interface InsertCoursePayload {
  userId: string;
  visitedDate: Date;
  startName: string;
  startLat: number;
  startLng: number;
  endName: string;
  endLat: number;
  endLng: number;
  imageUrl: string;
  recommendReason: string;
  totalDistance: number;
  totalTime: number;
  pathCoords: {
    lat: number;
    lon: number;
  }[];
}

const insertCourse = async ({
  userId,
  visitedDate,
  startName,
  startLat,
  startLng,
  endName,
  endLat,
  endLng,
  imageUrl,
  recommendReason,
  totalDistance,
  totalTime,
  pathCoords,
}: InsertCoursePayload) => {
  const { data, error } = await supabase
    .from("walking_courses")
    .insert({
      created_at: new Date(),
      user_id: userId,
      visited_date: visitedDate,
      start_name: startName,
      start_lat: startLat,
      start_lng: startLng,
      end_name: endName,
      end_lat: endLat,
      end_lng: endLng,
      image_url: imageUrl,
      recommend_reason: recommendReason,
      total_distance: totalDistance,
      total_time: totalTime,
      path_json: pathCoords,
    })
    .select("id")
    .single();

  if (error) throw error;

  return data?.id ?? null;
};

export const useInsertCourse = () => {
  return useMutation({
    mutationFn: (payload: InsertCoursePayload) => insertCourse(payload),
  });
};
