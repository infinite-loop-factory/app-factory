import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { Stack } from "expo-router";
import type { FC } from "react";
import { Pressable, Text, View } from "react-native";

/**
 * 다시하기 버튼 홈으로가기 버튼
 */
const Measurement: FC = () => {
  const { result, start, stop } = useReactionTimer();

  return (
    <Pressable onPress={stop} className="flex-1">
      <View className="flex-1 items-center justify-center gap-y-5">
        <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />
        <View className="flex items-center">
          <Text className="text-2xl">이미지가 나타나면</Text>
          <Text className="text-2xl">화면을 터치해주세요</Text>
        </View>

        <View className="h-32 w-32 items-center justify-center">
          <DelayRender minDelay={1000} maxDelay={3000} onRender={start}>
            <SvgWrapper>
              <SmileSvg />
            </SvgWrapper>
          </DelayRender>
        </View>

        <View className="h-8 items-center justify-center">
          {result && <Text>반응 시간: {result.reactionTime}ms</Text>}
        </View>
      </View>
    </Pressable>
  );
};

export default Measurement;
