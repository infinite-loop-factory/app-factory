import { View } from "react-native";
import { Text } from "./ui/text";

interface IHeaderBar {
  title: string;
}

export default function HeaderBar({ title }: IHeaderBar) {
  return (
    <View className="flex justify-between border-slate-100 border-b px-6 py-4">
      <Text className="font-semibold" size={"xl"}>
        {title}
      </Text>
    </View>
  );
}
