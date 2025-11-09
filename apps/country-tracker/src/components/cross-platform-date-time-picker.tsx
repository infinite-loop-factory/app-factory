import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

type CrossPlatformDateTimePickerProps = {
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  mode: "date" | "time";
  isOpen: boolean;
};

export function CrossPlatformDateTimePicker(
  props: CrossPlatformDateTimePickerProps,
) {
  const { value, onChange, mode, isOpen } = props;

  if (Platform.OS === "android") {
    return null; // Android uses DateTimePickerAndroid API
  }

  // iOS: Render DateTimePicker inline
  if (isOpen) {
    return (
      <DateTimePicker
        display={mode === "date" ? "inline" : "default"}
        mode={mode}
        onChange={onChange}
        value={value}
      />
    );
  }

  return null;
}

export const openAndroidDateTimePicker = (
  value: Date,
  onChange: (event: DateTimePickerEvent, date?: Date) => void,
  mode: "date" | "time",
) => {
  DateTimePickerAndroid.open({
    value,
    onChange,
    mode,
  });
};
