/**
 * 개별 카드 화면
 * 모드 4 전용 - 질문 목록에서 선택한 개별 질문 표시
 * 버튼 네비게이션만 제공 (스와이프 제거)
 * 전체화면 모드: 카드 90도 회전 + 확대로 가로 보기 지원
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, StatusBar } from "react-native";
import {
  State,
  TapGestureHandler,
  type TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Reanimated from "react-native-reanimated";
import { BannerAdComponent, BannerAdSize } from "@/components/ads/BannerAd";
import {
  Box,
  FlipCard,
  FloatingBackButton,
  FullscreenToggleButton,
  OrangeHeader,
  Text,
} from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";
import { useFullscreenMode } from "@/hooks/useFullscreenMode";
import { CardBackContent } from "./CardBackContent";
import { CardFrontContent } from "./CardFrontContent";
import { NavigationButtons } from "./NavigationButtons";
import { ProgressHeader } from "./ProgressHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function IndividualCardScreen() {
  const router = useRouter();
  const { filteredQuestions, progress, categories, difficulties } =
    useAppState();
  const { goToNextQuestion, goToPreviousQuestion } = useAppActions();

  const [_questions, setQuestions] = useState<Question[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  const { isFullscreen, toggleFullscreen, fullscreenAnimatedStyle } =
    useFullscreenMode({ cardWidth: SCREEN_WIDTH - 32 });

  const currentIndex = progress.currentIndex;
  const currentQuestion = progress.currentQuestion;

  const category = currentQuestion
    ? categories.find((c) => c.id === currentQuestion.categoryId)
    : undefined;
  const difficulty = currentQuestion
    ? difficulties.find((d) => d.id === currentQuestion.difficulty)
    : undefined;

  const progressPercentage =
    filteredQuestions.totalCount > 0
      ? (currentIndex + 1) / filteredQuestions.totalCount
      : 0;

  // 카드 뒤집기 토글
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // 탭 제스처 핸들러
  const onTapStateChange = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        handleFlip();
      }
    },
    [handleFlip],
  );

  // 완료 알림
  const showCompletionAlert = useCallback(() => {
    Alert.alert(
      "질문 탐색 완료!",
      "모든 질문을 확인했습니다. 어떻게 하시겠습니까?",
      [
        { text: "질문 목록으로", onPress: () => router.back() },
        {
          text: "메인으로",
          onPress: () => router.push("/question-main"),
          style: "cancel",
        },
      ],
      { cancelable: false },
    );
  }, [router]);

  // 다음/이전 질문 이동
  const goToNext = useCallback(() => {
    if (progress.canGoForward) {
      setIsFlipped(false);
      goToNextQuestion();
    } else {
      showCompletionAlert();
    }
  }, [progress.canGoForward, goToNextQuestion, showCompletionAlert]);

  const goToPrevious = useCallback(() => {
    if (progress.canGoBack) {
      setIsFlipped(false);
      goToPreviousQuestion();
    }
  }, [progress.canGoBack, goToPreviousQuestion]);

  // 네비게이션 핸들러
  const handleBackToList = useCallback(() => router.back(), [router]);

  const handleBackToMain = useCallback(() => {
    Alert.alert(
      "메인으로 돌아가기",
      "질문 모드 선택 화면으로 돌아가시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "메인으로", onPress: () => router.push("/question-main") },
      ],
    );
  }, [router]);

  // 질문 데이터 초기화
  useEffect(() => {
    const questionsArray = filteredQuestions.questions || [];
    if (questionsArray.length > 0) {
      setQuestions(questionsArray);
    } else {
      Alert.alert("질문이 없습니다", "질문 목록으로 돌아갑니다.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    }
  }, [filteredQuestions, router]);

  // 로딩 상태
  if (!currentQuestion) {
    return (
      <Box className="flex-1 items-center justify-center bg-orange-50">
        <Text className="text-base text-neutral-500">
          질문을 불러오는 중...
        </Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-orange-50">
      {!isFullscreen && (
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      )}
      {!isFullscreen && <FloatingBackButton onPress={handleBackToList} />}
      <FullscreenToggleButton
        isFullscreen={isFullscreen}
        onPress={toggleFullscreen}
      />
      {!isFullscreen && <OrangeHeader title="질문 카드" />}
      {!isFullscreen && (
        <ProgressHeader
          currentIndex={currentIndex}
          onBackToMain={handleBackToMain}
          progressPercentage={progressPercentage}
          totalCount={filteredQuestions.totalCount}
        />
      )}

      {/* 질문 카드 */}
      <Box
        className={`flex-1 items-center justify-center ${isFullscreen ? "" : "px-4"}`}
      >
        <Reanimated.View style={fullscreenAnimatedStyle}>
          <TapGestureHandler onHandlerStateChange={onTapStateChange}>
            <Reanimated.View>
              <FlipCard
                backContent={
                  <CardBackContent currentQuestion={currentQuestion} />
                }
                cardWidth={SCREEN_WIDTH - 32}
                frontContent={
                  <CardFrontContent
                    category={category}
                    currentQuestion={currentQuestion}
                    difficulty={difficulty}
                  />
                }
                isFlipped={isFlipped}
                key={currentQuestion.id}
              />
            </Reanimated.View>
          </TapGestureHandler>
        </Reanimated.View>
      </Box>

      {!isFullscreen && (
        <Box className="border-gray-200 border-t bg-white px-5 py-3">
          <BannerAdComponent size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
        </Box>
      )}
      {!isFullscreen && (
        <NavigationButtons
          canGoBack={progress.canGoBack}
          canGoForward={progress.canGoForward}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />
      )}
    </Box>
  );
}
