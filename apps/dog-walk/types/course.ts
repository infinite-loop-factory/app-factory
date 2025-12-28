export type CourseRow = {
  id: number;
  deleted_at: string;
  created_at: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  image_url: string;
  start_name: string;
  end_name: string;
  total_distance: number;
  total_time: number;
  average_rating: number;
  distance_m?: number;
};

export interface CoursePayload {
  courseId: number;
  userId: string;
}
