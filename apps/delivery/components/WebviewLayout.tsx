import { Colors } from "@/constants/Colors";
import type { ReactNode } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebviewLayout({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView className={"flex-1 bg-[#b9e2e0]"}>
      <View className={"flex-1 flex-row items-center justify-center"}>
        {/* 좌측 메타 정보 */}
        <View
          className={
            "hidden min-w-[180px] flex-[9] flex-row items-center justify-center text-center md:block"
          }
        >
          <Image
            className={"mx-auto"}
            style={{ width: 150, height: 150 }}
            source={require("@/assets/images/il.png")}
          />

          <Text className={"block text-center text-[45px]"}>{"무한루프"}</Text>
          <Text className={"block text-center font-bold text-[45px]"}>
            {"앱 공장 "}
          </Text>
        </View>
        {/* 내용 */}
        <View
          className={"h-full min-w-[400px] flex-[4] overflow-hidden"}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <View
            className={"flex-1"}
            style={{ backgroundColor: Colors.light.background }}
          >
            {children}
          </View>
        </View>
        {/*  나머지 영역 */}
        <View className={"hidden flex-[4] md:block"} />
      </View>
    </SafeAreaView>
  );
}
