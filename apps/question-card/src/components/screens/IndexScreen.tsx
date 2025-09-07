/**
 * EasyTalking 앱의 시작 화면
 * 카테고리 선택 화면으로 자동 이동하는 스플래시 화면
 */

import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { styleExamples, themeTailwindClasses } from "@/constants/designSystem";
import { useAppState } from "@/context/AppContext";

export default function IndexScreen() {
  const router = useRouter();
  const { isInitialized, isLoading, error } = useAppState();

  useEffect(() => {
    // 앱이 초기화되면 카테고리 선택 화면으로 이동
    if (isInitialized && !isLoading && !error) {
      const timer = setTimeout(() => {
        router.replace("/category-selection");
      }, 1500); // 1.5초 후 자동 이동

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoading, error, router]);

  if (error) {
    return (
      <View
        className={`${styleExamples.layouts.screen} items-center justify-center`}
      >
        <View className="items-center px-8">
          <Text
            className={`font-semibold text-xl ${themeTailwindClasses.destructiveText} mb-4 text-center`}
          >
            앱 실행 오류
          </Text>
          <Text
            className={`text-base ${themeTailwindClasses.mutedText} text-center leading-relaxed`}
          >
            {error.message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className={`${styleExamples.layouts.screen} items-center justify-center`}
    >
      <View className="items-center px-8">
        {/* 앱 로고/타이틀 */}
        <Text className="mb-6 text-8xl">🌱</Text>
        <Text
          className={`font-bold text-3xl ${themeTailwindClasses.foreground} mb-1 text-center`}
        >
          이지토킹
        </Text>
        <Text
          className={`font-medium text-lg ${themeTailwindClasses.mutedText} mb-8 text-center`}
        >
          EasyTalking
        </Text>

        {/* 설명 */}
        <View className="mb-12 items-center">
          <Text
            className={`text-base ${themeTailwindClasses.mutedText} text-center leading-relaxed`}
          >
            자기탐구와 의미있는 대화를 위한
          </Text>
          <Text
            className={`text-base ${themeTailwindClasses.mutedText} text-center leading-relaxed`}
          >
            디지털 질문카드
          </Text>
        </View>

        {/* 로딩 표시 */}
        {isLoading && (
          <View className="mt-8">
            <Text
              className={`text-sm ${themeTailwindClasses.mutedText} text-center`}
            >
              로딩 중...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
