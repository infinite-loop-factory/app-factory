import type { Translations } from "../types/translations";

export const translations: Translations = {
  common: {
    welcome: "Welcome",
    home: "Home",
    search: "Search",
    favorites: "Favorites",
    profile: "Profile",
    settings: "Settings",
  },
  tabs: {
    home: "Home",
    search: "Search",
    favorites: "Favorites",
    profile: "Profile",
  },
  settings: {
    language: "Language",
    themeColor: "Theme color",
    themeStyle: "Theme style",
    tabBarStyle: "Tab bar style",
  },
  home: {
    findCafesTitle: "Let's find a cafe?",
    findCafesSubtitle: "Discover best cafes nearby",
    popularCafes: "Popular Cafes",
    allCafes: "All Cafes",
  },
  search: {
    searchCafes: "Search Cafes",
    searchPlaceholder: "Search cafe name, location, tags...",
    searchResults: "Search Results",
    noSearchResults: "No search results found",
  },
  favorites: {
    noFavorites: "No favorite cafes yet",
    myFavorites: "My Favorites",
  },
  profile: {
    accountInfo: "Account Info",
    name: "Name",
    email: "Email",
    location: "Location",
    settings: "Settings",
    ownerMode: "Owner Mode",
    ownerModeDescription: "Register and manage your cafe if you're an owner",
  },
  cafe: {
    intro: "Introduction",
    businessInfo: "Business Info",
    open: "Open",
    closed: "Closed",
    menu: "Menu",
    photos: "Photos",
    reviews: "Reviews",
  },
};

export default translations;
