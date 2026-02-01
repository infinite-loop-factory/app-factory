import { Check } from "lucide-react-native";
import { DateTime } from "luxon";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";

interface YearPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export function YearPickerSheet({
  isOpen,
  onClose,
  selectedYear,
  onSelectYear,
}: YearPickerSheetProps) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[50]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetFlatList
          data={Array.from({ length: 15 }, (_, i) => DateTime.local().year - i)}
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => {
            const year = item as number;
            return (
              <ActionsheetItem
                onPress={() => {
                  onSelectYear(year);
                  onClose();
                }}
              >
                <ActionsheetItemText
                  className={
                    selectedYear === year ? "font-bold text-primary-500" : ""
                  }
                >
                  {year}
                </ActionsheetItemText>
                {selectedYear === year && (
                  <ActionsheetIcon as={Check} className="text-primary-500" />
                )}
              </ActionsheetItem>
            );
          }}
          style={{ width: "100%" }}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
}
