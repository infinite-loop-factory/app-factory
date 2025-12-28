import {
  Home,
  Search,
  Heart,
  User,
  House as HomeOutline,
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
  style?: any;
}) {
  const icons: Record<string, React.ElementType<any>> = {
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

  return <Icon size={size} color={color} style={style} />;
}
