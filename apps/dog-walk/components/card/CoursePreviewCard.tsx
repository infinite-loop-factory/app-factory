import { Image } from "react-native";
import Images from "@/assets/images";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface CoursePreviewCardProps {
  imageUrl: string;
  startName: string;
  endName: string;
}

export default function CoursePreviewCard({
  imageUrl,
  startName,
  endName,
}: CoursePreviewCardProps) {
  return (
    <HStack className="items-center gap-3 rounded-lg border border-typography-100 p-4">
      <Image
        className="h-16 w-16 rounded-xl"
        source={imageUrl ? { uri: imageUrl } : Images.walkingMainImage}
      />
      <VStack className="flex-1 gap-1">
        <Text className="font-semibold text-slate-900" numberOfLines={2}>
          {startName} - {endName} 산책 코스
        </Text>
        <Text className="text-slate-500 text-sm" numberOfLines={1}>
          {startName} 출발
        </Text>
      </VStack>
    </HStack>
  );
}
