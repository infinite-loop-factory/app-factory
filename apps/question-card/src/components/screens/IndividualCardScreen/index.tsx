/**
 * 개별 카드 화면
 * 모드 4 전용 - 질문 목록에서 선택한 개별 질문 표시
 * 버튼 네비게이션만 제공 (스와이프 제거)
 * 전체화면 모드: 카드 90도 회전 + 확대로 가로 보기 지원
 */

import type { Question } from "@/types";

import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, StatusBar } from "react-native";
import {
  State,
  TapGestureHandler,
  type TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Reanimated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAdComponent, BannerAdSize } from "@/components/ads/BannerAd";
import { FlipCard } from "@/components/cards";
import {
  FloatingBackButton,
  FullscreenToggleButton,
} from "@/components/floating";
import { OrangeHeader } from "@/components/layout";
import {
  CompletionSheet,
  ConfirmActionsheet,
  ErrorSheet,
} from "@/components/sheets";
import { Box, Text } from "@/components/ui";
import { useAppActions, useAppState } from "@/context/AppContext";
import { useCompletionSheet } from "@/hooks/useCompletionSheet";
import { useConfirmActionsheet } from "@/hooks/useConfirmActionsheet";
import { useErrorSheet } from "@/hooks/useErrorSheet";
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

  // Custom hooks
  const completionSheet = useCompletionSheet();
  const errorSheet = useErrorSheet();
  const backToMainActionsheet = useConfirmActionsheet();

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

  // 목록으로 돌아가기
  const handleBackToListFromCompletion = useCallback(() => {
    completionSheet.hide();
    router.back();
  }, [completionSheet.hide, router]);

  // 홈으로 이동 (새 설정)
  const handleGoToHomeFromCompletion = useCallback(() => {
    completionSheet.hide();
    router.replace("/");
  }, [completionSheet.hide, router]);

  // 다음/이전 질문 이동
  const goToNext = useCallback(() => {
    if (progress.canGoForward) {
      setIsFlipped(false);
      goToNextQuestion();
    } else {
      completionSheet.show();
    }
  }, [progress.canGoForward, goToNextQuestion, completionSheet.show]);

  const goToPrevious = useCallback(() => {
    if (progress.canGoBack) {
      setIsFlipped(false);
      goToPreviousQuestion();
    }
  }, [progress.canGoBack, goToPreviousQuestion]);

  // 네비게이션 핸들러
  const handleBackToList = useCallback(() => router.back(), [router]);

  const handleConfirmBackToMain = useCallback(() => {
    router.replace("/");
  }, [router]);

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

  // 에러 시트에서 목록으로 돌아가기
  const handleErrorGoBack = useCallback(() => {
    errorSheet.hide();
    router.back();
  }, [router, errorSheet.hide]);

  // 로딩 상태
  if (!currentQuestion) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-orange-50">
        <Text className="text-base text-neutral-500">
          질문을 불러오는 중...
        </Text>
      </SafeAreaView>
    );
  }

  const RootWrapper = isFullscreen ? Box : SafeAreaView;

  return (
    <RootWrapper className="flex-1 bg-orange-50">
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
          onBackToMain={backToMainActionsheet.open}
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

      {/* 메인으로 돌아가기 확인 Actionsheet */}
      <ConfirmActionsheet
        confirmText="처음으로"
        description="처음부터 다시 시작하시겠습니까?"
        isOpen={backToMainActionsheet.isOpen}
        onClose={backToMainActionsheet.close}
        onConfirm={handleConfirmBackToMain}
        title="메인으로 돌아가기"
      />

      {/* 완료 BottomSheet */}
      <CompletionSheet
        description="모든 질문을 확인했습니다"
        primaryAction={{
          text: "목록으로 돌아가기",
          onPress: handleBackToListFromCompletion,
        }}
        renderBackdrop={completionSheet.renderBackdrop}
        secondaryAction={{
          text: "새 설정으로 시작",
          onPress: handleGoToHomeFromCompletion,
        }}
        sheetRef={completionSheet.sheetRef}
        snapPoints={completionSheet.snapPoints}
        title="질문 탐색 완료!"
      />

      {/* 에러 BottomSheet */}
      <ErrorSheet
        buttonText="확인"
        description="질문 목록으로 돌아갑니다."
        onAction={handleErrorGoBack}
        renderBackdrop={errorSheet.renderBackdrop}
        sheetRef={errorSheet.sheetRef}
        snapPoints={errorSheet.snapPoints}
        title="질문이 없습니다"
      />
    </RootWrapper>
  );
}
