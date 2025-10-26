import type { ReviewDataType } from "@/types/review";

import { Star } from "lucide-react-native";
import { Image } from "react-native";
import Images from "@/assets/images";
import dayjs from "@/library/dayjs";
import { maskName } from "@/utils/string";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface ReviewItemProps {
  reviewData: ReviewDataType;
  starIconColor: string;
}

export default function ReviewItem({
  reviewData,
  starIconColor,
}: ReviewItemProps) {
  const images = reviewData.images ? JSON.parse(reviewData.images) : [];

  return (
    <VStack className="gap-2 rounded-xl border border-slate-100 bg-white p-4">
      <HStack className="items-center gap-2">
        <Image
          className="h-10 w-10 rounded-full"
          source={
            reviewData.users.profile_image_url
              ? { uri: reviewData.users.profile_image_url }
              : Images.defaultProfileImage
          }
        />
        <VStack>
          <Text className="font-medium">{maskName(reviewData.users.name)}</Text>
          <HStack className="items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                as={Star}
                className={`h-4 w-4 ${i < Math.floor(reviewData.rate) ? "text-primary-500" : "text-slate-300"}`}
                fill={
                  i < Math.floor(reviewData.rate) ? `rgb(${starIconColor})` : ""
                }
                key={`review_${reviewData.id}_${i}`}
              />
            ))}
            <Text className="ml-2 text-slate-500" size="xs">
              {dayjs(reviewData.created_at).format("YYYY-MM-DD HH:mm")}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <Text className="text-slate-700 leading-relaxed" size="sm">
        {reviewData.content}
      </Text>
      {images.length > 0 ? (
        <HStack className="gap-2">
          {images.map((image: string) => (
            <Image
              className="h-20 w-20 rounded-lg object-cover"
              key={`review_image_${image}`}
              src={image || "/placeholder.svg"}
            />
          ))}
        </HStack>
      ) : null}
    </VStack>
  );
}
