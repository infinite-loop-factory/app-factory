import { Input, InputField } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Text, View } from "react-native";

type useFormInputProps<T extends FieldValues> = {
  control: Control<T>;
  errors: FieldErrors<T>;
};
type FormInputProps<T extends FieldValues> = {
  label: string;
  type?: "text" | "password";
  name: Path<T>;
};

export function useFormInput<T extends FieldValues>({
  control,
  errors,
}: useFormInputProps<T>) {
  return {
    FormInput: ({ label, name, type }: FormInputProps<T>) => {
      const message = errors[name]?.message as string;
      return (
        <View>
          <Text className={"body-4 !font-bold"}>{label}</Text>
          <View className={"min-h-[4px]"} />
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
          <Text className={"label-6 !text-error-600"}>{message ?? ""}</Text>
        </View>
      );
    },
  };
}
