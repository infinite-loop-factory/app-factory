/**
 * 진행률 헤더 컴포넌트
 */

import {
  Box,
  HStack,
  Pressable,
  Progress,
  Text,
  VStack,
} from "@/components/ui";

interface ProgressHeaderProps {
  currentIndex: number;
  totalCount: number;
  progressPercentage: number;
  onBackToMain: () => void;
}

export function ProgressHeader({
  currentIndex,
  totalCount,
  progressPercentage,
  onBackToMain,
}: ProgressHeaderProps) {
  return (
    <Box className="border-gray-200 border-b bg-white px-5 py-4">
      <VStack space="sm">
        {/* 진행률 표시 */}
        <VStack space="xs">
          <HStack className="items-center justify-between">
            <Text className="font-medium text-gray-700 text-sm">진행률</Text>
            <Text className="text-gray-600 text-sm">
              {currentIndex + 1} / {totalCount}
            </Text>
          </HStack>
          <Progress className="h-2" value={progressPercentage * 100} />
        </VStack>

        {/* 네비게이션 및 도움말 */}
        <HStack className="items-center justify-between">
          <Text className="text-gray-500 text-xs">
            리스트 순서대로 이동합니다
          </Text>
          <Pressable onPress={onBackToMain}>
            <Text className="text-orange-500 text-sm">메인으로</Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}
