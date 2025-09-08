import type { CourseRow } from "@/types/course";

import { router } from "expo-router";
import { MapIcon } from "lucide-react-native";
import { Image, Text, TouchableOpacity } from "react-native";
import Images from "@/assets/images";
import { formatDistanceKm } from "@/utils/number";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { VStack } from "../ui/vstack";

export default function CourseCard({ item }: { item: CourseRow }) {
  const { id, start_name, end_name, total_distance, total_time, image_url } =
    item;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        router.push({ pathname: "/(screens)/detail/[id]", params: { id } });
      }}
    >
      <VStack className="w-72 overflow-hidden rounded-lg border border-slate-200">
        <Image
          className="h-40 w-72"
          source={image_url ? { uri: image_url } : Images.walkingMainImage3}
        />
        <VStack className="gap-2 p-4">
          <Text className="text-ellipsis font-semibold" numberOfLines={1}>
            {start_name} 출발
          </Text>
          <HStack className="gap-2">
            <Text className="text-slate-500 text-sm">
              거리 : {formatDistanceKm(total_distance)}km
            </Text>
            <Text className="text-slate-500 text-sm">
              소요 시간 : {Math.round(total_time / 60)}분
            </Text>
          </HStack>
          <HStack className="items-center gap-2">
            <Icon as={MapIcon} className="text-primary-500" />
            <Text className="text-primary-500 text-sm">{end_name}</Text>
          </HStack>
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
}
