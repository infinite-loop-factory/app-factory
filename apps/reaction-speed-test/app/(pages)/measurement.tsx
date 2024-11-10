import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgComponent";
import { Stack } from "expo-router";
import type { FC } from "react";
import { Text, View } from "react-native";

const Measurement: FC = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />
      <Text className="mb-5 text-2xl">
        이미지가 나타나면 화면을 터치해주세요
      </Text>
      <SvgWrapper>
        <SmileSvg />
      </SvgWrapper>
    </View>
  );
};

export default Measurement;
