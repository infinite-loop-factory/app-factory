import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface IDetailDescriptionProps {
  content: string;
}

export default function DetailDescription({
  content,
}: IDetailDescriptionProps) {
  return (
    <VStack className="py-6">
      <Text className="mb-2 font-medium">코스 설명</Text>
      <Text className="text-slate-600 text-sm">{content}</Text>
    </VStack>
  );
}
