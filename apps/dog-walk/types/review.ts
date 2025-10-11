export type ReviewDataType = {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user_id: string;
  course_id: number;
  rate: number;
  content: string;
  images: string;
  users: {
    id: string;
    name: string;
    profile_image_url: string;
  };
};
