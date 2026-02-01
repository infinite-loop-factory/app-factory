import { cn } from "@infinite-loop-factory/common";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
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
  // Step based UX: 'start' -> 'end'
  const [step, setStep] = useState<"start" | "end">("start");

  const [startDate, setStartDate] = useState<DateTime | null>(initialStartDate);
  const [endDate, setEndDate] = useState<DateTime | null>(initialEndDate);

  // Reset to 'start' when opened
  useEffect(() => {
    if (isOpen) {
      setStep("start");
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
    }
  }, [isOpen, initialStartDate, initialEndDate]);

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setStep("start");
  };

  const onStartDateSelected = (dt: DateTime) => {
    setStartDate(dt);
    // If end date exists and is invalid, clear it
    if (endDate && endDate < dt) {
      setEndDate(null);
    }
    // Move to next step automatically
    setStep("end");
  };

  const onEndDateSelected = (dt: DateTime) => {
    // Validation
    if (startDate && dt < startDate) {
      Alert.alert(
        i18n.t("map.date-range-picker.alert.title"),
        i18n.t("map.date-range-picker.alert.message"),
      );
      // Don't update endDate if invalid? Or update and let them fix?
      // Better to block invalid selection for atomic flow.
      return;
    }

    setEndDate(dt);

    // Valid end date selected -> Apply and Close!
    onApply(startDate, dt);
    onClose();
  };

  const handleDateChange = (event: { type: string }, date?: Date) => {
    // Android dismiss handling
    if (Platform.OS === "android" && event.type === "dismissed") {
      return;
    }

    if (!date) return;

    const dt = DateTime.fromJSDate(date);

    if (step === "start") {
      onStartDateSelected(dt);
    } else if (step === "end") {
      onEndDateSelected(dt);
    }
  };

  const openAndroidPicker = (mode: "start" | "end") => {
    const value =
      (mode === "start" ? startDate : endDate)?.toJSDate() || new Date();
    openAndroidDateTimePicker(
      value,
      (_: unknown, d?: Date) => {
        if (!d) return;
        const dt = DateTime.fromJSDate(d);
        if (mode === "start") {
          onStartDateSelected(dt);
        } else {
          onEndDateSelected(dt);
        }
      },
      "date",
    );
  };

  // Determine which date to show in picker
  // If step is start, show startDate or today
  // If step is end, show endDate. If no endDate, show startDate (for easier range picking) or today.
  const pickerValue =
    step === "start"
      ? startDate?.toJSDate() || new Date()
      : endDate?.toJSDate() || startDate?.toJSDate() || new Date();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[65, 80]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <Box className="w-full flex-1 px-4 pt-2 pb-6">
          <Box className="mb-6 flex-row items-center justify-between">
            <Heading size="md">
              {i18n.t("map.date-range-picker.title")} (
              {step === "start"
                ? i18n.t("map.date-range-picker.step-start")
                : i18n.t("map.date-range-picker.step-end")}
              )
            </Heading>
            <Button onPress={handleReset} size="sm" variant="link">
              <ButtonText className="text-secondary-500">
                {i18n.t("map.date-range-picker.reset")}
              </ButtonText>
            </Button>
          </Box>

          {/* Date Display Areas */}
          <Box className="mb-6 flex-row gap-4">
            <Button
              className={cn(
                "h-14 flex-1 flex-col items-start justify-center border px-3",
                step === "start"
                  ? "border-primary-500 bg-primary-50"
                  : "border-outline-200",
              )}
              onPress={() => {
                setStep("start");
                if (Platform.OS === "android") openAndroidPicker("start");
              }}
              variant="outline"
            >
              <Text className="mb-0.5 text-typography-500 text-xs">
                {i18n.t("map.date-range-picker.start-date")}
              </Text>
              <Text
                className={cn(
                  "font-bold text-base",
                  !startDate ? "text-typography-400" : "text-typography-900",
                )}
              >
                {startDate ? startDate.toFormat("yyyy-MM-dd") : "YYYY-MM-DD"}
              </Text>
            </Button>

            <Button
              className={cn(
                "h-14 flex-1 flex-col items-start justify-center border px-3",
                step === "end"
                  ? "border-primary-500 bg-primary-50"
                  : "border-outline-200",
              )}
              onPress={() => {
                setStep("end");
                if (Platform.OS === "android") openAndroidPicker("end");
              }}
              variant="outline"
            >
              <Text className="mb-0.5 text-typography-500 text-xs">
                {i18n.t("map.date-range-picker.end-date")}
              </Text>
              <Text
                className={cn(
                  "font-bold text-base",
                  !endDate ? "text-typography-400" : "text-typography-900",
                )}
              >
                {endDate ? endDate.toFormat("yyyy-MM-dd") : "YYYY-MM-DD"}
              </Text>
            </Button>
          </Box>

          {/* iOS Inline Picker */}
          {Platform.OS === "ios" && (
            <Box className="flex-1 items-center justify-center">
              <CrossPlatformDateTimePicker
                isOpen={true}
                mode="date"
                onChange={handleDateChange} // iOS instant change
                value={pickerValue}
              />
              <Text className="mt-4 text-center text-sm text-typography-400">
                {step === "start"
                  ? i18n.t("map.date-range-picker.guide.ios-start")
                  : i18n.t("map.date-range-picker.guide.ios-end")}
              </Text>
            </Box>
          )}

          {/* Android Button if needed (Usually hidden if we use the top buttons to trigger) */}
          {Platform.OS === "android" && (
            <Box className="mt-4">
              <Text className="mb-4 text-center text-typography-400">
                {i18n.t("map.date-range-picker.guide.android")}
              </Text>
            </Box>
          )}
        </Box>
      </ActionsheetContent>
    </Actionsheet>
  );
}
