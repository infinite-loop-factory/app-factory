import type { ErrorBannerProps } from "@/features/home/types/add-visit-screen";

import { AlertCircle } from "lucide-react-native";
import {
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { useThemeColor } from "@/hooks/use-theme-color";

export function ErrorBanner({ message }: ErrorBannerProps) {
  const [errorColor, errorSurface] = useThemeColor([
    "error-600",
    "background-error",
  ]);

  if (!message) return null;
  return (
    <FormControlError
      className="items-start rounded-3xl border px-4 py-3"
      style={{ borderColor: errorColor, backgroundColor: errorSurface }}
    >
      <FormControlErrorIcon as={AlertCircle} size="sm" />
      <FormControlErrorText size="sm">{message}</FormControlErrorText>
    </FormControlError>
  );
}
