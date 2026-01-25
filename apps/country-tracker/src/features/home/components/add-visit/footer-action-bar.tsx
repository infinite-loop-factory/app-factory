import type { FooterActionsProps } from "@/features/home/types/add-visit-screen";

import { Plus } from "lucide-react-native";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import i18n from "@/lib/i18n";

export function FooterActionBar({
  onCancel,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
}: FooterActionsProps) {
  return (
    <View
      className="border-slate-200 border-t bg-background-light p-4 dark:border-slate-800/50 dark:bg-background-dark"
      style={{ paddingBottom: Platform.OS === "ios" ? 32 : 16 }}
    >
      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 items-center justify-center rounded-xl border border-slate-300 bg-transparent px-5 py-3.5 active:bg-slate-50 dark:border-slate-600 dark:active:bg-slate-800"
          onPress={onCancel}
        >
          <Text className="font-bold text-base text-slate-700 dark:text-slate-200">
            {i18n.t("home.add-visit.cancel") ?? "Cancel"}
          </Text>
        </Pressable>
        <Pressable
          className={`flex-[1.5] flex-row items-center justify-center gap-2 rounded-xl bg-primary-300 px-5 py-3.5 shadow-lg shadow-primary-300/20 active:opacity-90 ${isSubmitDisabled ? "opacity-50" : ""}`}
          disabled={isSubmitDisabled || isSubmitting}
          onPress={onSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Plus color="white" size={20} />
              <Text className="font-bold text-base text-white">
                {i18n.t("home.add-visit.submit") ?? "Register"}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}
