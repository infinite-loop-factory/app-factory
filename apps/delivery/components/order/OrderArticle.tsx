import { MessageSquare } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function OrderArticle() {
  return (
    <View className={"flex w-full flex-row justify-between"}>
      <View className={"gap-y-1 px-2"}>
        <View className={"flex flex-row justify-between py-1"}>
          <View className={"flex flex-row gap-2"}>
            <Text className={"title-1"}>닭강정(소)</Text>
          </View>
        </View>

        <View className={"flex flex-row gap-2"}>
          <Text className={"title-2 my-[10px] text-nowrap"}>12,900원</Text>
        </View>

        <View
          className={
            "my-[8px] flex w-fit flex-row gap-2 rounded-[5px] bg-orange-200 p-[4px]"
          }
        >
          <Text className={"body-4 !text-orange-950 text-nowrap font-bold"}>
            사장님 추천
          </Text>
        </View>

        <View className={"flex flex-row gap-2"}>
          <MessageSquare />
          <Text className={"body-4 text-nowrap"}>리뷰 57개</Text>
        </View>
      </View>
      <View className={"flex flex-row gap-1"}>
        <TouchableOpacity>
          <View
            className={" h-[170px] w-[170px] rounded-xl bg-primary-50 p-2"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
