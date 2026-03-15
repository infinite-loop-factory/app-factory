import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteVisaLimit,
  fetchVisaLimits,
  upsertVisaLimit,
} from "@/features/settings/apis/visa-limits";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/lib/i18n";

const VISA_LIMITS_KEY = ["settings", "visa-limits"];

export function useVisaLimitsQuery() {
  const { user } = useAuthUser();
  return useQuery({
    queryKey: [...VISA_LIMITS_KEY, user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchVisaLimits(user?.id),
  });
}

export function useUpsertVisaLimitMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useGlobalToast();
  const { user } = useAuthUser();

  return useMutation({
    mutationFn: (params: {
      countryCode: string;
      maxDays: number;
      alertDaysBefore: number;
    }) => upsertVisaLimit({ userId: user?.id, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISA_LIMITS_KEY });
      showToast(
        "success",
        i18n.t("visa.toast.saved-title"),
        i18n.t("visa.toast.saved-description"),
      );
    },
    onError: () => {
      showToast(
        "error",
        i18n.t("visa.toast.error-title"),
        i18n.t("visa.toast.error-description"),
      );
    },
  });
}

export function useDeleteVisaLimitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVisaLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISA_LIMITS_KEY });
    },
  });
}
