import type { AppSubscribeButtonRenderProps } from "@/components/subscribe-button";
import type { GeoCoordinates } from "@/features/home/utils/exif";

import { revalidateLogic } from "@tanstack/react-form";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
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
import i18n from "@/libs/i18n";
import { zodOnDynamic } from "@/utils/zod-on-dynamic";

export function AddVisitScreen() {
  const { mutateAsync: prefillMutateAsync } = usePrefillLocationMutation();
  const { mutateAsync: submitMutateAsync } = useSubmitVisitMutation();
  const colorScheme = useColorScheme();

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

  const insets = useSafeAreaInsets();

  return (
    <form.AppForm>
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        className="flex-1 bg-background-light dark:bg-background-dark"
      >
        <View className="flex-1">
          {/* Header */}
          <View
            className="z-10 flex-row items-center justify-between bg-background-light px-4 pb-4 dark:bg-background-dark"
            style={{ paddingTop: insets.top + 16 }}
          >
            <Pressable
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700"
              onPress={handleClose}
            >
              <ChevronLeft
                color={colorScheme === "dark" ? "white" : "#0f172a"}
                size={20}
              />
            </Pressable>
            <Text className="text-center font-bold text-lg text-slate-900 leading-tight tracking-tight dark:text-white">
              {i18n.t("home.add-visit.title") ?? "Add a New Visit"}
            </Text>
            <View className="size-10" />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <View className="flex flex-col gap-6 px-4 py-2">
              <MediaImportCard form={form} />
              <CountrySelectField form={form} />
              <DateRangeSection form={form} />
              {errorMessage ? <ErrorBanner message={errorMessage} /> : null}
            </View>
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
