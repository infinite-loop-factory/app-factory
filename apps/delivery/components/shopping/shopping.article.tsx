import { CircleDollarSign, Info, Star } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import ShoppingImage from "@/components/shopping/shopping.image";
import { HStack } from "@/components/ui/hstack";

export default function ShoppingArticle() {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className={"flex flex-row gap-1"}>
          <ShoppingImage />
          <ShoppingImage />
          <ShoppingImage />
          <ShoppingImage />
          <ShoppingImage />
          <ShoppingImage />
        </View>
      </ScrollView>

      <View className={"gap-y-1 px-2"}>
        <View className={"flex flex-row justify-between py-1"}>
          <View className={"flex flex-row gap-2"}>
            <Text className={"body-4"}>갈비후라이의꿈</Text>
            <View className={"flex flex-row gap-1"}>
              <Star color={"yellow"} fill={"yellow"} width={14} />
              <Text className={"body-4"}>4.9</Text>
            </View>
          </View>
          <View className={"flex flex-row items-center justify-center gap-1"}>
            <Text className={"body-4 !text-gray-400"}>광고</Text>
            <Info width={14} />
          </View>
        </View>

        <View className={"flex flex-row gap-2"}>
          <View className={"flex flex-row gap-1"}>
            <CircleDollarSign color={"white"} fill={"blue"} width={14} />
            <Text className={"label-6"}>30~45분</Text>
          </View>
          <Text className={"label-6 text-nowrap"}>배달팁 1,440~2,940</Text>
          <View className={"flex flex-row"}>
            <Text className={"label-6"}>최소주문</Text>
            <Text className={"label-6"}>5,000원</Text>
          </View>
        </View>

        <HStack className={"flex flex-row"} space={"xs"}>
          <View className={"rounded border bg-white p-1"}>
            <Text>배달</Text>
          </View>
          <View className={"rounded border bg-white p-1"}>
            <Text>배달팁 할인중</Text>
          </View>
        </HStack>
      </View>
    </View>
  );
}
