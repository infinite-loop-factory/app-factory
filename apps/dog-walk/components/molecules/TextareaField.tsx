import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";
import { VStack } from "../ui/vstack";

interface TextareaFieldProps {
  title: string;
  maxLength: number;
  placeholder: string;
  helperText: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextareaField({
  title,
  maxLength,
  placeholder,
  helperText,
  value,
  setValue,
}: TextareaFieldProps) {
  return (
    <VStack className="gap-2">
      <Text className="font-medium">{title}</Text>
      <Textarea>
        <TextareaInput
          className="align-top"
          maxLength={maxLength}
          onChangeText={(text) => {
            if (text.length > maxLength) return;
            setValue(() => text);
          }}
          placeholder={placeholder}
          value={value}
        />
      </Textarea>
      <HStack className="items-center justify-between">
        <Text className="text-slate-400 text-xs">{helperText}</Text>
        <Text className="text-slate-400 text-xs">
          {value.length} / {maxLength}
        </Text>
      </HStack>
    </VStack>
  );
}
