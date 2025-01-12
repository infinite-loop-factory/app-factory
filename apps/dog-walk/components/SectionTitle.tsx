import { View } from "react-native";
import { Text } from "./ui/text";

interface ISectionTitle {
  title: string;
  children: React.ReactNode;
}

export default function SectionTitle({ title, children }: ISectionTitle) {
  return (
    <View className="py-6">
      <Text size={"lg"} className="mb-4 font-bold">
        {title}
      </Text>
      {children}
    </View>
  );
}
