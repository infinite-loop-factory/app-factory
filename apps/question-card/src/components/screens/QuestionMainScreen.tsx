/**
 * 질문 시작 화면
 * 선택한 조건 요약 및 4가지 모드 선택
 */

import type { QuestionMode } from "@/types";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAdComponent, BannerAdSize } from "@/components/ads/BannerAd";
import { FloatingBackButton } from "@/components/floating";
import { OrangeHeader } from "@/components/layout";
import { Box, Pressable, Text } from "@/components/ui";
import {
  categories,
  difficulties,
  questionModes,
  styleExamples,
  themeTailwindClasses,
} from "@/constants/designSystem";
import { useAppActions, useAppState } from "@/context/AppContext";

export default function QuestionMainScreen() {
  const router = useRouter();
  const { selection, filteredQuestions } = useAppState();
  const { setQuestionMode, filterQuestions } = useAppActions();
  const [totalQuestions, setTotalQuestions] = useState(0);

  // 컴포넌트 마운트시 질문 필터링 실행
  useEffect(() => {
    filterQuestions();
  }, [filterQuestions]);

  // filteredQuestions가 업데이트되면 총 개수 설정
  useEffect(() => {
    setTotalQuestions(filteredQuestions.totalCount);
  }, [filteredQuestions.totalCount]);

  // 선택된 카테고리 이름 가져오기
  const selectedCategoryNames = selection.selectedCategories.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return category?.name || "";
  });

  // 선택된 난이도 이름 가져오기
  const selectedDifficultyNames = selection.selectedDifficulties.map((id) => {
    const difficulty = difficulties.find((diff) => diff.id === id);
    return difficulty?.name || "";
  });

  // 모드 선택 핸들러
  const handleModeSelect = (mode: QuestionMode) => {
    // 모드 설정
    setQuestionMode(mode);

    // mode를 직접 전달하여 stale state 문제 방지
    filterQuestions(mode);

    // 모드에 따라 다른 화면으로 이동
    if (mode === 4) {
      // 모드 4: 질문 리스트 화면
      router.push("/question-list");
    } else {
      // 모드 1,2,3: 연속 카드 화면
      router.push("/continuous-card");
    }
  };

  return (
    <SafeAreaView className={styleExamples.layouts.screen}>
      {/* 플로팅 뒤로 버튼 */}
      <FloatingBackButton
        onPress={() => router.push("/difficulty-selection")}
      />

      {/* 오렌지 톤 헤더 */}
      <OrangeHeader title="질문 시작" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 선택 조건 요약 */}
        <Box className="border-orange-100 border-b p-5">
          <Text
            className={`font-semibold text-lg ${themeTailwindClasses.foreground} mb-4`}
          >
            선택한 조건
          </Text>

          <Box className="border-orange-100 border-b py-4">
            <Text
              className={`font-medium text-base ${themeTailwindClasses.mutedText} mb-2`}
            >
              카테고리
            </Text>
            <Box className="flex-row flex-wrap">
              {selectedCategoryNames.map((name) => (
                <Box className="mr-2 mb-1" key={name}>
                  <Text
                    className={`text-sm ${themeTailwindClasses.foreground} rounded-full border border-orange-200 bg-white px-3 py-1.5`}
                  >
                    {name}
                  </Text>
                </Box>
              ))}
            </Box>
            <Text className={`text-xs ${themeTailwindClasses.mutedText} mt-2`}>
              {selection.selectedCategories.length}개 선택됨
            </Text>
          </Box>

          <Box className="border-orange-100 border-b py-3">
            <Box className="flex-row items-center justify-between">
              <Text
                className={`font-medium text-base ${themeTailwindClasses.mutedText}`}
              >
                난이도
              </Text>
              <Text
                className={`text-base ${themeTailwindClasses.foreground} ml-4 text-right`}
              >
                {selectedDifficultyNames.join(", ")} (
                {selection.selectedDifficulties.length}개)
              </Text>
            </Box>
          </Box>

          <Box className="py-4">
            <Box className="flex-row items-center justify-center">
              <Box className="items-center">
                <Text
                  className={`font-medium text-sm ${themeTailwindClasses.mutedText} mb-1`}
                >
                  총 질문 개수
                </Text>
                <Box className="flex-row items-end">
                  <Text
                    className={`font-bold text-3xl ${themeTailwindClasses.foreground}`}
                  >
                    {totalQuestions}
                  </Text>
                  <Text
                    className={`font-medium text-lg ${themeTailwindClasses.mutedText} mb-1 ml-1`}
                  >
                    개
                  </Text>
                </Box>
                <Box
                  className={`h-1 w-12 rounded-full ${themeTailwindClasses.primary} mt-2 opacity-60`}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 모드 선택 */}
        <Box className="p-5">
          <Text
            className={`font-semibold text-lg ${themeTailwindClasses.foreground} mb-4`}
          >
            진행 방식 선택
          </Text>

          <Box className="gap-3">
            {questionModes.map((mode) => (
              <Pressable
                accessibilityLabel={mode.name}
                accessibilityRole="button"
                className="flex-row items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                key={mode.id}
                onPress={() => handleModeSelect(mode.id)}
              >
                {/* 아이콘과 내용 */}
                <Box className="flex-1">
                  <Box className="mb-2 flex-row items-center">
                    <Box className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                      <Text className="text-lg">{mode.icon}</Text>
                    </Box>
                    <Text
                      className={`font-semibold text-lg ${themeTailwindClasses.foreground}`}
                    >
                      {mode.name}
                    </Text>
                  </Box>
                  <Text
                    className={`text-sm ${themeTailwindClasses.mutedText} pl-13 leading-5`}
                  >
                    {mode.description}
                  </Text>
                </Box>

                {/* 화살표 아이콘 */}
                <Box className="ml-3 h-6 w-6 items-center justify-center">
                  <Text
                    className={`text-lg ${themeTailwindClasses.mutedText} opacity-60`}
                  >
                    →
                  </Text>
                </Box>
              </Pressable>
            ))}
          </Box>
        </Box>
      </ScrollView>

      {/* 하단 광고 영역 */}
      <Box className="border-gray-200 border-t bg-white px-5 py-3">
        <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </Box>

      {/* 하단 버튼 */}
      <Box className="border-gray-200 border-t bg-white px-5 py-4">
        <Pressable
          accessibilityLabel="설정 다시하기"
          accessibilityRole="button"
          className="h-12 items-center justify-center rounded-lg bg-orange-500"
          onPress={() => router.push("/difficulty-selection")}
        >
          <Text className="font-medium text-base text-white">
            설정 다시하기
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}
