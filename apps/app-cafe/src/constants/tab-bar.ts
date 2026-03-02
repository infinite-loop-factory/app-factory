import { Heart, Home, House, Search, User } from "lucide-react-native";

export const TAB_BAR_ICON = {
  home: {
    basic: Home,
    focused: House,
  },
  search: {
    basic: Search,
    focused: Search,
  },
  favorites: {
    basic: Heart,
    focused: Heart,
  },
  profile: {
    basic: User,
    focused: User,
  },
} as const;
