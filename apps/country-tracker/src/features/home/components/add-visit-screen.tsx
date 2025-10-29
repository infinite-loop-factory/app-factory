import type { AppSubscribeButtonRenderProps } from "@/components/subscribe-button";
import type { GeoCoordinates } from "@/features/home/utils/exif";

import { revalidateLogic } from "@tanstack/react-form";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Box } from "@/components/ui/box";
import { CountrySelectField } from "@/features/home/components/add-visit/country-select-field";
import { DateRangeSection } from "@/features/home/components/add-visit/date-range-section";
import { ErrorBanner } from "@/features/home/components/add-visit/error-banner";
import { FooterActionBar } from "@/features/home/components/add-visit/footer-action-bar";
import { MediaImportCard } from "@/features/home/components/add-visit/media-import-card";
import {
  ADD_VISIT_FORM_ID,
  addVisitFormOptions,
} from "@/features/home/constants/add-visit-form";
import {
  type AddVisitForm,
  AddVisitFormSchema,
} from "@/features/home/constants/add-visit-form-schema";
import { usePrefillLocationMutation } from "@/features/home/hooks/use-prefill-location";
import { useSubmitVisitMutation } from "@/features/home/hooks/use-submit-visit";
import { resolveCountryFromCoordinates } from "@/features/home/utils/resolve-country";
import { useAppForm } from "@/hooks/create-app-form";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import { zodOnDynamic } from "@/utils/zod-on-dynamic";

export function AddVisitScreen() {
  const [background] = useThemeColor(["background"]);
  const { mutateAsync: prefillMutateAsync } = usePrefillLocationMutation();
  const { mutateAsync: submitMutateAsync } = useSubmitVisitMutation();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const form = useAppForm({
    ...addVisitFormOptions,
    formId: ADD_VISIT_FORM_ID,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: zodOnDynamic(AddVisitFormSchema) },
    onSubmit: async ({ value }) => {
      try {
        await submitMutateAsync(value as AddVisitForm);
      } catch {
        // submit hook handles toast/error UI; keep this handler minimal.
      }
    },
  });

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

  const handleClose = () => {
    form.reset?.();
    setErrorMessage(undefined);
    router.back();
  };

  const prefillFromLocation = async () => {
    setErrorMessage(undefined);
    try {
      const result = await prefillMutateAsync();
      if (result.error) {
        setErrorMessage(result.error ?? undefined);
      } else if (result.coords) {
        await applyCoordinatesToForm(result.coords);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : i18n.t("home.add-visit.errors.location-failed");
      setErrorMessage(message);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    prefillFromLocation();
  }, []);

  const keyboardBehavior = Platform.select({
    ios: "padding",
    default: undefined,
  }) as "padding" | "height" | undefined;

  return (
    <form.AppForm>
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        className="flex-1"
        style={{ backgroundColor: background ?? "" }}
      >
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <Box className="px-5 pt-6" style={{ gap: 24, paddingBottom: 32 }}>
              <MediaImportCard form={form} />
              <CountrySelectField form={form} />
              <DateRangeSection form={form} />
              {errorMessage ? <ErrorBanner message={errorMessage} /> : null}
            </Box>
          </ScrollView>
          <form.SubscribeButton>
            {({
              isSubmitting,
              isSubmitDisabled,
              handleSubmit,
            }: AppSubscribeButtonRenderProps) => (
              <FooterActionBar
                isSubmitDisabled={isSubmitDisabled}
                isSubmitting={isSubmitting}
                onCancel={handleClose}
                onSubmit={() => void handleSubmit()}
              />
            )}
          </form.SubscribeButton>
        </View>
      </KeyboardAvoidingView>
    </form.AppForm>
  );
}
