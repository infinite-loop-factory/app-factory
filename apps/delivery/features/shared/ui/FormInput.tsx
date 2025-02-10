import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

type useFormInputProps<T extends FieldValues> = {
  control: Control<T>;
};
type FormInputProps<T extends FieldValues> = {
  label: string;
  type?: "text" | "password";
  errors: FieldErrors<T>;
  name: Path<T>;
};

export function FormInput<T extends FieldValues>({
  control,
  label,
  name,
  type,
  errors,
}: useFormInputProps<T> & FormInputProps<T>) {
  return (
    <Box>
      <Text size={"md"} bold={true}>
        {label}
      </Text>

      <Box className={"min-h-[4px]"} />

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              type={name === "password" ? "password" : type}
              value={value ?? ""}
              onChangeText={onChange}
            />
          </Input>
        )}
      />
      <Text size={"md"} className={"text-error-500"}>
        {(errors?.[name]?.message as string) ?? ""}
      </Text>
    </Box>
  );
}
