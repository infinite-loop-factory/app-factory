export type Region = "서울시 구로구" | "서울시 관악구" | "서울시 노원구";

export type PostCategory = "돌봄" | "친구찾기" | "물품나눔";

export type PostStatus = "모집" | "매칭중" | "매칭완료";

export type ApplicationStatus = "대기중" | "매칭중" | "매칭완료" | "실패";

export type CatTemperament = "개냥이" | "수줍음" | "사나움";

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  kakaoId: string;
  email: string;
  gender: "남" | "여" | "기타";
  birthDate: string;
  region: Region;
  bio: string;
};

export type CatCard = {
  id: string;
  ownerId: string;
  name: string;
  gender: "수컷" | "암컷";
  age: number;
  neutered: boolean;
  temperament: CatTemperament;
  imageUrl?: string;
  description: string;
};

export type MatchPost = {
  id: string;
  authorId: string;
  title: string;
  category: PostCategory;
  region: Region;
  meetAt: string;
  content: string;
  status: PostStatus;
};

export type AppliedPostSummary = {
  postId: string;
  postTitle: string;
  myStatus: ApplicationStatus;
  matchingLabel: "매칭" | "대기" | "실패";
};

export type MatchOffer = {
  postId: string;
  postTitle: string;
  hostPhoneVisible: boolean;
  needAccept: boolean;
};
