import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";

import ShoppingArticle from "@/components/shopping/shopping.article";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorToken } from "@/features/shared/hooks/useThemeColor";
import { cn } from "@infinite-loop-factory/common";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Shopping() {
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
        <Box className="sticky top-0 z-[10000] flex flex-row justify-between bg-background-50 p-5 py-4">
          <TouchableOpacity
            className={"flex flex-row items-center justify-center gap-1"}
          >
            <Text className="title-3">서초구 효령로 321</Text>
            <Ionicons name={"chevron-down"} size={20} color={typography} />
          </TouchableOpacity>
          <Box className="flex flex-row gap-5">
            <Ionicons name={"calculator"} size={24} color={typography} />
            <Ionicons name={"search"} size={24} color={typography} />
            <Ionicons name={"cart-outline"} size={24} color={typography} />
          </Box>
        </Box>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={" border-outline-50 border-b"}
        >
          <Box
            className={"flex w-full flex-row gap-[15px] space-x-3 px-5 pt-2"}
          >
            {categories.map((d) => (
              <TouchableOpacity
                onPress={() => setCurrentMenu(d)}
                key={d}
                className={"min-w-[60px]"}
              >
                <Box
                  className={cn(" py-1 font-extrabold", {
                    "!text-typography-0 border-typography-0 border-b-2":
                      d === currentMenu,
                  })}
                >
                  <Text className={"title-3 text-center"}>{d}</Text>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className={"border-outline-50 border-b"}
        >
          <Box
            className={
              "flex h-full w-full flex-row items-center justify-center gap-3 space-x-3 p-2 pt-2"
            }
          >
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold text-black"}>기본순</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold text-black"}>쿠폰</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold text-black"}>배달방식</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "flex h-[30px] items-center justify-center rounded-3xl bg-white px-3 shadow"
              }
            >
              <Text className={"m-auto font-bold text-black"}>배달팁</Text>
            </TouchableOpacity>
          </Box>
        </ScrollView>

        <Box>
          <Box className={"p-3"}>
            {[...Array(10)].map((_d, i) => {
              return (
                <Box
                  key={String(i)}
                  className={cn(
                    "border-outline-50 border-b last:border-b-0",
                    "mb-1 py-4 last:py-0",
                  )}
                >
                  <ShoppingArticle />
                </Box>
              );
            })}
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
