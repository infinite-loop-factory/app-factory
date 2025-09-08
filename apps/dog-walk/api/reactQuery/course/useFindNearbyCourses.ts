import type { CourseRow } from "@/types/course";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

// NOTE: 지구 반지름
const R = 6371000;

type Point = { lat: number; lng: number };

function haversineMeters(a: Point, b: Point) {
  const dLat = (Math.PI / 180) * (b.lat - a.lat);
  const dLng = (Math.PI / 180) * (b.lng - a.lng);
  const lat1 = (Math.PI / 180) * a.lat;
  const lat2 = (Math.PI / 180) * b.lat;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const findNearbyCourses = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  if (!(latitude && longitude)) throw new Error("현재 위치 정보가 없음");

  const { data, error } = await supabase
    .from("walking_courses")
    .select(
      "id,start_lat,start_lng,image_url,start_name,end_name,total_distance,total_time,average_rating",
    );

  if (error) throw error;

  const current: Point = { lat: latitude, lng: longitude };

  // NOTE: 현재 위치와의 거리 계산
  const withDistance = (data ?? []).map((c) => {
    const d = haversineMeters(current, { lat: c.start_lat, lng: c.start_lng });

    return { ...c, distance_m: d };
  });

  // NOTE: 계산된 거리로 정렬
  withDistance.sort((a, b) => a.distance_m - b.distance_m);

  return withDistance as CourseRow[];
};

export const useFindNearbyCourses = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return useQuery({
    queryKey: [queryKeys.course.findNearbyCourses, latitude, longitude],
    queryFn: () => findNearbyCourses({ latitude, longitude }),
    enabled: !!latitude && !!longitude,
  });
};
