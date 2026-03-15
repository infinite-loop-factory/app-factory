import type ViewShot from "react-native-view-shot";

import { useCallback, useRef } from "react";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/lib/i18n";
import { triggerHaptic } from "@/utils/haptics";

export function useShareStats() {
  const viewShotRef = useRef<ViewShot>(null);
  const { showToast } = useGlobalToast();

  const share = useCallback(async () => {
    try {
      triggerHaptic("light");

      if (!viewShotRef.current?.capture) {
        showToast(
          "error",
          i18n.t("share.title"),
          i18n.t("share.not-available"),
        );
        return;
      }

      const uri = await viewShotRef.current.capture();

      const Sharing = await import("expo-sharing");
      if (!(await Sharing.isAvailableAsync())) {
        showToast("info", i18n.t("share.title"), i18n.t("share.not-available"));
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: i18n.t("share.title"),
      });

      triggerHaptic("success");
    } catch {
      showToast("error", i18n.t("share.title"), i18n.t("share.error"));
    }
  }, [showToast]);

  return { viewShotRef, share };
}
