import { ChevronRight, MapPin, Settings, Star } from "lucide-react-native";
import { useCallback } from "react";
import {
  type GestureResponderEvent,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

interface IProfileMenuItemProp {
  title: string;
  iconType: "MAP" | "STAR" | "SETTINGS";
  onPress?: (event: GestureResponderEvent) => void;
}

export default function ProfileMenuItem({
  title,
  iconType,
  onPress,
}: IProfileMenuItemProp) {
  const transIcon = useCallback(() => {
    if (iconType === "MAP") {
      return <Icon as={MapPin} className="h-6 w-6 text-primary-400" />;
    }

    if (iconType === "STAR") {
      return <Icon as={Star} className="h-6 w-6 text-primary-400" />;
    }

    if (iconType === "SETTINGS") {
      return <Icon as={Settings} className="h-6 w-6 text-primary-400" />;
    }
  }, [iconType]);

  return (
    <TouchableOpacity
      className="w-full justify-between rounded-xl bg-slate-50 px-4 py-6 hover:bg-slate-100"
      onPress={onPress}
    >
      <View className="flex flex-row items-center justify-between gap-4">
        {transIcon()}
        <Text className="flex-1">{title}</Text>
        <Icon as={ChevronRight} className="h-6 w-6 text-slate-400" />
      </View>
    </TouchableOpacity>
  );
}
