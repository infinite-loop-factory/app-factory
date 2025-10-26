import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface GuideSectionProps {
  title: string;
  guideText: string[];
}

export default function GuideSection({ title, guideText }: GuideSectionProps) {
  return (
    <VStack className="gap-2 rounded-xl bg-primary-800/5 p-4">
      <Text className="font-medium text-sm">{title}</Text>
      {guideText.map((data) => (
        <Text className="text-slate-600 text-xs" key={`guide_text_${data}`}>
          • {data}
        </Text>
      ))}
    </VStack>
  );
}
