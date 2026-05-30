import type { CountryItem } from "@/types/country-item";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/lib/i18n";
import supabase from "@/lib/supabase";
import { getStayDays } from "@/utils/country-region";
import { triggerHaptic } from "@/utils/haptics";

export function useDeleteVisitMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useGlobalToast();

  return useMutation({
    mutationFn: async (item: CountryItem): Promise<void> => {
      const { error } = await supabase
        .from("locations")
        .delete()
        .in("timestamp", item.dateSet);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_data, item) => {
      triggerHaptic("success");
      showToast(
        "success",
        i18n.t("home.delete-visit.toast.success-title"),
        i18n.t("home.delete-visit.toast.success-description", {
          count: getStayDays(item),
          country: item.country,
        }),
      );
      queryClient.invalidateQueries({
        queryKey: ["location", "visited-countries"],
      });
      queryClient.invalidateQueries({ queryKey: ["map", "visited-countries"] });
    },
    onError: () => {
      triggerHaptic("error");
      showToast(
        "error",
        i18n.t("home.delete-visit.toast.error-title"),
        i18n.t("home.delete-visit.toast.error-description"),
      );
    },
  });
}
