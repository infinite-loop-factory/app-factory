import type { Translations } from "../types/translations";

export const translations: Translations = {
  common: {
    welcome: "환영합니다",
    home: "홈",
    search: "검색",
    favorites: "즐겨찾기",
    profile: "프로필",
    settings: "설정",
  },
  tabs: {
    home: "홈",
    search: "검색",
    favorites: "즐겨찾기",
    profile: "프로필",
  },
  settings: {
    language: "언어",
    themeColor: "테마 색상",
    themeStyle: "테마 스타일",
    tabBarStyle: "탭바 스타일",
  },
  home: {
    findCafesTitle: "카페를 찾아볼까요?",
    findCafesSubtitle: "근처의 최고 카페들을 발견하세요",
    popularCafes: "인기 카페",
    allCafes: "모든 카페",
  },
  search: {
    searchCafes: "카페 검색",
    searchPlaceholder: "카페 이름, 위치, 태그 검색...",
    searchResults: "검색 결과",
    noSearchResults: "검색 결과가 없습니다",
  },
  favorites: {
    noFavorites: "아직 즐겨찾기한 카페가 없어요",
    myFavorites: "내 즐겨찾기",
  },
  profile: {
    accountInfo: "계정 정보",
    name: "이름",
    email: "이메일",
    location: "지역",
    settings: "설정",
    ownerMode: "사장님 모드",
    ownerModeDescription: "사장님이시면 카페를 등록하고 관리할 수 있습니다",
  },
  cafe: {
    intro: "소개",
    businessInfo: "영업정보",
    open: "영업 중",
    closed: "영업 종료",
    menu: "메뉴",
    photos: "사진",
    reviews: "리뷰",
  },
};

export default translations;
