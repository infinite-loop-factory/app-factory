import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

import { Controller } from "react-hook-form";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

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
      <Text bold={true} size={"md"}>
        {label}
      </Text>

      <Box className={"min-h-[4px]"} />

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              onChangeText={onChange}
              type={name === "password" ? "password" : type}
              value={value ?? ""}
            />
          </Input>
        )}
      />
      <Text className={"text-error-500"} size={"md"}>
        {(errors?.[name]?.message as string) ?? ""}
      </Text>
    </Box>
  );
}
