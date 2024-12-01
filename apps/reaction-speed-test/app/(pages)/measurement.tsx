import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { Stack } from "expo-router";
import type { FC } from "react";
import { Pressable, Text, View } from "react-native";

/**
 * TODO: 레이아웃 시프팅 일어나지 않게 자리 고정
 * 다시하기 버튼 홈으로가기 버튼
 */
const Measurement: FC = () => {
  const { result, start, stop } = useReactionTimer();

  return (
    <Pressable onPress={stop} className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />
        <Text className="mb-5 text-2xl">
          이미지가 나타나면 화면을 터치해주세요
        </Text>
        <DelayRender minDelay={1000} maxDelay={3000} onRender={start}>
          {/* 컴포넌트 이름 파일명 일치하게 수정해야함 */}
          <SvgWrapper>
            <SmileSvg />
          </SvgWrapper>
        </DelayRender>
        {result && <Text>반응 시간: {result.reactionTime}ms</Text>}
      </View>
    </Pressable>
  );
};

export default Measurement;
