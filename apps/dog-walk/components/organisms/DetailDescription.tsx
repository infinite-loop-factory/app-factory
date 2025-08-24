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
      <Text className="mb-2 font-medium">
        당신의 댕댕이와 함께 걸어보길 바라는 이유
      </Text>
      <Text className="text-slate-600 text-sm">{content}</Text>
    </VStack>
  );
}
