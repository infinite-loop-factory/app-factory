/**
 * 확인 Actionsheet 컴포넌트
 * 확인/취소 다이얼로그를 표시하는 재사용 가능한 Actionsheet
 */

import { Box, Text } from "@/components/ui";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";

interface ConfirmActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
}

export function ConfirmActionsheet({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  cancelText = "취소",
  onConfirm,
}: ConfirmActionsheetProps) {
  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-white shadow-2xl">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Box className="w-full px-2 py-4">
          <Text className="text-center font-semibold text-gray-900 text-lg">
            {title}
          </Text>
          <Text className="mt-2 text-center text-gray-500 text-sm">
            {description}
          </Text>
        </Box>
        <ActionsheetItem onPress={handleConfirm}>
          <ActionsheetItemText className="text-center text-orange-500">
            {confirmText}
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={onClose}>
          <ActionsheetItemText className="text-center text-gray-500">
            {cancelText}
          </ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
}
