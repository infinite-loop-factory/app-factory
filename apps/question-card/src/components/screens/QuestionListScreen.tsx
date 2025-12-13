/**
 * 질문 목록 화면
 * 모드 4 전용 - 질문 목록 보기 및 개별 선택
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList } from "react-native";
import { BannerAdSize } from "react-native-google-mobile-ads";
import { BannerAdComponent } from "@/components/ads/BannerAd";
import {
  Box,
  Card,
  FloatingBackButton,
  HStack,
  OrangeHeader,
  Pressable,
  Text,
  VStack,
} from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";

// 리스트 아이템 타입 정의 (질문 또는 광고)
type ListItem =
  | { type: "question"; data: Question; questionIndex: number }
  | { type: "ad"; id: string };

interface QuestionListItemProps {
  question: Question;
  index: number;
  onPress: (question: Question, index: number) => void;
}

function QuestionListItem({ question, index, onPress }: QuestionListItemProps) {
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

  // 8개 항목마다 광고를 삽입한 리스트 생성
  const listItemsWithAds = useMemo(() => {
    const items: ListItem[] = [];
    const AD_INTERVAL = 8; // 8개 질문마다 광고 삽입

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
    <Box className="flex-1 bg-orange-50">
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
            <Pressable onPress={handleResetSettings}>
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
        renderItem={renderListItem}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 광고 영역 */}
      <Box className="border-gray-200 border-t bg-white px-5 py-3">
        <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </Box>

      {/* 하단 버튼 */}
      <Box className="border-gray-200 border-t bg-white p-5">
        <Pressable
          className="h-12 items-center justify-center rounded-lg bg-orange-500 px-6 py-3"
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

// 난이도별 뱃지 스타일 - Modern Refined
function getDifficultyBadgeStyle(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-50 border border-green-200";
    case "medium":
      return "bg-yellow-50 border border-yellow-200";
    case "hard":
      return "bg-red-50 border border-red-200";
    default:
      return "bg-gray-50 border border-gray-200";
  }
}

function getDifficultyTextStyle(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "text-green-700";
    case "medium":
      return "text-yellow-700";
    case "hard":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "쉬움";
    case "medium":
      return "보통";
    case "hard":
      return "어려움";
    default:
      return "기본";
  }
}
