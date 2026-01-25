import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import i18n from "@/lib/i18n";

export function LocationPermissionDeniedToast() {
  return (
    <Toast action="error" variant="outline">
      <ToastTitle>{i18n.t("location.permission.denied.title")}</ToastTitle>
      <ToastDescription>
        {i18n.t("location.permission.denied.message")}
      </ToastDescription>
    </Toast>
  );
}
