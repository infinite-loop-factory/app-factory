import type { ErrorBannerProps } from "@/features/home/types/add-visit-screen";

import { AlertCircle } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/use-theme-color";

export function ErrorBanner({ message }: ErrorBannerProps) {
  const [errorColor, errorSurface] = useThemeColor([
    "error-600",
    "background-error",
  ]);

  if (!message) return null;
  return (
    <Box
      className="flex-row items-start gap-2 rounded-xl border px-4 py-3"
      style={{ borderColor: errorColor, backgroundColor: errorSurface }}
    >
      <AlertCircle color={errorColor} size={16} />
      <Text className="flex-1 text-sm" style={{ color: errorColor }}>
        {message}
      </Text>
    </Box>
  );
}
