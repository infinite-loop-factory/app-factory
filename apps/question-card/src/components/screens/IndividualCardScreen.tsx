/**
 * 개별 카드 화면
 * 모드 4 전용 - 질문 목록에서 선택한 개별 질문 표시
 * 버튼 네비게이션만 제공 (스와이프 제거)
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, StatusBar } from "react-native";
import { BannerAdComponent, BannerAdSize } from "@/components/ads/BannerAd";
import {
  Box,
  Card,
  FloatingBackButton,
  HStack,
  OrangeHeader,
  Pressable,
  Progress,
  Text,
  VStack,
} from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";

export default function IndividualCardScreen() {
  const router = useRouter();
  const { filteredQuestions, progress, categories, difficulties } =
    useAppState();
  const { goToNextQuestion, goToPreviousQuestion } = useAppActions();

  const [_questions, setQuestions] = useState<Question[]>([]);

  // Context에서 관리하는 현재 인덱스와 질문 사용
  const currentIndex = progress.currentIndex;
  const currentQuestion = progress.currentQuestion;

  // 컴포넌트 마운트시 질문 데이터 설정
  useEffect(() => {
    const questionsArray = filteredQuestions.questions || [];
    if (questionsArray.length > 0) {
      setQuestions(questionsArray);
    } else {
      // 질문이 없으면 목록으로 돌아가기
      Alert.alert("질문이 없습니다", "질문 목록으로 돌아갑니다.", [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]);
    }
  }, [filteredQuestions, router]);

  // 완료 알림 표시
  const showCompletionAlert = useCallback(() => {
    Alert.alert(
      "질문 탐색 완료!",
      "모든 질문을 확인했습니다. 어떻게 하시겠습니까?",
      [
        {
          text: "질문 목록으로",
          onPress: () => router.back(),
        },
        {
          text: "메인으로",
          onPress: () => router.push("/question-main"),
          style: "cancel",
        },
      ],
      { cancelable: false },
    );
  }, [router]);

  // 진행률 계산
  const progressPercentage =
    filteredQuestions.totalCount > 0
      ? (currentIndex + 1) / filteredQuestions.totalCount
      : 0;

  // 다음 질문으로 이동
  const goToNext = useCallback(() => {
    if (progress.canGoForward) {
      goToNextQuestion();
    } else {
      showCompletionAlert();
    }
  }, [progress.canGoForward, goToNextQuestion, showCompletionAlert]);

  // 이전 질문으로 이동
  const goToPrevious = useCallback(() => {
    if (progress.canGoBack) {
      goToPreviousQuestion();
    }
  }, [progress.canGoBack, goToPreviousQuestion]);

  // 질문 목록으로 돌아가기
  const handleBackToList = useCallback(() => {
    router.back();
  }, [router]);

  // 메인으로 돌아가기
  const handleBackToMain = useCallback(() => {
    Alert.alert(
      "메인으로 돌아가기",
      "질문 모드 선택 화면으로 돌아가시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "메인으로",
          onPress: () => router.push("/question-main"),
        },
      ],
    );
  }, [router]);

  // 현재 질문이 없으면 로딩 화면
  if (!currentQuestion) {
    return (
      <Box className="flex-1 items-center justify-center bg-orange-50">
        <Text className="text-base text-neutral-500">
          질문을 불러오는 중...
        </Text>
      </Box>
    );
  }

  // 카테고리와 난이도 정보 찾기
  const category = categories.find((c) => c.id === currentQuestion.categoryId);
  const difficulty = difficulties.find(
    (d) => d.id === currentQuestion.difficulty,
  );

  return (
    <Box className="flex-1 bg-orange-50">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* 플로팅 뒤로 버튼 */}
      <FloatingBackButton onPress={handleBackToList} />

      {/* 오렌지 톤 헤더 */}
      <OrangeHeader title="질문 카드" />

      {/* 진행률 및 네비게이션 */}
      <Box className="border-gray-200 border-b bg-white px-5 py-4">
        <VStack space="sm">
          {/* 진행률 표시 */}
          <VStack space="xs">
            <HStack className="items-center justify-between">
              <Text className="font-medium text-gray-700 text-sm">진행률</Text>
              <Text className="text-gray-600 text-sm">
                {currentIndex + 1} / {filteredQuestions.totalCount}
              </Text>
            </HStack>
            <Progress className="h-2" value={progressPercentage * 100} />
          </VStack>

          {/* 네비게이션 및 도움말 */}
          <HStack className="items-center justify-between">
            <Text className="text-gray-500 text-xs">
              리스트 순서대로 이동합니다
            </Text>
            <Pressable onPress={handleBackToMain}>
              <Text className="text-orange-500 text-sm">메인으로</Text>
            </Pressable>
          </HStack>
        </VStack>
      </Box>

      {/* 질문 카드 */}
      <Box className="flex-1 items-center justify-center px-4">
        <Card className="w-full border border-neutral-100 bg-white shadow-lg">
          <VStack className="p-6" space="lg">
            {/* 카테고리 헤더 */}
            <HStack className="items-center justify-between">
              {/* 카테고리 정보 */}
              <HStack className="items-center" space="sm">
                <Text className="text-2xl">{category?.icon || "📝"}</Text>
                <VStack>
                  <Text
                    className="font-semibold text-base"
                    style={{ color: category?.color || "#666" }}
                  >
                    {category?.name || currentQuestion.categoryName}
                  </Text>
                  <Text className="text-neutral-500 text-xs">
                    {category?.description || ""}
                  </Text>
                </VStack>
              </HStack>

              {/* 난이도 배지 */}
              <Box
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: `${difficulty?.color || "#999"}20` }}
              >
                <Text
                  className="font-medium text-sm"
                  style={{ color: difficulty?.color || "#666" }}
                >
                  {difficulty?.name || currentQuestion.difficulty}
                </Text>
              </Box>
            </HStack>

            {/* 질문 내용 */}
            <Box className="py-4">
              <Text className="text-center text-lg text-neutral-800 leading-relaxed">
                {currentQuestion.content}
              </Text>
            </Box>

            {/* 질문 번호 */}
            <Box className="items-center">
              <Text className="text-neutral-500 text-sm">
                질문 #{currentQuestion.order}
              </Text>
            </Box>
          </VStack>
        </Card>
      </Box>

      {/* 하단 광고 영역 */}
      <Box className="border-gray-200 border-t bg-white px-5 py-3">
        <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </Box>

      {/* 하단 네비게이션 버튼 */}
      <Box className="flex-row gap-4 border-gray-200 border-t bg-white px-5 py-4">
        {/* 이전 버튼 */}
        <Pressable
          className={`h-12 flex-1 items-center justify-center rounded-lg border-2 border-gray-200 ${
            !progress.canGoBack ? "opacity-50" : "bg-white"
          }`}
          disabled={!progress.canGoBack}
          onPress={goToPrevious}
        >
          <Text
            className={`font-medium text-base ${
              !progress.canGoBack ? "text-gray-400" : "text-gray-700"
            }`}
          >
            이전
          </Text>
        </Pressable>

        {/* 다음 버튼 */}
        <Pressable
          className={`h-12 flex-1 items-center justify-center rounded-lg ${
            progress.canGoForward ? "bg-orange-500" : "bg-green-500"
          }`}
          onPress={goToNext}
        >
          <Text className="font-medium text-base text-white">
            {progress.canGoForward ? "다음" : "완료"}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}
