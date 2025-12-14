import type { CourseActionType } from "@/types/option";

import { Trash2 } from "lucide-react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import { Icon } from "../ui/icon";

interface OptionsActionsheetProps {
  type?: CourseActionType;
  showActionsheet: boolean;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  onPressOption: () => void;
}

export default function OptionsActionsheet({
  type = "BLOCK",
  showActionsheet,
  setShowActionsheet,
  onPressOption,
}: OptionsActionsheetProps) {
  const handleClose = () => {
    setShowActionsheet(false);
  };

  return (
    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper className="pb-5">
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {type === "BLOCK" ? (
          <ActionsheetItem onPress={onPressOption}>
            <ActionsheetItemText className="font-medium" size="md">
              이 산책 코스 보지 않기
            </ActionsheetItemText>
          </ActionsheetItem>
        ) : (
          <ActionsheetItem onPress={onPressOption}>
            <Icon as={Trash2} className="h-4 w-4 text-error-500" />
            <ActionsheetItemText
              className="font-medium text-error-500"
              size="md"
            >
              삭제하기
            </ActionsheetItemText>
          </ActionsheetItem>
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
}
