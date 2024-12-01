import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { Stack } from "expo-router";
import { type FC, useState } from "react";
import { Pressable, Text, View } from "react-native";

/**
 * 다시하기 버튼 홈으로가기 버튼
 */
const Measurement: FC = () => {
  const { result, start, stop, earlyPress } = useReactionTimer();
  const [shouldRestart, setShouldRestart] = useState(false);

  const handlePress = () => {
    if (result) return;

    const timeResult = stop();
    if (!timeResult) {
      // early press인 경우
      setShouldRestart(true); // 재시작 트리거
      setTimeout(() => {
        setShouldRestart(false);
      }, 100); // 짧은 지연으로 재시작 트리거 초기화
    }
  };

  return (
    <Pressable onPress={handlePress} className="flex-1">
      <View className="flex-1 items-center justify-center gap-y-5">
        <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />

        <View className="flex items-center">
          <Text className="text-2xl">이미지가 나타나면</Text>
          <Text className="text-2xl">화면을 터치해주세요</Text>
        </View>

        <View className="h-32 w-32 items-center justify-center">
          <DelayRender
            minDelay={1000}
            maxDelay={3000}
            onRender={start}
            shouldRestart={shouldRestart}
          >
            <SvgWrapper>
              <SmileSvg />
            </SvgWrapper>
          </DelayRender>
        </View>

        <View className="h-8 items-center justify-center">
          {result && (
            <Text className="text-lg">반응 시간: {result.reactionTime}ms</Text>
          )}
          {earlyPress && !result && (
            <Text className="text-red-500">너무 빨리 터치했습니다!</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default Measurement;
