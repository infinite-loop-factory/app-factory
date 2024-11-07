import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import DarkModeToggle from "@/components/web-layout/DarkModeToggle";
import { Colors } from "@/constants/Colors";
import { type ReactNode, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type appType = { name: string };
export default function WebviewLayout({ children }: { children: ReactNode }) {
  const baseURl = "https://infinite-loop-factory.github.io/app-factory/";
  const [apps, setApps] = useState<appType[]>([]);

  useEffect(() => {
    (async () => {
      const data: appType[] = await fetch(`${baseURl}app-list.json`).then((d) =>
        d.json(),
      );
      setApps(data);
    })();
  }, []);

  if (typeof window === "undefined") return children;

  const selectedApp = location.href.includes(baseURl)
    ? location.href.replace(baseURl, "").split("/")[0]
    : apps[0]?.name;

  return (
    <SafeAreaView className={"flex-1 bg-primary-50 "}>
      <View className={"flex-1 flex-row items-center justify-center"}>
        {/* 좌측 메타 정보 */}
        <View
          className={
            "hidden min-w-[500px] flex-[9] flex-row items-center justify-center text-center md:block"
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
          <View className={"flex items-center justify-center"}>
            <DarkModeToggle />
          </View>
          <View className={" flex items-center justify-center p-3"}>
            <Select
              className={"w-[350px] "}
              selectedValue={selectedApp}
              onValueChange={(d) => {
                location.href = `${baseURl}${d}`;
              }}
            >
              <SelectTrigger
                className={
                  "h-[90px] rounded-full !hover:border-black border-[3px] border-black bg-background-50 "
                }
              >
                <SelectInput
                  placeholder="Select App"
                  className={
                    "!hover:border-black border-black text-center font-bold text-[33px]"
                  }
                />
                <SelectIcon className="mr-3" />
              </SelectTrigger>
              <SelectPortal className={"text-[33px] text-red"}>
                <SelectBackdrop className={" text-red"} />
                <SelectContent className={"p-[100px] text-red"}>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {apps.map(({ name }) => (
                    <SelectItem key={name} label={name} value={name} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>
        </View>

        {/* 내용 */}
        <View
          className={
            "h-full flex-[4] overflow-hidden md:h-[70%] md:min-w-[400px] md:max-w-[400px] "
          }
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <View className={"flex-1"}>
            <View
              className={"flex-1"}
              style={{ backgroundColor: Colors.light.background }}
            >
              {children}
            </View>
          </View>
        </View>

        {/*  나머지 영역 */}
        <View className={"hidden flex-[4] md:block"} />
      </View>
    </SafeAreaView>
  );
}
