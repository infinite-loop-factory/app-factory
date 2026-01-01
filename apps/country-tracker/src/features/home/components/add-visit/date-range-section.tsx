import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar, CalendarDays } from "lucide-react-native";
import { DateTime } from "luxon";
import { useState } from "react";
import { Dimensions, Modal, Platform, Pressable, View } from "react-native";
import {
  type EdgeInsets,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { addVisitFormOptions } from "@/features/home/constants/add-visit-form";
import { formatDisplayDate } from "@/features/home/utils/date-display";
import { withForm } from "@/hooks/create-app-form";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import { countInclusiveDays } from "@/utils/date-range";

type PickerField = "start" | "end";

interface DateRangeInputsProps {
  // biome-ignore lint/suspicious/noExplicitAny: form type is complex
  form: any;
  startDateStr?: string;
  endDateStr?: string;
  sameDay?: boolean;
}

interface DatePickerModalProps {
  activePicker: PickerField | null;
  setActivePicker: (val: PickerField | null) => void;
  startDate: DateTime;
  endDate: DateTime;
  handleDateChange: (event: DateTimePickerEvent, date?: Date) => void;
  accentColor: string;
  insets: EdgeInsets;
}

const DatePickerModal = ({
  activePicker,
  setActivePicker,
  startDate,
  endDate,
  handleDateChange,
  accentColor,
  insets,
}: DatePickerModalProps) => {
  if (!activePicker) return null;

  return (
    <View>
      {Platform.OS === "ios" ? (
        <Modal
          animationType="slide"
          onRequestClose={() => setActivePicker(null)}
          transparent
          visible={!!activePicker}
        >
          <Pressable
            className="flex-1 justify-end bg-black/50"
            onPress={() => setActivePicker(null)}
          >
            <Pressable
              className="w-full items-center overflow-hidden rounded-t-2xl bg-white dark:bg-slate-900"
              onPress={(e) => e.stopPropagation()}
              style={{ paddingBottom: insets.bottom }}
            >
              <View className="w-full flex-row justify-end border-slate-100 border-b p-2 dark:border-slate-800">
                <Pressable
                  className="p-2"
                  onPress={() => setActivePicker(null)}
                >
                  <Text className="font-bold text-primary-500">
                    {i18n.t("common.done")}
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                accentColor={accentColor}
                display="inline"
                mode="date"
                onChange={handleDateChange}
                style={{
                  height: 320,
                  width: Dimensions.get("window").width,
                }}
                value={
                  activePicker === "start"
                    ? startDate.toJSDate()
                    : endDate.toJSDate()
                }
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        <DateTimePicker
          display="default"
          mode="date"
          onChange={handleDateChange}
          value={
            activePicker === "start" ? startDate.toJSDate() : endDate.toJSDate()
          }
        />
      )}
    </View>
  );
};

const DateRangeInputs = ({
  form,
  startDateStr,
  endDateStr,
  sameDay,
}: DateRangeInputsProps) => {
  const insets = useSafeAreaInsets();
  const accentColor = useThemeColor("primary-500").replace(/ /g, ",");

  const startDate = startDateStr
    ? DateTime.fromISO(startDateStr)
    : DateTime.now();
  const endDate = endDateStr ? DateTime.fromISO(endDateStr) : DateTime.now();

  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const updateDate = (date: Date) => {
    const isoDate = date.toISOString();
    if (activePicker === "start") {
      form.setFieldValue("startDate", isoDate);
      if (sameDay) {
        form.setFieldValue("endDate", isoDate);
      } else if (DateTime.fromJSDate(date) > endDate) {
        form.setFieldValue("endDate", isoDate);
      }
    } else if (activePicker === "end") {
      form.setFieldValue("endDate", isoDate);
      if (DateTime.fromJSDate(date) < startDate) {
        form.setFieldValue("startDate", isoDate);
      }
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setActivePicker(null);
    }

    if (event.type === "dismissed") {
      setActivePicker(null);
      return;
    }

    if (date) {
      updateDate(date);
    }
  };

  const daysCount = countInclusiveDays(startDateStr ?? "", endDateStr ?? "");

  return (
    <View className="flex flex-col gap-5">
      <View className="flex flex-col gap-2">
        <Text className="font-bold text-base text-slate-900 dark:text-white">
          {i18n.t("home.add-visit.date-label")}
        </Text>
        <View className="flex-row gap-3">
          {/* Start Date */}
          <View className="flex flex-1 flex-col gap-1">
            <Pressable
              className="relative h-12 w-full justify-center rounded-xl border border-slate-200 bg-white pr-10 pl-4 dark:border-slate-700 dark:bg-slate-800"
              onPress={() => setActivePicker("start")}
            >
              <Text className="text-base text-slate-900 dark:text-white">
                {formatDisplayDate(startDate.toISO() ?? "")}
              </Text>
              <View className="absolute inset-y-0 right-0 flex h-full justify-center pr-3">
                <Calendar className="text-slate-400" size={18} />
              </View>
            </Pressable>
            <Text className="pl-1 text-slate-400 text-xs">Start</Text>
          </View>

          {/* End Date */}
          <View className="flex flex-1 flex-col gap-1">
            <Pressable
              className={`relative h-12 w-full justify-center rounded-xl border border-slate-200 bg-white pr-10 pl-4 dark:border-slate-700 dark:bg-slate-800 ${sameDay ? "opacity-50" : ""}`}
              disabled={sameDay}
              onPress={() => !sameDay && setActivePicker("end")}
            >
              <Text className="text-base text-slate-900 dark:text-white">
                {formatDisplayDate(endDate.toISO() ?? "")}
              </Text>
              <View className="absolute inset-y-0 right-0 flex h-full justify-center pr-3">
                <CalendarDays className="text-slate-400" size={18} />
              </View>
            </Pressable>
            <Text className="pl-1 text-slate-400 text-xs">End</Text>
          </View>
        </View>
      </View>

      <DatePickerModal
        accentColor={accentColor}
        activePicker={activePicker}
        endDate={endDate}
        handleDateChange={handleDateChange}
        insets={insets}
        setActivePicker={setActivePicker}
        startDate={startDate}
      />

      <View className="flex-row items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-800/50">
        <View className="flex flex-col">
          <Text className="font-bold text-slate-900 text-sm dark:text-white">
            {i18n.t("home.add-visit.same-day-label")}
          </Text>
          <Text className="mt-0.5 text-slate-500 text-xs dark:text-slate-400">
            {i18n.t("home.add-visit.same-day-helper")}
          </Text>
        </View>
        <Switch
          onValueChange={(val) => {
            form.setFieldValue("sameDay", val);
            if (val) {
              form.setFieldValue("endDate", startDate.toISO());
            }
          }}
          value={!!sameDay}
        />
      </View>
      <Text className="pl-1 text-slate-400 text-xs dark:text-slate-500">
        {i18n.t("home.add-visit.stay-length", { count: daysCount })}
      </Text>
    </View>
  );
};

export const DateRangeSection = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => {
    return (
      <form.Subscribe
        selector={(state) => ({
          startDate: state.values.startDate,
          endDate: state.values.endDate,
          sameDay: state.values.sameDay,
        })}
      >
        {({ startDate, endDate, sameDay }) => (
          <DateRangeInputs
            endDateStr={endDate}
            form={form}
            sameDay={sameDay}
            startDateStr={startDate}
          />
        )}
      </form.Subscribe>
    );
  },
});
