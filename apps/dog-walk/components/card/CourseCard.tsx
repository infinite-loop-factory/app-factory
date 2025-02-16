import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

type TCourseCardProp = {
  item: {
    id: string;
    title: string;
    image: string;
    distance: number;
    totalTime: number;
    address: string;
  };
};

export default function CourseCard({ item }: TCourseCardProp) {
  const { title, distance, totalTime, address } = item;

  return (
    <View className=" flex w-72 flex-column overflow-hidden rounded-lg border border-slate-200">
      <Image
        source={require("../../assets/images/walking-main-3.png")}
        className="h-40 w-72"
      />
      <View className="flex p-4">
        <Text className="mb-2 font-semibold text-md">{title}</Text>
        <View className="flex flex-row">
          <Text className="mr-2 mb-2 text-slate-500 text-sm">
            거리 : {distance}km
          </Text>
          <Text className="mb-2 text-slate-500 text-sm">
            소요 시간 : {totalTime}분
          </Text>
        </View>
        <View className="flex flex-row items-center ">
          <Ionicons name="map-outline" className="mr-2" color={"#6DBE6E"} />
          {/* FIXME: 컬러 팔레트 정리하기 */}
          <Text className="text-[#6DBE6E] text-sm">{address}</Text>
        </View>
      </View>
    </View>
  );
}
