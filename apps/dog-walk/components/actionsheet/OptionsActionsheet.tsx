import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";

interface OptionsActionsheetProps {
  showActionsheet: boolean;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  onPressBlock: () => void;
}

export default function OptionsActionsheet({
  showActionsheet,
  setShowActionsheet,
  onPressBlock,
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
        <ActionsheetItem onPress={onPressBlock}>
          <ActionsheetItemText className="font-medium" size="md">
            이 산책 코스 보지 않기
          </ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
}
