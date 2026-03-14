import type { CountryItem } from "@/types/country-item";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { deleteVisitDays } from "@/features/home/apis/delete-visit";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/lib/i18n";

export function useDeleteVisitMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useGlobalToast();
  const { user } = useAuthUser();

  return useMutation({
    mutationFn: async (item: CountryItem) => {
      if (!user?.id) throw new Error(i18n.t("home.add-visit.errors.no-user"));

      const count = await deleteVisitDays({
        userId: user.id,
        countryCode: item.country_code,
        dateSet: item.dateSet,
      });

      return { count, country: item.country };
    },
    onSuccess: (result) => {
      showToast(
        "success",
        i18n.t("home.delete-visit.toast.success-title"),
        i18n.t("home.delete-visit.toast.success-description", {
          count: result.count,
          country: result.country,
        }),
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.location.visitedCountries(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.map.visitedCountrySummaries({
          userId: null,
          year: "",
        }),
      });
    },
    onError: () => {
      showToast(
        "error",
        i18n.t("home.delete-visit.toast.error-title"),
        i18n.t("home.delete-visit.toast.error-description"),
      );
    },
  });
}
