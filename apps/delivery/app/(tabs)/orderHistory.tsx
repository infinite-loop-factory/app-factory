import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import OrderArticle from "@/components/order/OrderArticle";
import { cn } from "@infinite-loop-factory/common";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView className={"flex-1"}>
      <ScrollView>
        {/*  head */}
        <View className="sticky top-0 z-[10000] flex flex-row justify-between bg-background-50 p-5 py-4">
          <TouchableOpacity
            className={"flex flex-row items-center justify-center gap-1"}
          >
            <Text className="title-3">{"< 더 대박 남부터미널역"}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={"border-outline-50 border-b py-[10px]"}
        >
          <View
            className={
              "flex h-full w-full flex-row items-center justify-center space-x-3 p-2 pt-2"
            }
          >
            <TouchableOpacity
              className={
                "flex h-[35px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>메뉴찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[35px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>추천메뉴</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[35px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>기본메뉴</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[35px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>세트메뉴</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View>
          <View className={"p-3"}>
            {[...Array(10)].map((_d, i) => {
              return (
                <View
                  key={String(i)}
                  className={cn(
                    "border-outline-50 border-b last:border-b-0",
                    "mb-1 py-4 last:py-0",
                  )}
                >
                  <OrderArticle />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
