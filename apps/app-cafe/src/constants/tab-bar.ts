import {
  Heart,
  Home,
  House,
  Map,
  MapPin,
  Search,
  User,
} from "lucide-react-native";

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
  map: {
    basic: Map,
    focused: MapPin,
  },
  profile: {
    basic: User,
    focused: User,
  },
} as const;
