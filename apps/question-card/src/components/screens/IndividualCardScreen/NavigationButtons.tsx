/**
 * 하단 네비게이션 버튼 컴포넌트
 */

import { Box, Pressable, Text } from "@/components/ui";

interface NavigationButtonsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationButtons({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
}: NavigationButtonsProps) {
  return (
    <Box className="flex-row gap-4 border-gray-200 border-t bg-white px-5 py-4">
      {/* 이전 버튼 */}
      <Pressable
        className={`h-12 flex-1 items-center justify-center rounded-lg border-2 border-gray-200 ${
          !canGoBack ? "opacity-50" : "bg-white"
        }`}
        disabled={!canGoBack}
        onPress={onPrevious}
      >
        <Text
          className={`font-medium text-base ${
            !canGoBack ? "text-gray-400" : "text-gray-700"
          }`}
        >
          이전
        </Text>
      </Pressable>

      {/* 다음 버튼 */}
      <Pressable
        className="h-12 flex-1 items-center justify-center rounded-lg bg-orange-500"
        onPress={onNext}
      >
        <Text className="font-medium text-base text-white">
          {canGoForward ? "다음" : "완료"}
        </Text>
      </Pressable>
    </Box>
  );
}
