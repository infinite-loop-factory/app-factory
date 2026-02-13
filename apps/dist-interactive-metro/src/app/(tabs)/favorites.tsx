import { PlaceholderTabScreen } from "@/components/placeholder-tab-screen";
import i18n from "@/i18n";

export default function FavoritesTabScreen() {
  return (
    <PlaceholderTabScreen
      description={i18n.t("favorites.placeholder")}
      title={i18n.t("tabs.favorites")}
    />
  );
}
