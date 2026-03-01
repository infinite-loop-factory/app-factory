/**
 * 카드 뒷면 콘텐츠 (힌트 표시)
 */

import type { Question, QuestionHint } from "@/types";

import { Box, Card, Text, VStack } from "@/components/ui";
import { getHintTypeLabel } from "@/utils/hintUtils";

interface CardBackContentProps {
  currentQuestion: Question;
}

export function CardBackContent({ currentQuestion }: CardBackContentProps) {
  const hasHints = currentQuestion?.hints && currentQuestion.hints.length > 0;

  return (
    <Card className="w-full border border-gray-100 bg-white shadow-lg">
      <VStack className="p-6" space="lg">
        {/* 힌트 헤더 */}
        <Box className="flex-row items-center justify-center border-gray-100 border-b pb-4">
          <Text className="text-lg">💡</Text>
          <Text className="ml-2 font-medium text-base text-gray-700">힌트</Text>
        </Box>

        {/* 힌트 내용 */}
        {hasHints && currentQuestion.hints ? (
          <HintsList hints={currentQuestion.hints} />
        ) : (
          <Box className="flex items-center justify-center py-8">
            <Text className="text-center text-base text-gray-500">
              이 질문에는 힌트가 없습니다
            </Text>
          </Box>
        )}

        {/* 되돌리기 안내 */}
        <Box className="border-gray-100 border-t pt-4">
          <Text className="text-center text-gray-400 text-sm">
            다시 터치하면 질문으로 돌아가요
          </Text>
        </Box>
      </VStack>
    </Card>
  );
}

/** 힌트 목록 컴포넌트 */
function HintsList({ hints }: { hints: QuestionHint[] }) {
  return (
    <>
      {hints[0] && (
        <Box className="border-gray-100 border-b py-3">
          <Text className="mb-1 font-medium text-orange-600 text-xs">
            {getHintTypeLabel(hints[0].type)}
          </Text>
          <Text className="text-base text-gray-800 leading-relaxed">
            {hints[0].content}
          </Text>
        </Box>
      )}
      {hints[1] && (
        <Box className="py-3">
          <Text className="mb-1 font-medium text-blue-600 text-xs">
            {getHintTypeLabel(hints[1].type)}
          </Text>
          <Text className="text-base text-gray-800 leading-relaxed">
            {hints[1].content}
          </Text>
        </Box>
      )}
    </>
  );
}
