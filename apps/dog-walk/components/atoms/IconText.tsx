import { IconTextType } from "@/types/displayType";
import { Clock, MapPin, Star } from "lucide-react-native";
import { useCallback } from "react";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";

interface IIconTextProps {
  type: IconTextType;
  content: string;
}

export default function IconText({ type, content }: IIconTextProps) {
  const renderIcon = useCallback(() => {
    if (type === IconTextType.MAP) {
      return MapPin;
    }

    if (type === IconTextType.CLOCK) {
      return Clock;
    }
    return Star;
  }, [type]);

  return (
    <HStack className="items-center gap-1">
      <Icon as={renderIcon()} className="h-4 w-4 text-primary-500" />
      <Text size={"sm"} className="text-slate-500">
        {content}
      </Text>
    </HStack>
  );
}
