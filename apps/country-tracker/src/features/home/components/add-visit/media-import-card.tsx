import type { GeoCoordinates } from "@/features/home/utils/exif";

import { Image as ImageIcon, MapPin } from "lucide-react-native";
import { View } from "react-native";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { addVisitFormOptions } from "@/features/home/constants/add-visit-form";
import { useHydrateFromPhotoMutation } from "@/features/home/hooks/use-hydrate-from-photo";
import { usePrefillLocationMutation } from "@/features/home/hooks/use-prefill-location";
import { resolveCountryFromCoordinates } from "@/features/home/utils/resolve-country";
import { withForm } from "@/hooks/create-app-form";
import { useGlobalToast } from "@/hooks/use-global-toast";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";

export const MediaImportCard = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => {
    const [cardBackground, borderColor, headingColor, mutedTextColor] =
      useThemeColor([
        "background-50",
        "outline-200",
        "typography-900",
        "typography-500",
      ]);

    const { showToast } = useGlobalToast();
    const { mutateAsync: hydrateMutateAsync, isPending: hydrateIsPending } =
      useHydrateFromPhotoMutation();
    const { mutateAsync: prefillMutateAsync, isPending: prefillIsPending } =
      usePrefillLocationMutation();

    const isLoading = Boolean(hydrateIsPending) || Boolean(prefillIsPending);

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
      <Box
        className="rounded-3xl border px-5 py-5"
        style={{ backgroundColor: cardBackground, borderColor }}
      >
        <Text
          className="font-semibold text-base"
          style={{ color: headingColor }}
        >
          {i18n.t("home.add-visit.media-import-title") ?? ""}
        </Text>
        <Text
          className="mt-1 text-sm leading-5"
          style={{ color: mutedTextColor }}
        >
          {i18n.t("home.add-visit.media-import-subtitle") ?? ""}
        </Text>
        <View className="mt-4 gap-3">
          <View>
            <Button
              action="primary"
              className="w-full justify-center"
              disabled={isLoading}
              onPress={handlePickPhoto}
              size="lg"
            >
              {isLoading ? <ButtonSpinner /> : <ButtonIcon as={ImageIcon} />}
              <ButtonText>
                {i18n.t("home.add-visit.from-photo") ?? ""}
              </ButtonText>
            </Button>
            <Text
              className="mt-1 text-xs leading-4"
              style={{ color: mutedTextColor }}
            >
              {i18n.t("home.add-visit.from-photo-helper") ?? ""}
            </Text>
          </View>
          <View>
            <Button
              action="secondary"
              className="w-full justify-center"
              disabled={isLoading}
              onPress={handlePrefill}
              size="lg"
              variant="outline"
            >
              {isLoading ? <ButtonSpinner /> : <ButtonIcon as={MapPin} />}
              <ButtonText>
                {i18n.t("home.add-visit.from-location") ?? ""}
              </ButtonText>
            </Button>
            <Text
              className="mt-1 text-xs leading-4"
              style={{ color: mutedTextColor }}
            >
              {i18n.t("home.add-visit.from-location-helper") ?? ""}
            </Text>
          </View>
        </View>
      </Box>
    );
  },
});
