// 음식 카테고리
export type FoodCategory =
  | "한식"
  | "중식"
  | "일식"
  | "양식"
  | "분식"
  | "카페"
  | "패스트푸드"
  | "기타";

// 사용자 설정 타입
export interface UserSettings {
  preferred_categories: FoodCategory[];
  min_rating: number;
  shake_sensitivity: number;
}

// 네이버 API 응답에서 사용할 식당 정보
export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  mapx: string; // 경도 (Naver KATEC 좌표)
  mapy: string; // 위도 (Naver KATEC 좌표)
  link: string;
  rating?: number;
  distance?: number;
}

// 방문 히스토리 (v2용)
export interface VisitHistory {
  restaurant_id: string;
  restaurant_name: string;
  visit_date: string;
}

// 위치 정보
export interface Location {
  latitude: number;
  longitude: number;
}
