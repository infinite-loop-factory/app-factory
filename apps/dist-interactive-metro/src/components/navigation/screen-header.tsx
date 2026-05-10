import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "@/i18n";

interface ScreenHeaderProps {
  title: string;
  /** Optional: custom back handler. Defaults to router.back() */
  onBack?: () => void;
}

/**
 * Shared header for mobile flows. Used on every screen except the root tab screens.
 * Back button + title. Respects top safe area (status bar / notch).
 */
export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);

  return (
    <View
      className="border-outline-200 border-b bg-background-0"
      style={{ paddingTop: insets.top }}
    >
      <View className="min-h-[56px] flex-row items-center px-4">
        <Pressable
          accessibilityLabel={i18n.t("common.back")}
          accessibilityRole="button"
          className="mr-2 -ml-2 min-h-[44px] min-w-[44px] items-center justify-center"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={handleBack}
        >
          <ChevronLeft className="text-typography-900" size={28} />
        </Pressable>
        <Text
          accessibilityRole="header"
          className="flex-1 font-semibold text-lg text-typography-900"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
