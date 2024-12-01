import { Input, InputField, InputSlot } from "@/components/ui/input";
import { useColorToken } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@infinite-loop-factory/common";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { shuffle } from "es-toolkit";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { typography, primary } = useColorToken({
    typography: true,
    primary: true,
  });

  const [currentMenu, setCurrentMenu] = useState("음식배달");

  const { categories, stores, menuList } = useMemo(
    () => ({
      categories: ["음식배달", "가게배달", "포장", "장보기 쇼핑", "선물하기"],

      stores: [
        { name: "B마트", icon: "🛒" },
        { name: "홈플러스", icon: "🏬" },
        { name: "GS25", icon: "🏪" },
        { name: "GS더프레시", icon: "🥦" },
        { name: "CU", icon: "🛍" },
      ],
      menuList: [
        { name: "치킨", icon: "🍗" },
        { name: "중식", icon: "🥢" },
        { name: "돈까스·회", icon: "🍣" },
        { name: "피자", icon: "🍕" },
        { name: "패스트푸드", icon: "🍔" },
        { name: "찜·탕", icon: "🥘" },
        { name: "족발·보쌈", icon: "🍖" },
        { name: "분식", icon: "🌭" },
        { name: "카페·디저트", icon: "🧁" },
        { name: "스타벅스", icon: "☕" },
      ],
    }),
    [],
  );

  const { data: menu = [] } = useQuery({
    queryKey: ["menu", currentMenu],
    queryFn: () => shuffle(menuList),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: keepPreviousData,
  });

  return (
    <SafeAreaView className={"flex-1 bg-background-50"}>
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

        <View className="px-5 ">
          {/* input */}
          <View>
            <Input
              className={" border-primary px-5"}
              variant={"rounded"}
              size={"lg"}
            >
              <InputField
                placeholder="순대볶음 나와라 뚞딲!!"
                className={"p-0"}
              />
              <InputSlot>
                <Ionicons name={"search"} size={24} color={primary} />
              </InputSlot>
            </Input>
          </View>

          {/* AD */}
          <TouchableOpacity className="flex flex-row items-center justify-center text-nowrap p-5">
            <Text
              className={"title-5 !text-typography-100 space-x-2 text-nowrap"}
            >
              <Text>{"🎉 B마트"}</Text>
              <Text>{" | "}</Text>
              <Text>{"여기서 드려요! 100% 당첨 쿠폰 >"}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View className={"rounded-t-[20px] bg-background-0 shadow-main-top"}>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className={"border-outline-50 border-b"}
            >
              <View
                className={
                  "flex h-full w-full flex-row gap-[15px] space-x-3 px-5 pt-2"
                }
              >
                {categories.map((d) => (
                  <View
                    key={d}
                    className={cn(
                      "title-3 !text-typography-400 h-full py-2 font-extrabold",
                      {
                        "!text-typography-0 border-typography-0 border-b-2":
                          d === currentMenu,
                      },
                    )}
                  >
                    <TouchableOpacity onPress={() => setCurrentMenu(d)}>
                      <Text>{d}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className={"flex flex-row flex-wrap gap-y-4 px-2 py-5"}>
            {menu.map((d) => {
              return (
                <TouchableOpacity
                  key={`${d.name}`}
                  className={
                    "flex flex-1 basis-1/5 flex-col items-center justify-center gap-[8px] "
                  }
                >
                  <View
                    className={
                      "flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-background-100 "
                    }
                  >
                    <Text className={"text-[23px]"}>{d.icon}</Text>
                  </View>
                  <Text className={"label-6 !text-[13px] text-nowrap"}>
                    {d.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className={
              "flex items-center justify-center border-outline-50 border-y p-2"
            }
          >
            <View className={"py-1"}>
              <Text className={"body-4"}>
                <Text className={"inline font-bold"}>{currentMenu}</Text>
                {"에서 더보기  >"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*footer*/}
        <View className={"mt-4 flex w-full flex-row bg-background-0 "}>
          {stores.map((d) => {
            return (
              <TouchableOpacity
                className={
                  "flex basis-1/5 items-center justify-center gap-[8px] p-2"
                }
                key={d.name}
              >
                <View
                  className={
                    "flex h-[57px] w-[57px] items-center justify-center rounded-2xl bg-background-100 text-[25px]"
                  }
                >
                  <Text className={"text-[23px]"}>{d.icon}</Text>
                </View>
                <Text className={"label-6 !text-[12px] text-nowrap"}>
                  {d.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* add */}
        <View className={"mt-3 w-full bg-background-0"}>
          <TouchableOpacity
            className={"flex h-[120px] items-center justify-center"}
          >
            <Text className={"body-2 "}>AD 영역</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
