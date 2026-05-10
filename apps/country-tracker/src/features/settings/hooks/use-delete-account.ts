import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { stopLocationTask } from "@/features/location/location-permission";
import { deleteAccount } from "@/features/settings/apis/delete-account";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/lib/i18n";

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useGlobalToast();
  const { user } = useAuthUser();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error(i18n.t("home.add-visit.errors.no-user"));
      await stopLocationTask();
      await deleteAccount(user.id);
    },
    onSuccess: () => {
      queryClient.clear();
      router.replace("/login");
    },
    onError: () => {
      showToast(
        "error",
        i18n.t("settings.delete-account.toast.error-title"),
        i18n.t("settings.delete-account.toast.error-description"),
      );
    },
  });
}
