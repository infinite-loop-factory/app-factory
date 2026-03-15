import type { AppliedPostSummary, MatchOffer, MatchPost } from "./types";

export const mockPosts: MatchPost[] = [
  {
    id: "post-1",
    authorId: "user-1",
    title: "저녁 시간 고양이 돌봄 부탁드려요",
    category: "돌봄",
    region: "서울시 구로구",
    meetAt: "2026-01-28 19:30",
    content: "출장으로 하루 비워야 해서 저녁 급식/화장실 관리 부탁드립니다.",
    status: "모집",
  },
  {
    id: "post-2",
    authorId: "user-2",
    title: "우리 냥이 친구 찾아요",
    category: "친구찾기",
    region: "서울시 관악구",
    meetAt: "2026-02-02 14:00",
    content: "사람을 좋아하는 2살 고양이입니다. 차분한 친구 원해요.",
    status: "매칭중",
  },
  {
    id: "post-3",
    authorId: "user-3",
    title: "고양이 모래/용품 나눔",
    category: "물품나눔",
    region: "서울시 노원구",
    meetAt: "2026-02-05 11:00",
    content: "미개봉 모래와 장난감 나눔합니다. 필요한 분 연락 주세요.",
    status: "매칭완료",
  },
];

export const mockAppliedPosts: AppliedPostSummary[] = [
  {
    postId: "post-1",
    postTitle: "저녁 시간 고양이 돌봄 부탁드려요",
    myStatus: "대기중",
    matchingLabel: "대기",
  },
  {
    postId: "post-2",
    postTitle: "우리 냥이 친구 찾아요",
    myStatus: "매칭중",
    matchingLabel: "매칭",
  },
  {
    postId: "post-3",
    postTitle: "고양이 모래/용품 나눔",
    myStatus: "실패",
    matchingLabel: "실패",
  },
];

export const mockMatchOffers: MatchOffer[] = [
  {
    postId: "post-2",
    postTitle: "우리 냥이 친구 찾아요",
    hostPhoneVisible: true,
    needAccept: true,
  },
];
