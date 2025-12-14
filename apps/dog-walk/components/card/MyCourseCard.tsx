import type { CourseRow } from "@/types/course";

import { router } from "expo-router";
import { MapPin, MoreVertical } from "lucide-react-native";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import dayjs from "@/library/dayjs";
import { convertSecondsToMinutes, formatDistanceKm } from "@/utils/number";

interface MyCourseCardProps {
  item: CourseRow;
  onPressOptions: () => void;
}

export default function MyCourseCard({
  item,
  onPressOptions,
}: MyCourseCardProps) {
  const handlePress = () => {
    router.push({
      pathname: "/(screens)/detail/[id]",
      params: { id: item.id },
    });
  };

  const textSecondaryClass = "text-slate-600";
  const hstackItemsClass = "items-center gap-1";

  return (
    <Pressable onPress={handlePress}>
      <HStack className="gap-3 rounded-xl bg-white p-3">
        <View className="h-24 w-24 overflow-hidden rounded-lg">
          <Image className="h-full w-full object-cover" src={item.image_url} />
        </View>

        <VStack className="flex-1 gap-1">
          <HStack className="items-center justify-between gap-2">
            <Text
              className="flex-1 font-semibold text-slate-900"
              numberOfLines={1}
            >
              {item.start_name} 출발
            </Text>
            <TouchableOpacity onPress={onPressOptions}>
              <Icon as={MoreVertical} className="h-4 w-4 text-slate-400" />
            </TouchableOpacity>
          </HStack>

          <HStack className={hstackItemsClass}>
            <Icon as={MapPin} className="h-3 w-3 text-slate-600" size="sm" />
            <Text
              className={`flex-1 ${textSecondaryClass}`}
              numberOfLines={1}
              size="sm"
            >
              {item.end_name} 도착
            </Text>
          </HStack>

          <HStack className={hstackItemsClass}>
            <Text className={textSecondaryClass} size="sm">
              {formatDistanceKm(item.total_distance)}km{" • "}
              {convertSecondsToMinutes(item.total_time)}분
            </Text>
          </HStack>

          <Text className={textSecondaryClass} size="sm">
            {dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
