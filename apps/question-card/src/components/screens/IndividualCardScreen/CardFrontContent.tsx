/**
 * 카드 앞면 콘텐츠 (질문 표시)
 */

import type { Category, Difficulty, Question } from "@/types";

import { Box, Card, HStack, Text, VStack } from "@/components/ui";

interface CardFrontContentProps {
  currentQuestion: Question;
  category: Category | undefined;
  difficulty: Difficulty | undefined;
}

export function CardFrontContent({
  currentQuestion,
  category,
  difficulty,
}: CardFrontContentProps) {
  return (
    <Card className="w-full border border-gray-100 bg-white shadow-lg">
      <VStack className="p-6" space="lg">
        {/* 카테고리 헤더 */}
        <HStack className="items-center justify-between">
          {/* 카테고리 정보 */}
          <HStack className="items-center" space="sm">
            <Text className="text-2xl">{category?.icon || "📝"}</Text>
            <VStack>
              <Text
                className="font-semibold text-base"
                style={{ color: category?.color || "#6b7280" }}
              >
                {category?.name || currentQuestion.categoryName}
              </Text>
              <Text className="text-gray-500 text-xs">
                {category?.description || ""}
              </Text>
            </VStack>
          </HStack>

          {/* 난이도 배지 */}
          <Box
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: `${difficulty?.color || "#9ca3af"}20`,
            }}
          >
            <Text
              className="font-medium text-sm"
              style={{ color: difficulty?.color || "#6b7280" }}
            >
              {difficulty?.name || currentQuestion.difficulty}
            </Text>
          </Box>
        </HStack>

        {/* 질문 내용 */}
        <Box className="py-4">
          <Text className="text-center text-gray-800 text-lg leading-relaxed">
            {currentQuestion.content}
          </Text>
        </Box>

        {/* 힌트 안내 + 질문 번호 */}
        <Box className="items-center border-gray-100 border-t pt-4">
          <Text className="text-center text-gray-400 text-sm">
            카드를 터치하면 힌트를 볼 수 있어요
          </Text>
          <Text className="mt-2 text-gray-500 text-sm">
            질문 #{currentQuestion.order}
          </Text>
        </Box>
      </VStack>
    </Card>
  );
}
