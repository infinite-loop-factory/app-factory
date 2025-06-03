import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

interface IHeaderBar {
  title: string;
  isShowBackButton?: boolean;
}

export default function HeaderBar({
  title,
  isShowBackButton = false,
}: IHeaderBar) {
  return (
    <View className="flex justify-between border-slate-100 border-b px-6 py-4">
      <HStack className="items-center gap-2">
        {isShowBackButton && (
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Icon as={ChevronLeft} className="h-6 w-6" />
          </TouchableOpacity>
        )}
        <Text className="font-semibold" size={"xl"}>
          {title}
        </Text>
      </HStack>
    </View>
  );
}
