import { Dimensions, Image, Text, View } from "react-native";

type TCourseCardProp = {
  item: {
    id: string;
    image: string;
    name: string;
    review: string;
    createdAt: string;
  };
};

export default function ReviewCard({ item }: TCourseCardProp) {
  const { image, name, review, createdAt } = item;

  const screenWidth = Dimensions.get("window").width;
  const calculatedWidth = screenWidth - 110;

  return (
    <View className="flex w-full flex-row rounded-lg border border-slate-200 p-4">
      <Image src={image} className="mr-4 h-10 w-10 rounded-full" />
      <View style={{ width: calculatedWidth }} className="flex flex-column">
        <View className="flex flex-row justify-between">
          <Text className="mb-2 font-semibold text-md">{name}</Text>
          <Text className=" text-slate-500 text-sm">{createdAt}</Text>
        </View>

        <View className="flex flex-row overflow-hidden">
          <Text className="mr-2 mb-2 text-slate-500 text-sm" numberOfLines={2}>
            {review}
          </Text>
        </View>
      </View>
    </View>
  );
}
