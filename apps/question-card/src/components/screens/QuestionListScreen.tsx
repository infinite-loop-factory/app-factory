/**
 * 질문 목록 화면
 * 모드 4 전용 - 질문 목록 보기 및 개별 선택
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAdComponent, BannerAdSize } from "@/components/ads/BannerAd";
import { FloatingBackButton } from "@/components/floating";
import { OrangeHeader } from "@/components/layout";
import { ConfirmActionsheet, ErrorSheet } from "@/components/sheets";
import { Box, Card, HStack, Pressable, Text, VStack } from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";
import { useConfirmActionsheet } from "@/hooks/useConfirmActionsheet";
import { useErrorSheet } from "@/hooks/useErrorSheet";
import {
  getDifficultyBadgeStyle,
  getDifficultyLabel,
  getDifficultyTextStyle,
} from "@/utils/difficultyStyles";

// 리스트 아이템 타입 정의 (질문 또는 광고)
type ListItem =
  | { type: "question"; data: Question; questionIndex: number }
  | { type: "ad"; id: string };

interface QuestionListItemProps {
  question: Question;
  index: number;
  onPress: (question: Question, index: number) => void;
}

const QuestionListItem = memo(function QuestionListItem({
  question,
  index,
  onPress,
}: QuestionListItemProps) {
  const { categories, difficulties } = useAppState();

  // 카테고리 정보 찾기
  const category = categories.find((c) => c.id === question.categoryId);
  const _difficulty = difficulties.find((d) => d.id === question.difficulty);

  // 질문 내용 미리보기 (30자 제한)
  const preview =
    question.content.length > 30
      ? `${question.content.substring(0, 30)}...`
      : question.content;

  const handlePress = useCallback(() => {
    onPress(question, index);
  }, [question, index, onPress]);

  return (
    <Card className="mx-4 mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Pressable onPress={handlePress}>
        <VStack space="sm">
          {/* 헤더: 카테고리 + 난이도 */}
          <HStack className="items-center justify-between">
            <HStack className="items-center" space="xs">
              {/* 카테고리 아이콘 및 이름 */}
              <Box className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-gray-50">
                <Text className="text-sm">{category?.icon || "📝"}</Text>
              </Box>
              <Text className="font-medium text-gray-900 text-sm">
                {category?.name || question.categoryName}
              </Text>
            </HStack>

            {/* 난이도 배지 */}
            <Box
              className={`rounded-full px-2 py-1 ${getDifficultyBadgeStyle(question.difficulty)}`}
            >
              <Text
                className={`font-medium text-xs ${getDifficultyTextStyle(question.difficulty)}`}
              >
                {getDifficultyLabel(question.difficulty)}
              </Text>
            </Box>
          </HStack>

          {/* 질문 미리보기 */}
          <Text className="text-base text-gray-700 leading-relaxed">
            {preview}
          </Text>

          {/* 순서 표시 */}
          <HStack className="items-center justify-between">
            <Text className="text-gray-500 text-xs">{index + 1}번째 질문</Text>
            <Text className="text-orange-500 text-xs">자세히 보기 →</Text>
          </HStack>
        </VStack>
      </Pressable>
    </Card>
  );
});

