import { cn } from "@gluestack-ui/utils";
import { Image } from "expo-image";
import { Clock, MapPin, Star } from "lucide-react-native";
import { Platform, Pressable, ScrollView, View } from "react-native";
import { CafeTag } from "@/components/features/cafe/cafe-tag";
import { ThemedText } from "@/components/ui/themed-text";
import { themeConfig, useThemeStore } from "@/hooks/use-theme";

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
  const { mode } = useThemeStore();

  return (
    <Pressable
      className="overflow-hidden rounded-2xl bg-background-0 shadow-sm"
      onPress={onPress}
      style={{
        zIndex: 2001,
        shadowColor: mode === "dark" ? "#000" : "#000",
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: Platform.OS === "ios" ? 0.03 : 0.02,
        shadowRadius: Platform.OS === "ios" ? 2 : 1.5,
        elevation: Platform.OS === "android" ? 2 : 1.5,
      }}
    >
      <Image
        contentFit="cover"
        source={cafe.image}
        style={{ height: 200, width: "100%" }}
      />
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <ThemedText className="flex-1 font-bold text-lg text-typography-0">
            {cafe.name}
          </ThemedText>
          <View className="flex-row items-center gap-1">
            <Star color="#FBBF24" fill="#FBBF24" size={16} />
            <ThemedText className="font-semibold text-typography-0">
              {String(cafe.rating)}
            </ThemedText>
            <ThemedText className="text-typography-300 text-xs">
              ({cafe.reviewCount})
            </ThemedText>
          </View>
        </View>
        <ThemedText className="mb-3 text-typography-300">
          {cafe.description}
        </ThemedText>
        <View className="mb-1 flex-row items-center gap-1">
          <MapPin color="rgb(156 163 175 / 1)" size={12} />
          <ThemedText className="text-typography-300 text-xs">
            {cafe.location}
          </ThemedText>
        </View>
        <View className="mb-3 flex-row items-center gap-1">
          <Clock
            color={
              cafe.isOpen
                ? themeConfig.getHex(mode, "--color-success-400")
                : themeConfig.getHex(mode, "--color-error-400")
            }
            size={12}
          />
          <ThemedText
            className={cn(
              "font-medium text-xs",
              cafe.isOpen ? "text-success-400" : "text-error-400",
            )}
          >
            {cafe.isOpen ? "영업 중" : "영업 종료"}
          </ThemedText>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row flex-nowrap gap-2">
            {cafe.tags.map((tag) => (
              <CafeTag key={tag} tag={tag} />
            ))}
          </View>
        </ScrollView>
      </View>
    </Pressable>
  );
}
