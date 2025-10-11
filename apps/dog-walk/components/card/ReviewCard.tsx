import type { ReviewDataType } from "@/types/review";

import { Dimensions, Image, Text, View } from "react-native";
import dayjs from "@/library/dayjs";
import { maskName } from "@/utils/string";

export default function ReviewCard({ item }: { item: ReviewDataType }) {
  const { content, created_at, users } = item;

  const screenWidth = Dimensions.get("window").width;
  const calculatedWidth = screenWidth - 110;

  return (
    <View className="mb-4 flex w-full flex-row rounded-lg border border-slate-200 p-4">
      <Image
        className="mr-4 h-10 w-10 rounded-full"
        source={
          users.profile_image_url
            ? { uri: users.profile_image_url }
            : require("../../assets/images/blank-image.png")
        }
      />
      <View className="flex flex-column" style={{ width: calculatedWidth }}>
        <View className="flex flex-row justify-between">
          <Text className="mb-2 font-semibold text-md">
            {maskName(users.name)}
          </Text>
          <Text className=" text-slate-500 text-sm">
            {dayjs(created_at).format("YYYY-MM-DD HH:mm")}
          </Text>
        </View>

        <View className="flex flex-row overflow-hidden">
          <Text className="mr-2 mb-2 text-slate-500 text-sm" numberOfLines={2}>
            {content}
          </Text>
        </View>
      </View>
    </View>
  );
}