export default function QuestionListScreen() {
  const router = useRouter();
  const { filteredQuestions } = useAppState();
  const { setCurrentQuestionIndex } = useAppActions();

  const [questions, setQuestions] = useState<Question[]>([]);

  // Custom hooks
  const errorSheet = useErrorSheet();
  const resetActionsheet = useConfirmActionsheet();

  // 질문 데이터 초기화
  useEffect(() => {
    const questionsArray = filteredQuestions.questions || [];
    if (questionsArray.length > 0) {
      setQuestions(questionsArray);
      errorSheet.setHasError(false);
    } else {
      // 질문이 없으면 에러 시트 표시
      errorSheet.setHasError(true);
    }
  }, [filteredQuestions, errorSheet.setHasError]);

  // 에러 시트에서 설정 다시하기
  const handleErrorGoToSettings = useCallback(() => {
    errorSheet.hide();
    router.replace("/");
  }, [router, errorSheet.hide]);

  // 8개 항목마다 광고를 삽입한 리스트 생성
  const listItemsWithAds = useMemo(() => {
    const items: ListItem[] = [];
    const AD_INTERVAL = 20; // 8개 질문마다 광고 삽입

    questions.forEach((question, index) => {
      // 질문 항목 추가
      items.push({
        type: "question",
        data: question,
        questionIndex: index,
      });

      // 8개마다 광고 삽입 (마지막 항목 이후에는 광고 추가 안함)
      if ((index + 1) % AD_INTERVAL === 0 && index < questions.length - 1) {
        items.push({
          type: "ad",
          id: `ad-${index}`,
        });
      }
    });

    return items;
  }, [questions]);

  // 질문 선택 처리
  const handleQuestionSelect = useCallback(
    (_question: Question, index: number) => {
      // Context에 현재 질문 인덱스 설정
      setCurrentQuestionIndex(index);

      // 개별 카드 화면으로 이동
      router.push("/individual-card");
    },
    [setCurrentQuestionIndex, router],
  );

  // 메인으로 돌아가기
  const handleBackToMain = useCallback(() => {
    router.back();
  }, [router]);

  // 설정 다시하기 확인
  const handleConfirmReset = useCallback(() => {
    router.replace("/");
  }, [router]);

  // 리스트 아이템 렌더링 (질문 또는 광고)
  const renderListItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "ad") {
        // 인라인 광고 렌더링
        return (
          <Box className="my-4 px-4">
            <BannerAdComponent size={BannerAdSize.LARGE_BANNER} />
          </Box>
        );
      }

      // 질문 항목 렌더링
      return (
        <QuestionListItem
          index={item.questionIndex}
          onPress={handleQuestionSelect}
          question={item.data}
        />
      );
    },
    [handleQuestionSelect],
  );

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* 플로팅 뒤로 버튼 */}
      <FloatingBackButton onPress={handleBackToMain} />

      {/* 오렌지 톤 헤더 */}
      <OrangeHeader title="질문 목록" />

      {/* 상단 요약 */}
      <Box className="border-gray-200 border-b bg-white px-5 py-4">
        <VStack space="sm">
          <HStack className="items-center justify-between">
            <Text className="font-medium text-base text-gray-900">
              총 {questions.length}개 질문
            </Text>
            <Pressable onPress={resetActionsheet.open}>
              <Text className="text-orange-500 text-sm">설정 다시하기</Text>
            </Pressable>
          </HStack>

          {/* 총 질문 수 - Modern Refined 스타일 */}
          <Box className="items-center">
            <Text className="mb-1 text-gray-600 text-sm">총 질문 개수</Text>
            <HStack className="items-end">
              <Text className="font-bold text-2xl text-gray-900">
                {questions.length}
              </Text>
              <Text className="mb-1 ml-1 font-medium text-gray-400 text-lg">
                개
              </Text>
            </HStack>
            <Box className="mt-1 h-1 w-8 rounded-full bg-orange-500 opacity-60" />
          </Box>

          {/* 도움말 */}
          <Text className="text-center text-gray-500 text-xs">
            질문을 선택하면 카드 형태로 볼 수 있습니다
          </Text>
        </VStack>
      </Box>

      {/* 질문 목록 (인라인 광고 포함) */}
      <FlatList
        contentContainerStyle={{ paddingVertical: 16 }}
        data={listItemsWithAds}
        initialNumToRender={10}
        keyExtractor={(item) =>
          item.type === "question" ? `question-${item.data.id}` : item.id
        }
        ListEmptyComponent={
          <Box className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-base text-gray-500">
              질문이 없습니다.{"\n"}
              설정을 다시 확인해주세요.
            </Text>
          </Box>
        }
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        renderItem={renderListItem}
        showsVerticalScrollIndicator={false}
        windowSize={7}
      />

      {/* 하단 광고 영역 */}
      <Box className="border-gray-200 border-t bg-white px-5 py-3">
        <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </Box>

      {/* 하단 버튼 */}
      <Box className="border-gray-200 border-t bg-white px-5 py-4">
        <Pressable
          className="h-12 items-center justify-center rounded-lg bg-orange-500"
          onPress={handleBackToMain}
        >
          <Text className="font-medium text-base text-white">
            질문 모드 선택으로 돌아가기
          </Text>
        </Pressable>
      </Box>

      {/* 설정 다시하기 Actionsheet */}
      <ConfirmActionsheet
        confirmText="다시 시작"
        description="카테고리 선택부터 다시 시작하시겠습니까?"
        isOpen={resetActionsheet.isOpen}
        onClose={resetActionsheet.close}
        onConfirm={handleConfirmReset}
        title="설정 다시하기"
      />

      {/* 에러 BottomSheet */}
      <ErrorSheet
        buttonText="설정 다시하기"
        description={
          "선택된 조건에 맞는 질문이 없습니다.\n설정을 다시 확인해주세요."
        }
        onAction={handleErrorGoToSettings}
        renderBackdrop={errorSheet.renderBackdrop}
        sheetRef={errorSheet.sheetRef}
        snapPoints={errorSheet.snapPoints}
        title="질문이 없습니다"
      />
    </SafeAreaView>
  );
}
