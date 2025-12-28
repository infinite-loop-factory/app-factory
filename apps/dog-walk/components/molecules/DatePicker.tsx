import RNDateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { CalendarIcon } from "lucide-react-native";
import { useState } from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

interface IDatePickerProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function DatePicker({ date, setDate }: IDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const onChangeDatePicker = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!selectedDate) return;
    setShowPicker(false);
    setDate(selectedDate);
  };

  return (
    <TouchableOpacity onPress={showDatePicker}>
      <HStack className="w-full items-center justify-between rounded-xl bg-slate-50 p-3">
        <HStack className="items-center">
          <Icon as={CalendarIcon} className="h-5 w-5 text-primary-400" />
          <Text className="ml-2 text-slate-600" size="md">
            {showPicker && Platform.OS === "android" && (
              <RNDateTimePicker
                display="spinner"
                is24Hour={true}
                mode={"date"}
                onChange={onChangeDatePicker}
                testID="dateTimePicker"
                value={date}
              />
            )}
            {!showPicker && (
              <Text>
                {date.getFullYear()}.
                {(date.getMonth() + 1).toString().padStart(2, "0")}.
                {date.getDate().toString().padStart(2, "0")}
              </Text>
            )}
          </Text>
        </HStack>
        <Text className="text-slate-400" size={"sm"}>
          선택하기
        </Text>
      </HStack>
    </TouchableOpacity>
  );
}
