import type { PropsWithChildren } from "react";

import { MenuIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Menu, MenuItem } from "@/components/ui/menu";
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

type appType = { name: string };

export default function WebviewLayout({ children }: PropsWithChildren) {
  const baseURL = "https://infinite-loop-factory.github.io/app-factory/";
  const [apps, setApps] = useState<appType[]>([]);

  useEffect(() => {
    (async () => {
      const data: appType[] = await fetch(`${baseURL}app-list.json`).then(
        (res) => res.json(),
      );
      setApps(data);
    })();
  }, []);

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <SafeAreaView className="flex-1 bg-[#b9e2e0]">
      <View className="flex-1 flex-row items-center justify-center">
        {/* 데스크탑용 좌측 메타 정보 */}
        <View className="hidden min-w-[500px] flex-[9] flex-row items-center justify-center text-center md:block">
          <Image
            className="mx-auto"
            source={require("@/assets/images/il.png")}
            style={{ width: 150, height: 150 }}
          />
          <Text className="block text-center text-[45px]">무한루프</Text>
          <Text className="block text-center font-bold text-[45px]">
            앱 공장
          </Text>
          <View className={" flex items-center justify-center p-3"}>
            <Select
              className={"w-[350px] "}
              onValueChange={(d) => {
                location.href = `${baseURL}${d}`;
              }}
              selectedValue={location.pathname.split("/")[0]}
            >
              <SelectTrigger
                className={
                  "h-[90px] rounded-full !hover:border-black border-[3px] border-black bg-[#f9f9fb] "
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
                <SelectBackdrop className="text-red" />
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

        <View
          className="h-full flex-[4] overflow-hidden md:h-[70%] md:min-w-[400px] md:max-w-[400px]"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <View className="flex-1">
            <View className="flex-1" style={{ backgroundColor: "#FFF" }}>
              {children}
            </View>
          </View>
        </View>

        <View className="hidden flex-[4] md:block" />
      </View>
      <Menu
        offset={5}
        placement="top"
        trigger={({ ...triggerProps }) => (
          <Fab {...triggerProps}>
            <FabIcon as={MenuIcon} />
          </Fab>
        )}
      >
        {apps.map(({ name }) => (
          <MenuItem
            key={name}
            onPress={() => {
              location.href = `${baseURL}${name}`;
            }}
          >
            <Text>{name}</Text>
          </MenuItem>
        ))}
      </Menu>
    </SafeAreaView>
  );
}
