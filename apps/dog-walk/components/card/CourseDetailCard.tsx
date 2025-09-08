import type { CourseRow } from "@/types/course";

import { router } from "expo-router";
import { MapPinnedIcon, StarIcon } from "lucide-react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Images from "@/assets/images";
import { formatDistanceKm } from "@/utils/number";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export default function CourseDetailCard({ item }: { item: CourseRow }) {
  const {
    id,
    start_name,
    average_rating,
    total_distance,
    total_time,
    end_name,
    image_url,
  } = item;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({ pathname: "/(screens)/detail/[id]", params: { id } });
      }}
    >
      <HStack className="items-center border-slate-200 border-b p-4">
        <Image
          className="mr-4 h-20 w-20 rounded-lg object-cover"
          source={image_url ? { uri: image_url } : Images.walkingMainImage}
        />
        <VStack className="flex-1 justify-between">
          <HStack className="items-start justify-between">
            <Text className="flex-1 font-semibold">{start_name} 출발</Text>
            <HStack className="items-center">
              <Icon
                as={StarIcon}
                className="h-4 w-4 fill-current text-yellow-400"
              />
              <Text className="ml-1" size={"sm"}>
                {average_rating}
              </Text>
            </HStack>
          </HStack>
          <Text className="text-slate-500" size={"sm"}>
            {formatDistanceKm(total_distance)}km • {Math.round(total_time / 60)}
            분
          </Text>
          <HStack className="items-center overflow-hidden">
            <Icon
              as={MapPinnedIcon}
              className="mr-1 h-4 w-4 text-primary-500"
            />
            <Text className="text-ellipsis" size={"sm"}>
              {end_name}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
