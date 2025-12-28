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
      className="min-w-[300px] overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800"
      onPress={onPress}
    >
      <Image
        className="h-48 w-full"
        resizeMode="cover"
        source={{ uri: cafe.image }}
      />
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="flex-1 font-bold text-lg text-gray-900 dark:text-white">
            {cafe.name}
          </Text>
          <View className="flex-row items-center gap-1">
            <Star className="fill-yellow-500 text-yellow-500" size={16} />
            <Text className="font-semibold text-sm text-gray-900 dark:text-white">
              {cafe.rating}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              ({cafe.reviewCount})
            </Text>
          </View>
        </View>
        <Text className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {cafe.description}
        </Text>
        <View className="mb-2 flex-row items-center gap-1">
          <MapPin className="text-gray-400 dark:text-gray-500" size={14} />
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {cafe.location}
          </Text>
        </View>
        <View className="mb-3 flex-row items-center gap-1">
          <Clock
            className={cafe.isOpen ? "text-green-500" : "text-red-500"}
            size={14}
          />
          <Text
            className={`font-medium text-xs ${
              cafe.isOpen ? "text-green-500" : "text-red-500"
            }`}
          >
            {cafe.isOpen ? "영업 중" : "영업 종료"}
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row flex-nowrap gap-2">
            {cafe.tags.map((tag) => (
              <View
                className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700"
                key={tag}
              >
                <Text className="text-xs text-gray-700 dark:text-gray-300">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Pressable>
  );
}
