import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";

interface ErrorFallbackProps {
  readonly error: unknown;
  readonly resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const [backgroundColor, textColor, errorColor] = useThemeColor([
    "background",
    "typography",
    "error-600",
  ]);

  let errorMessage = "";
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error != null) {
    // Handle non-Error objects by converting to string safely
    try {
      errorMessage = typeof error === "string" ? error : JSON.stringify(error);
    } catch {
      errorMessage = "Unknown error";
    }
  }

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor }}
    >
      <VStack className="items-center" space="lg">
        <Heading size="xl" style={{ color: errorColor }}>
          {i18n.t("error.title")}
        </Heading>
        <Text className="text-center text-sm" style={{ color: textColor }}>
          {i18n.t("error.message")}
        </Text>
        {__DEV__ && Boolean(errorMessage) && (
          <Text
            className="mt-2 text-center font-mono text-xs"
            style={{ color: textColor }}
          >
            {errorMessage}
          </Text>
        )}
        <Button className="mt-4" onPress={resetError} variant="outline">
          <ButtonText>{i18n.t("error.retry")}</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
