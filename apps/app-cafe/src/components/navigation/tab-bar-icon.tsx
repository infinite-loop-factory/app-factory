import type { ViewStyle } from "react-native";

import {
  Heart,
  Home,
  House as HomeOutline,
  type LucideIconProps,
  Search,
  User,
} from "lucide-react-native";

export function TabBarIcon({
  name,
  color,
  size = 24,
  style,
}: {
  name: string;
  color?: string;
  size?: number;
  style?: ViewStyle;
}) {
  const icons: Record<string, React.ElementType<LucideIconProps>> = {
    home: Home,
    "home-outline": HomeOutline,
    search: Search,
    "search-outline": Search,
    heart: Heart,
    "heart-outline": Heart,
    person: User,
    "person-outline": User,
  };

  const Icon = icons[name] || Home;

  return <Icon color={color} size={size} style={style} />;
}
