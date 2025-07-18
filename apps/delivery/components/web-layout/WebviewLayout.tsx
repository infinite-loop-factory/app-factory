import { useAsyncEffect, usePlatform } from "@reactuses/core";
import { noop } from "es-toolkit";
import { type ReactNode, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { Colors } from "@/features/shared/constants/Colors";

type appType = { name: string };
export default function WebviewLayout({ children }: { children: ReactNode }) {
  const baseURl = "https://infinite-loop-factory.github.io/app-factory/";
  const [apps, setApps] = useState<appType[]>([]);

  useAsyncEffect(
    async () => {
      await fetch(`${baseURl}app-list.json`)
        .then((d) => d.json())
        .then(setApps);
    },
    noop,
    [],
  );
  const { platform } = usePlatform();
  // biome-ignore lint/suspicious/noConsole: debug
  console.log(platform);
  if (["ios", "android", "unknown"].includes(platform)) return children;

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
            source={require("@/assets/images/il.png")}
            style={{ height: 150, width: 150 }}
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
              onValueChange={(d) => {
                location.href = `${baseURl}${d}`;
              }}
              selectedValue={selectedApp}
            >
              <SelectTrigger
                className={
                  "h-[90px] rounded-full !hover:border-black border-[3px] border-black bg-background-50 "
                }
              >
                <SelectInput
                  className={
                    "!hover:border-black border-black text-center font-bold text-[33px]"
                  }
                  placeholder="Select App"
                />
                <SelectIcon className="mr-3" />
              </SelectTrigger>
              <SelectPortal className={"text-[33px] text-red"}>
                <SelectBackdrop className={"text-red"} />
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
            elevation: 8,
            shadowColor: "#000",
            shadowRadius: 10,
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
