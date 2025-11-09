import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { Calendar } from "lucide-react-native";
import { DateTime } from "luxon";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import {
  CrossPlatformDateTimePicker,
  openAndroidDateTimePicker,
} from "@/components/cross-platform-date-time-picker";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import {
  addVisitFormOptions,
  DEFAULT_RANGE_DAYS,
} from "@/features/home/constants/add-visit-form";
import { formatDisplayDate } from "@/features/home/utils/date-display";
import { withForm } from "@/hooks/create-app-form";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import { countInclusiveDays, isInvalidIsoRange } from "@/utils/date-range";

type PickerField = "start" | "end";

export const DateRangeSection = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => {
    const [
      cardBackground,
      borderColor,
      textColor,
      mutedTextColor,
      headingColor,
    ] = useThemeColor([
      "background-50",
      "outline-200",
      "typography",
      "typography-500",
      "typography-900",
    ]);
    const [activePicker, setActivePicker] = useState<PickerField | null>(null);

    const stayLength = isInvalidIsoRange(
      form.getFieldValue("startDate"),
      form.getFieldValue("endDate"),
    )
      ? 0
      : (countInclusiveDays(
          form.getFieldValue("startDate"),
          form.getFieldValue("endDate"),
        ) as number) || DEFAULT_RANGE_DAYS;

    const applySyncedDates = (field: PickerField, iso: string) => {
      if (field === "start") {
        form.setFieldValue("startDate", iso);
        if (form.getFieldValue("sameDay")) {
          form.setFieldValue("endDate", iso);
        }
        return;
      }
      form.setFieldValue("endDate", iso);
    };

    const handleDateChange =
      (field: PickerField) => (_e: DateTimePickerEvent, date?: Date) => {
        setActivePicker(null);
        if (!date) return;
        const iso = DateTime.fromJSDate(date).toISODate();
        if (!iso) return;
        applySyncedDates(field, iso);
      };

    const handleShowPicker = (field: PickerField) => {
      const currentValue =
        field === "start"
          ? form.getFieldValue("startDate")
          : form.getFieldValue("endDate");
      const currentDate = DateTime.fromISO(currentValue).isValid
        ? DateTime.fromISO(currentValue).toJSDate()
        : new Date();
      if (Platform.OS === "android") {
        openAndroidDateTimePicker(currentDate, handleDateChange(field), "date");
      } else if (Platform.OS === "ios") {
        setActivePicker(field);
      }
    };

    const renderStartDateInput = () => {
      if (Platform.OS === "web") {
        return (
          <form.Field name="startDate">
            {(field) => (
              <View className="flex-1">
                <input
                  className="w-full rounded-2xl border border-outline-200 bg-background-50 px-4 py-3 text-sm text-typography outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={field.state.value}
                />
                <Text
                  className="mt-1 text-xs"
                  style={{ color: mutedTextColor }}
                >
                  {i18n.t("home.add-visit.start-label") ?? ""}
                </Text>
              </View>
            )}
          </form.Field>
        );
      }
      return (
        <Pressable
          className="flex-1"
          onPress={() => handleShowPicker("start")}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Input
            className="rounded-2xl border border-outline-200 bg-background-50"
            size="lg"
          >
            <InputField
              editable={false}
              placeholder={i18n.t("home.add-visit.start-label") ?? ""}
              value={formatDisplayDate(form.getFieldValue("startDate"))}
            />
            <InputSlot className="pr-2">
              <InputIcon as={() => <Calendar color={textColor} size={18} />} />
            </InputSlot>
          </Input>
          <Text className="mt-1 text-xs" style={{ color: mutedTextColor }}>
            {i18n.t("home.add-visit.start-label") ?? ""}
          </Text>
        </Pressable>
      );
    };

    const renderEndDateInput = () => {
      if (Platform.OS === "web") {
        return (
          <form.Field name="endDate">
            {(field) => (
              <View className="flex-1">
                <input
                  className="w-full rounded-2xl border border-outline-200 bg-background-50 px-4 py-3 text-sm text-typography outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
                  disabled={form.getFieldValue("sameDay")}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={field.state.value}
                />
                <Text
                  className="mt-1 text-xs"
                  style={{ color: mutedTextColor }}
                >
                  {i18n.t("home.add-visit.end-label") ?? ""}
                </Text>
              </View>
            )}
          </form.Field>
        );
      }
      return (
        <Pressable
          className="flex-1"
          disabled={form.getFieldValue("sameDay")}
          onPress={() => handleShowPicker("end")}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Input
            className="rounded-2xl border border-outline-200 bg-background-50"
            size="lg"
          >
            <InputField
              editable={false}
              placeholder={i18n.t("home.add-visit.end-label") ?? ""}
              style={{
                color: form.getFieldValue("sameDay")
                  ? mutedTextColor
                  : textColor,
              }}
              value={formatDisplayDate(form.getFieldValue("endDate"))}
            />
            <InputSlot className="pr-2">
              <InputIcon as={() => <Calendar color={textColor} size={18} />} />
            </InputSlot>
          </Input>
          <Text className="mt-1 text-xs" style={{ color: mutedTextColor }}>
            {i18n.t("home.add-visit.end-label") ?? ""}
          </Text>
        </Pressable>
      );
    };

    return (
      <FormControl className="gap-4" size="lg">
        <FormControlLabel>
          <FormControlLabelText className="text-sm">
            {i18n.t("home.add-visit.date-range") ?? ""}
          </FormControlLabelText>
        </FormControlLabel>

        <View className="flex-row gap-3">
          {renderStartDateInput()}
          {renderEndDateInput()}
        </View>

        {Platform.OS === "ios" && activePicker && (
          <CrossPlatformDateTimePicker
            isOpen={!!activePicker}
            mode="date"
            onChange={handleDateChange(activePicker)}
            value={DateTime.fromISO(
              activePicker === "start"
                ? form.getFieldValue("startDate")
                : form.getFieldValue("endDate"),
            ).toJSDate()}
          />
        )}

        <View
          className="flex-row items-center justify-between rounded-3xl border px-5 py-4"
          style={{ borderColor: borderColor, backgroundColor: cardBackground }}
        >
          <View className="flex-1 pr-4">
            <Text
              className="font-semibold text-sm"
              style={{ color: headingColor }}
            >
              {i18n.t("home.add-visit.same-day") ?? ""}
            </Text>
            <Text
              className="mt-1 text-xs leading-4"
              style={{ color: mutedTextColor }}
            >
              {i18n.t("home.add-visit.same-day-hint") ?? ""}
            </Text>
          </View>
          <Switch
            onValueChange={(value) => {
              form.setFieldValue("sameDay", value);
              if (value) {
                form.setFieldValue("endDate", form.getFieldValue("startDate"));
              }
            }}
            value={form.getFieldValue("sameDay")}
          />
        </View>
        <FormControlHelper>
          <FormControlHelperText size="sm">
            {i18n.t("home.add-visit.stay-length", { count: stayLength }) ?? ""}
          </FormControlHelperText>
        </FormControlHelper>
      </FormControl>
    );
  },
});
