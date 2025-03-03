import { MapPinnedIcon, StarIcon } from "lucide-react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type TCourseDetailCardProp = {
  item: {
    id: string;
    title: string;
    image: string;
    distance: number;
    totalTime: number;
    address: string;
    rate: number;
  };
};

export default function CourseDetailCard({ item }: TCourseDetailCardProp) {
  const { title, distance, totalTime, address, rate } = item;

  return (
    <TouchableOpacity>
      <HStack className="border-slate-200 border-b p-4">
        <Image
          className="mr-4 h-20 w-20 rounded-lg object-cover"
          source={require("../../assets/images/walking-main-1.png")}
        />
        <VStack className="flex-1 justify-between">
          <HStack className="items-start justify-between">
            <Text className="flex-1 font-semibold">{title}</Text>
            <HStack className="items-center">
              <Icon
                as={StarIcon}
                className="h-4 w-4 fill-current text-yellow-400"
              />
              <Text size={"sm"} className="ml-1">
                {rate}
              </Text>
            </HStack>
          </HStack>
          <Text size={"sm"} className="text-slate-500">
            {distance}km • {totalTime}분
          </Text>
          <HStack className="items-center overflow-hidden">
            <Icon
              as={MapPinnedIcon}
              className="mr-1 h-4 w-4 text-primary-500"
            />
            <Text size={"sm"} className="text-ellipsis">
              {address}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
