import {
  Image,
  type ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

type TCourseCardProp = {
  item: {
    id: string;
    image: ImageSourcePropType;
    distance: number;
    address: string;
    duration: number;
  };
};

export default function WalkingHistoryCard({ item }: TCourseCardProp) {
  const { distance, duration, image, address } = item;

  return (
    <TouchableOpacity>
      <View className="flex flex-row items-center justify-between rounded-xl bg-slate-50 p-4">
        <View className="flex flex-row items-center gap-4">
          <Image className="h-20 w-20 rounded-xl" source={image} />
          <View className="flex flex-1 gap-2">
            <Heading
              className="text-ellipsis font-semibold"
              numberOfLines={1}
              size={"sm"}
            >
              {address}
            </Heading>
            <Text className="text-slate-500" size={"sm"}>
              {distance}km • {duration}분
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
