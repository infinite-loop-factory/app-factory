export type PostCategory = "돌봄" | "친구찾기" | "물품나눔";

export type PostStatus = "모집" | "매칭중" | "매칭완료";

export type ApplicationStatus = "대기중" | "매칭중" | "매칭완료" | "실패";

export type PhoneVisibilityState = "hidden" | "host_visible" | "mutual_visible";

export type PostRow = {
  id: string;
  title: string;
  category: PostCategory;
  status: PostStatus;
  meet_at: string;
  author_user_id: string;
};

export type PostApplicationRow = {
  id: string;
  post_id: string;
  applicant_user_id: string;
  status: ApplicationStatus;
  phone_visibility_state: PhoneVisibilityState;
};
