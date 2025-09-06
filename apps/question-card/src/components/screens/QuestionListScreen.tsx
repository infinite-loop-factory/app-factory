/**
 * 질문 목록 화면
 * 모드 4 전용 - 질문 목록 보기 및 개별 선택
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  Badge,
  Box,
  Card,
  HStack,
  Pressable,
  Text,
  VStack,
} from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";

interface QuestionListItemProps {
  question: Question;
  index: number;
  onPress: (question: Question, index: number) => void;
}

function QuestionListItem({ question, index, onPress }: QuestionListItemProps) {
  const { categories, difficulties } = useAppState();

  // 카테고리 정보 찾기
  const category = categories.find((c) => c.id === question.categoryId);
  const difficulty = difficulties.find((d) => d.id === question.difficulty);

  // 질문 내용 미리보기 (30자 제한)
  const preview =
    question.content.length > 30
      ? `${question.content.substring(0, 30)}...`
      : question.content;

  const handlePress = useCallback(() => {
    onPress(question, index);
  }, [question, index, onPress]);

  return (
    <Card className="mx-4 mb-3 border border-neutral-100 bg-white p-4">
      <Pressable onPress={handlePress}>
        <VStack space="sm">
          {/* 헤더: 카테고리 + 난이도 */}
          <HStack className="items-center justify-between">
            <HStack className="items-center" space="xs">
              {/* 카테고리 아이콘 및 이름 */}
              <Text className="text-base">{category?.icon || "📝"}</Text>
              <Text
                className="font-medium text-sm"
                style={{ color: category?.color || "#666" }}
              >
                {category?.name || question.categoryName}
              </Text>
            </HStack>

            {/* 난이도 배지 */}
            <Badge
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: `${difficulty?.color || "#999"}20` }}
              variant="solid"
            >
              <Text
                className="font-medium text-xs"
                style={{ color: difficulty?.color || "#666" }}
              >
                {difficulty?.name || question.difficulty}
              </Text>
            </Badge>
          </HStack>

          {/* 질문 미리보기 */}
          <Text className="text-base text-neutral-700 leading-relaxed">
            {preview}
          </Text>

          {/* 순서 표시 */}
          <HStack className="items-center justify-between">
            <Text className="text-neutral-500 text-xs">
              {index + 1}번째 질문
            </Text>
            <Text className="text-blue-500 text-xs">자세히 보기 →</Text>
          </HStack>
        </VStack>
      </Pressable>
    </Card>
  );
}

export default function QuestionListScreen() {
  const router = useRouter();
  const { filteredQuestions } = useAppState();
  const { setCurrentQuestionIndex } = useAppActions();

  const [questions, setQuestions] = useState<Question[]>([]);

  // 질문 데이터 초기화
  useEffect(() => {
    const questionsArray = filteredQuestions.questions || [];
    if (questionsArray.length > 0) {
      setQuestions(questionsArray);
    } else {
      // 질문이 없으면 메인으로 돌아가기
      Alert.alert(
        "질문이 없습니다",
        "선택된 조건에 맞는 질문이 없습니다. 설정을 다시 확인해주세요.",
        [
          {
            text: "설정 다시하기",
            onPress: () => router.replace("/category-selection"),
          },
        ],
      );
    }
  }, [filteredQuestions, router]);

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

  // 설정 다시하기
  const handleResetSettings = useCallback(() => {
    Alert.alert("설정 다시하기", "카테고리 선택부터 다시 시작하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "다시 시작",
        onPress: () => router.replace("/category-selection"),
      },
    ]);
  }, [router]);

  // 질문 리스트 렌더링
  const renderQuestionItem = useCallback(
    ({ item, index }: { item: Question; index: number }) => (
      <QuestionListItem
        index={index}
        onPress={handleQuestionSelect}
        question={item}
      />
    ),
    [handleQuestionSelect],
  );

  return (
    <Box className="flex-1 bg-neutral-50">
      {/* 헤더 */}
      <Box className="border-neutral-200 border-b bg-white pt-12 pb-4">
        <VStack className="px-4" space="sm">
          {/* 제목 */}
          <HStack className="items-center justify-between">
            <Text className="font-bold text-neutral-900 text-xl">
              질문 목록
            </Text>
            <Pressable onPress={handleResetSettings}>
              <Text className="text-blue-500 text-sm">설정 다시하기</Text>
            </Pressable>
          </HStack>

          {/* 총 질문 수 */}
          <Text className="text-neutral-600 text-sm">
            총 {questions.length}개의 질문이 있습니다
          </Text>

          {/* 도움말 */}
          <Text className="text-neutral-500 text-xs">
            질문을 선택하면 카드 형태로 볼 수 있습니다
          </Text>
        </VStack>
      </Box>

      {/* 질문 목록 */}
      <FlatList
        contentContainerStyle={{ paddingVertical: 16 }}
        data={questions}
        keyExtractor={(item) => `question-${item.id}`}
        ListEmptyComponent={
          <Box className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-base text-neutral-500">
              질문이 없습니다.{"\n"}
              설정을 다시 확인해주세요.
            </Text>
          </Box>
        }
        renderItem={renderQuestionItem}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 버튼 */}
      <Box className="border-neutral-200 border-t bg-white p-4">
        <Pressable
          className="rounded-xl bg-blue-500 px-6 py-3"
          onPress={handleBackToMain}
        >
          <Text className="text-center font-medium text-white">
            질문 모드 선택으로 돌아가기
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}
