import type { FooterActionsProps } from "@/features/home/types/add-visit-screen";

import { Plus } from "lucide-react-native";
import { Platform, View } from "react-native";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";

export function FooterActionBar({
  onCancel,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
}: FooterActionsProps) {
  const [backgroundColor, borderColor] = useThemeColor([
    "background",
    "outline-200",
  ]);
  return (
    <View
      className="px-5 pt-3"
      style={{
        paddingBottom: Platform.OS === "ios" ? 28 : 20,
        borderTopColor: borderColor,
        borderTopWidth: 1,
        backgroundColor: backgroundColor,
        gap: 12,
      }}
    >
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            action="secondary"
            onPress={onCancel}
            size="lg"
            variant="outline"
          >
            <ButtonText>{i18n.t("home.add-visit.cancel") ?? ""}</ButtonText>
          </Button>
        </View>
        <View className="flex-1">
          <Button
            action="primary"
            disabled={isSubmitDisabled}
            onPress={onSubmit}
            size="lg"
          >
            {isSubmitting ? <ButtonSpinner /> : <ButtonIcon as={Plus} />}
            <ButtonText>{i18n.t("home.add-visit.submit") ?? ""}</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
