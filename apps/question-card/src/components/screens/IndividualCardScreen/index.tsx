/**
 * 개별 카드 화면
 * 모드 4 전용 - 질문 목록에서 선택한 개별 질문 표시
 * 버튼 네비게이션만 제공 (스와이프 제거)
 * 전체화면 모드: 카드 90도 회전 + 확대로 가로 보기 지원
 */

import type { Question } from "@/types";

import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StatusBar } from "react-native";
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
  Pressable,
  Text,
} from "@/components/ui";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
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
  const [showBackToMainSheet, setShowBackToMainSheet] = useState(false);

  // 완료 시트 ref 및 snap points
  const completionSheetRef = useRef<GorhomBottomSheet>(null);
  const completionSnapPoints = useMemo(() => ["35%"], []);

  // 에러 시트 ref 및 snap points
  const errorSheetRef = useRef<GorhomBottomSheet>(null);
  const errorSnapPoints = useMemo(() => ["35%"], []);
  const [hasError, setHasError] = useState(false);

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

  // 완료 시트 표시
  const showCompletionSheet = useCallback(() => {
    completionSheetRef.current?.snapToIndex(0);
  }, []);

  // 완료 시트 닫기
  const hideCompletionSheet = useCallback(() => {
    completionSheetRef.current?.close();
  }, []);

  // 목록으로 돌아가기
  const handleBackToListFromCompletion = useCallback(() => {
    hideCompletionSheet();
    router.back();
  }, [hideCompletionSheet, router]);

  // 홈으로 이동 (새 설정)
  const handleGoToHomeFromCompletion = useCallback(() => {
    hideCompletionSheet();
    router.replace("/");
  }, [hideCompletionSheet, router]);

  // 완료 시트 백드롭 렌더링
  const renderCompletionBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  // 다음/이전 질문 이동
  const goToNext = useCallback(() => {
    if (progress.canGoForward) {
      setIsFlipped(false);
      goToNextQuestion();
    } else {
      showCompletionSheet();
    }
  }, [progress.canGoForward, goToNextQuestion, showCompletionSheet]);

  const goToPrevious = useCallback(() => {
    if (progress.canGoBack) {
      setIsFlipped(false);
      goToPreviousQuestion();
    }
  }, [progress.canGoBack, goToPreviousQuestion]);

  // 네비게이션 핸들러
  const handleBackToList = useCallback(() => router.back(), [router]);

  const handleBackToMain = useCallback(() => {
    setShowBackToMainSheet(true);
  }, []);

  const handleCloseBackToMainSheet = useCallback(() => {
    setShowBackToMainSheet(false);
  }, []);

  const handleConfirmBackToMain = useCallback(() => {
    setShowBackToMainSheet(false);
    router.replace("/");
  }, [router]);

  // 질문 데이터 초기화
  useEffect(() => {
    const questionsArray = filteredQuestions.questions || [];
    if (questionsArray.length > 0) {
      setQuestions(questionsArray);
      setHasError(false);
    } else {
      // 질문이 없으면 에러 시트 표시
      setHasError(true);
    }
  }, [filteredQuestions]);

  // 에러 시트 표시 (hasError가 true일 때)
  useEffect(() => {
    if (hasError) {
      // 약간의 딜레이 후 시트 열기 (컴포넌트 마운트 후)
      const timer = setTimeout(() => {
        errorSheetRef.current?.snapToIndex(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  // 에러 시트에서 목록으로 돌아가기
  const handleErrorGoBack = useCallback(() => {
    errorSheetRef.current?.close();
    router.back();
  }, [router]);

  // 에러 시트 백드롭 렌더링
  const renderErrorBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="none"
      />
    ),
    [],
  );

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

      {/* 메인으로 돌아가기 확인 Actionsheet */}
      <Actionsheet
        isOpen={showBackToMainSheet}
        onClose={handleCloseBackToMainSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <Box className="w-full px-2 py-4">
            <Text className="text-center font-semibold text-gray-900 text-lg">
              메인으로 돌아가기
            </Text>
            <Text className="mt-2 text-center text-gray-500 text-sm">
              처음부터 다시 시작하시겠습니까?
            </Text>
          </Box>
          <ActionsheetItem onPress={handleConfirmBackToMain}>
            <ActionsheetItemText className="text-center text-orange-500">
              처음으로
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleCloseBackToMainSheet}>
            <ActionsheetItemText className="text-center text-gray-500">
              취소
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>

      {/* 완료 BottomSheet */}
      <GorhomBottomSheet
        backdropComponent={renderCompletionBackdrop}
        enablePanDownToClose
        index={-1}
        ref={completionSheetRef}
        snapPoints={completionSnapPoints}
      >
        <BottomSheetView className="flex-1 px-5 pb-8">
          {/* 헤더 */}
          <Box className="items-center border-gray-100 border-b pb-4">
            <Text className="text-2xl">🎉</Text>
            <Text className="mt-2 font-semibold text-gray-900 text-lg">
              질문 탐색 완료!
            </Text>
            <Text className="mt-1 text-center text-gray-500 text-sm">
              모든 질문을 확인했습니다
            </Text>
          </Box>

          {/* 버튼들 */}
          <Box className="mt-4 gap-3">
            <Pressable
              className="h-12 items-center justify-center rounded-lg bg-orange-500"
              onPress={handleBackToListFromCompletion}
            >
              <Text className="font-medium text-base text-white">
                목록으로 돌아가기
              </Text>
            </Pressable>
            <Pressable
              className="h-12 items-center justify-center rounded-lg border-2 border-gray-200 bg-white"
              onPress={handleGoToHomeFromCompletion}
            >
              <Text className="font-medium text-base text-gray-700">
                새 설정으로 시작
              </Text>
            </Pressable>
          </Box>
        </BottomSheetView>
      </GorhomBottomSheet>

      {/* 에러 BottomSheet */}
      <GorhomBottomSheet
        backdropComponent={renderErrorBackdrop}
        enablePanDownToClose={false}
        index={-1}
        ref={errorSheetRef}
        snapPoints={errorSnapPoints}
      >
        <BottomSheetView className="flex-1 px-5 pb-8">
          {/* 헤더 */}
          <Box className="items-center border-gray-100 border-b pb-4">
            <Text className="text-2xl">⚠️</Text>
            <Text className="mt-2 font-semibold text-gray-900 text-lg">
              질문이 없습니다
            </Text>
            <Text className="mt-1 text-center text-gray-500 text-sm">
              질문 목록으로 돌아갑니다.
            </Text>
          </Box>

          {/* 버튼 */}
          <Box className="mt-4">
            <Pressable
              className="h-12 items-center justify-center rounded-lg bg-orange-500"
              onPress={handleErrorGoBack}
            >
              <Text className="font-medium text-base text-white">확인</Text>
            </Pressable>
          </Box>
        </BottomSheetView>
      </GorhomBottomSheet>
    </Box>
  );
}
