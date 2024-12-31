import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import ShoppingArticle from "@/components/shopping/shopping.article";
import { useColorToken } from "@/hooks/useThemeColor";
import { cn } from "@infinite-loop-factory/common";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPage() {
  const { typography } = useColorToken({
    typography: true,
    primary: true,
  });
  const categories = useMemo(() => {
    return ["홈", "치킨", "중식", "돈까스", "피자", "패스트푸드"];
  }, []);

  const [currentMenu, setCurrentMenu] = useState(categories[0]);

  return (
    <SafeAreaView className={"flex-1"}>
      <ScrollView>
        {/*  head */}
        <View className="sticky top-0 z-[10000] flex flex-row justify-between bg-background-50 p-5 py-4">
          <TouchableOpacity
            className={"flex flex-row items-center justify-center gap-1"}
          >
            <Text className="title-3">서초구 효령로 321</Text>
            <Ionicons name={"chevron-down"} size={20} color={typography} />
          </TouchableOpacity>
          <View className="flex flex-row gap-5">
            <Ionicons name={"calculator"} size={24} color={typography} />
            <Ionicons name={"search"} size={24} color={typography} />
            <Ionicons name={"cart-outline"} size={24} color={typography} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={" border-outline-50 border-b"}
        >
          <View
            className={"flex w-full flex-row gap-[15px] space-x-3 px-5 pt-2"}
          >
            {categories.map((d) => (
              <TouchableOpacity
                onPress={() => setCurrentMenu(d)}
                key={d}
                className={"min-w-[60px]"}
              >
                <View
                  className={cn(" py-1 font-extrabold", {
                    "!text-typography-0 border-typography-0 border-b-2":
                      d === currentMenu,
                  })}
                >
                  <Text className={"title-3 text-center"}>{d}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={"border-outline-50 border-b"}
        >
          <View
            className={
              "flex h-full w-full flex-row items-center justify-center gap-3 space-x-3 p-2 pt-2"
            }
          >
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>기본순</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>쿠폰</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>배달방식</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold"}>배달팁</Text>
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
                  <ShoppingArticle />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
