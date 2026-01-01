import type { GeoCoordinates } from "@/features/home/utils/exif";

import { Image as ImageIcon, MapPin } from "lucide-react-native";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { addVisitFormOptions } from "@/features/home/constants/add-visit-form";
import { useHydrateFromPhotoMutation } from "@/features/home/hooks/use-hydrate-from-photo";
import { usePrefillLocationMutation } from "@/features/home/hooks/use-prefill-location";
import { resolveCountryFromCoordinates } from "@/features/home/utils/resolve-country";
import { withForm } from "@/hooks/create-app-form";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/libs/i18n";

export const MediaImportCard = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => {
    const { showToast } = useGlobalToast();
    const { mutateAsync: hydrateMutateAsync, isPending: hydrateIsPending } =
      useHydrateFromPhotoMutation();
    const { mutateAsync: prefillMutateAsync, isPending: prefillIsPending } =
      usePrefillLocationMutation();

    const isLoading = Boolean(hydrateIsPending) || Boolean(prefillIsPending);
    const brandColor = "#FFA31A";

    const applyCoordinatesToForm = async (nextCoords: GeoCoordinates) => {
      form.setFieldValue("coords", nextCoords);
      try {
        const { normalizedCode, country } =
          await resolveCountryFromCoordinates(nextCoords);
        if (normalizedCode) {
          form.setFieldValue("selectedCountry", normalizedCode);
          form.setFieldValue("countryNameOverride", country);
        }
      } catch (error) {
        console.error("Failed to resolve country from coordinates", error);
      }
    };

    const handlePickPhoto = async () => {
      try {
        const result = await hydrateMutateAsync();
        if (result.error) {
          showToast(
            "error",
            i18n.t("home.add-visit.errors.photo-failed"),
            result.error,
          );
        }
        if (result.coords) await applyCoordinatesToForm(result.coords);
        if (result.date) {
          form.setFieldValue("startDate", result.date as string);
          form.setFieldValue("endDate", result.date as string);
          form.setFieldValue("sameDay", true);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : i18n.t("home.add-visit.errors.photo-failed");
        showToast(
          "error",
          i18n.t("home.add-visit.errors.photo-failed"),
          message,
        );
      }
    };

    const handlePrefill = async () => {
      try {
        const result = await prefillMutateAsync();
        if (result.error) {
          showToast(
            "error",
            i18n.t("home.add-visit.errors.location-failed"),
            result.error ?? "",
          );
        } else if (result.coords) {
          await applyCoordinatesToForm(result.coords);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : i18n.t("home.add-visit.errors.location-failed");
        showToast(
          "error",
          i18n.t("home.add-visit.errors.location-failed"),
          message,
        );
      }
    };

    return (
      <View className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-background-helper p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <View className="flex flex-col gap-1">
          <Text className="font-bold text-base text-slate-900 dark:text-white">
            {i18n.t("home.add-visit.media-import-title") ??
              "How would you like to add your visit?"}
          </Text>
          <Text className="text-slate-500 text-xs leading-relaxed dark:text-slate-400">
            {i18n.t("home.add-visit.media-import-subtitle") ??
              "We can fill in country and date from your photo or location."}
          </Text>
        </View>
        <View className="flex flex-col gap-3">
          <Pressable
            className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border border-primary-300 bg-white active:bg-slate-50 dark:active:bg-slate-700/50"
            disabled={isLoading}
            onPress={handlePickPhoto}
          >
            {isLoading ? (
              <ActivityIndicator color={brandColor} />
            ) : (
              <>
                <ImageIcon color={brandColor} size={20} />
                <Text className="font-bold text-primary-300">
                  {i18n.t("home.add-visit.from-photo") ?? "From photo"}
                </Text>
              </>
            )}
          </Pressable>
          <Pressable
            className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl border border-primary-300 bg-transparent active:bg-slate-50 dark:active:bg-slate-700/50"
            disabled={isLoading}
            onPress={handlePrefill}
          >
            {isLoading ? (
              <ActivityIndicator color={brandColor} />
            ) : (
              <>
                <MapPin color={brandColor} size={20} />
                <Text className="font-bold text-primary-300">
                  {i18n.t("home.add-visit.from-location") ??
                    "Use current location"}
                </Text>
              </>
            )}
          </Pressable>
        </View>
        <Text className="text-center text-[10px] text-slate-400 dark:text-slate-500">
          {i18n.t("home.add-visit.from-location-helper") ??
            "Refresh your GPS position to suggest a country automatically."}
        </Text>
      </View>
    );
  },
});
