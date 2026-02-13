import { PlaceholderTabScreen } from "@/components/placeholder-tab-screen";
import i18n from "@/i18n";

export default function NotificationsTabScreen() {
  return (
    <PlaceholderTabScreen
      description={i18n.t("notifications.placeholder")}
      title={i18n.t("tabs.notifications")}
    />
  );
}
