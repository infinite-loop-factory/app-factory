import { Clock, MapPin, Star } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

interface Cafe {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  tags: string[];
  isOpen: boolean;
  isFavorite?: boolean;
}

interface CafeCardProps {
  cafe: Cafe;
  onPress?: () => void;
}

export function CafeCard({ cafe, onPress }: CafeCardProps) {
  return (
    <Pressable
      className="min-w-[300px] overflow-hidden rounded-2xl bg-background-0 shadow-sm"
      onPress={onPress}
    >
      <Image
        className="h-48 w-full"
        resizeMode="cover"
        source={{ uri: cafe.image }}
      />
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="flex-1 font-bold text-lg text-typography-0">
            {cafe.name}
          </Text>
          <View className="flex-row items-center gap-1">
            <Star className="fill-warning-400 text-warning-400" size={16} />
            <Text className="font-semibold text-sm text-typography-0">
              {cafe.rating}
            </Text>
            <Text className="text-typography-300 text-xs">
              ({cafe.reviewCount})
            </Text>
          </View>
        </View>
        <Text className="mb-3 text-sm text-typography-300">
          {cafe.description}
        </Text>
        <View className="mb-2 flex-row items-center gap-1">
          <MapPin className="text-outline-400" size={14} />
          <Text className="text-sm text-typography-300">{cafe.location}</Text>
        </View>
        <View className="mb-3 flex-row items-center gap-1">
          <Clock
            className={cafe.isOpen ? "text-success-300" : "text-error-300"}
            size={14}
          />
          <Text
            className={`font-medium text-xs ${
              cafe.isOpen ? "text-success-300" : "text-error-300"
            }`}
          >
            {cafe.isOpen ? "영업 중" : "영업 종료"}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row flex-nowrap gap-2">
            {cafe.tags.map((tag) => (
              <View className="rounded-full bg-primary-50 px-3 py-1" key={tag}>
                <Text className="text-primary-900 text-xs">#{tag}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Pressable>
  );
}
