import { DateTime } from "luxon";
import { useState } from "react";
import { Platform } from "react-native";
import {
  CrossPlatformDateTimePicker,
  openAndroidDateTimePicker,
} from "@/components/cross-platform-date-time-picker";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import i18n from "@/lib/i18n";

interface MapDateRangePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: DateTime | null, end: DateTime | null) => void;
  initialStartDate: DateTime | null;
  initialEndDate: DateTime | null;
}

export function MapDateRangePickerSheet({
  isOpen,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
}: MapDateRangePickerSheetProps) {
  const [startDate, setStartDate] = useState<DateTime | null>(initialStartDate);
  const [endDate, setEndDate] = useState<DateTime | null>(initialEndDate);

  // Picker state
  const [pickerMode, setPickerMode] = useState<"start" | "end" | null>(null);

  // Sync state when opening
  // (Optional: useEffect to sync if needed, but initial props usually suffice if component remounts or key changes)

  const handleApply = () => {
    onApply(startDate, endDate);
    onClose();
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const updateStartDate = (dt: DateTime) => {
    setStartDate(dt);
    if (endDate && endDate < dt) {
      setEndDate(null);
    }
  };

  const updateEndDate = (dt: DateTime) => {
    setEndDate(dt);
    if (startDate && startDate > dt) {
      setStartDate(dt);
    }
  };

  const handleDateChange = (event: { type: string }, date?: Date) => {
    if (Platform.OS === "android") {
      // For Android, we close picker mode immediately after selection
      setPickerMode(null);
    }

    if (event.type === "dismissed") {
      setPickerMode(null);
      return;
    }

    if (date) {
      const dt = DateTime.fromJSDate(date);
      if (pickerMode === "start") {
        updateStartDate(dt);
      } else if (pickerMode === "end") {
        updateEndDate(dt);
      }
    }
  };

  const openPicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    if (Platform.OS === "android") {
      openAndroidDateTimePicker(
        (mode === "start" ? startDate : endDate)?.toJSDate() || new Date(),
        handleDateChange,
        "date",
      );
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[50]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <Box className="w-full px-4 pt-2 pb-6">
          <Box className="mb-6 flex-row items-center justify-between">
            <Heading size="md">{i18n.t("map.date-range-picker.title")}</Heading>
            <Button onPress={handleReset} size="sm" variant="link">
              <ButtonText className="text-secondary-500">
                {i18n.t("map.date-range-picker.reset")}
              </ButtonText>
            </Button>
          </Box>

          <Box className="mb-6 flex-col gap-4">
            {/* Start Date */}
            <Box className="flex-col gap-2">
              <Text className="font-medium text-sm text-typography-500">
                {i18n.t("map.date-range-picker.start-date")}
              </Text>
              <Button
                action={pickerMode === "start" ? "primary" : "secondary"}
                className="h-12 items-center justify-start"
                onPress={() => openPicker("start")}
                variant="outline"
              >
                <ButtonText
                  className={
                    !startDate ? "text-typography-400" : "text-typography-900"
                  }
                >
                  {startDate ? startDate.toFormat("yyyy-MM-dd") : "YYYY-MM-DD"}
                </ButtonText>
              </Button>
            </Box>

            {/* End Date */}
            <Box className="flex-col gap-2">
              <Text className="font-medium text-sm text-typography-500">
                {i18n.t("map.date-range-picker.end-date")}
              </Text>
              <Button
                action={pickerMode === "end" ? "primary" : "secondary"}
                className="h-12 items-center justify-start"
                onPress={() => openPicker("end")}
                variant="outline"
              >
                <ButtonText
                  className={
                    !endDate ? "text-typography-400" : "text-typography-900"
                  }
                >
                  {endDate ? endDate.toFormat("yyyy-MM-dd") : "YYYY-MM-DD"}
                </ButtonText>
              </Button>
            </Box>
          </Box>

          <Button
            isDisabled={!(startDate && endDate)}
            onPress={handleApply}
            size="lg"
          >
            <ButtonText>{i18n.t("map.date-range-picker.apply")}</ButtonText>
          </Button>

          {/* iOS Date Picker Inline Rendering when active */}
          {Platform.OS === "ios" && pickerMode && (
            <Box className="mt-4 items-center">
              <CrossPlatformDateTimePicker
                isOpen={true}
                mode="date"
                onChange={handleDateChange}
                value={
                  (pickerMode === "start" ? startDate : endDate)?.toJSDate() ||
                  new Date()
                }
              />
              <Button
                className="mt-2"
                onPress={() => setPickerMode(null)}
                variant="link"
              >
                <ButtonText>{i18n.t("common.done")}</ButtonText>
              </Button>
            </Box>
          )}
        </Box>
      </ActionsheetContent>
    </Actionsheet>
  );
}
