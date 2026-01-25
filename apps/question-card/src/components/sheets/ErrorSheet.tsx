/**
 * 에러 BottomSheet 컴포넌트
 * 에러 상태를 표시하는 재사용 가능한 BottomSheet
 */

import type GorhomBottomSheet from "@gorhom/bottom-sheet";
import type { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { RefObject } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Box, Pressable, Text } from "@/components/ui";

interface ErrorSheetProps {
  sheetRef: RefObject<GorhomBottomSheet | null>;
  snapPoints: string[];
  renderBackdrop: (
    props: React.ComponentProps<typeof BottomSheetBackdrop>,
  ) => React.ReactElement;
  icon?: string;
  title: string;
  description: string;
  buttonText: string;
  onAction: () => void;
}

export function ErrorSheet({
  sheetRef,
  snapPoints,
  renderBackdrop,
  icon = "⚠️",
  title,
  description,
  buttonText,
  onAction,
}: ErrorSheetProps) {
  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      enablePanDownToClose={false}
      index={-1}
      ref={sheetRef}
      snapPoints={snapPoints}
    >
      <BottomSheetView className="flex-1 px-5 pb-8">
        {/* 헤더 */}
        <Box className="items-center border-gray-100 border-b pb-4">
          <Text className="text-2xl">{icon}</Text>
          <Text className="mt-2 font-semibold text-gray-900 text-lg">
            {title}
          </Text>
          <Text className="mt-1 text-center text-gray-500 text-sm">
            {description}
          </Text>
        </Box>

        {/* 버튼 */}
        <Box className="mt-4">
          <Pressable
            className="h-12 items-center justify-center rounded-lg bg-orange-500"
            onPress={onAction}
          >
            <Text className="font-medium text-base text-white">
              {buttonText}
            </Text>
          </Pressable>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
}
