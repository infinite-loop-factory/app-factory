import type { AddVisitForm } from "@/features/home/constants/add-visit-form-schema";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  fetchExistingByDateMap,
  insertManualEntries,
} from "@/features/home/apis/add-visit";
import { COUNTRY_OPTION_MAP } from "@/features/home/utils/country-options";
import { ensureValidForm } from "@/features/home/utils/form-validation";
import { filterDuplicateDates } from "@/features/home/utils/payload-builder";
import { getCountryCentroid } from "@/features/map/utils/polygon-centroid";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useGlobalToast } from "@/hooks/use-global-toast";
import i18n from "@/libs/i18n";
import { toUtcBoundaryTimestamp } from "@/utils/date-range";

export type Result = {
  count: number;
  skipped: number;
};

export function useSubmitVisitMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useGlobalToast();
  const { user } = useAuthUser();

  return useMutation({
    mutationFn: async (vars: AddVisitForm): Promise<Result> => {
      const {
        selectedCountry,
        countryNameOverride,
        startDate,
        endDate,
        coords,
      } = vars;
      const isRangeInvalidValue = false; // validation will be handled by ensureValidForm

      const { userId, countryCode, rangeDates } = ensureValidForm({
        user,
        selectedCountry,
        startDate,
        endDate,
        isRangeInvalid: isRangeInvalidValue,
      });

      const zoneName = DateTime.local().zoneName;
      const rangeStartUtc = toUtcBoundaryTimestamp(
        startDate,
        zoneName,
        "start",
      );
      const rangeEndUtc = toUtcBoundaryTimestamp(endDate, zoneName, "end");

      const existingByDate = await fetchExistingByDateMap({
        userId,
        rangeStartUtc,
        rangeEndUtc,
        zoneName,
      });

      const filteredDates = filterDuplicateDates(
        rangeDates,
        countryCode,
        existingByDate,
      );
      if (!filteredDates.length) {
        throw new Error(i18n.t("home.add-visit.errors.duplicates-only"));
      }

      const resolvedCountryName =
        countryNameOverride ??
        COUNTRY_OPTION_MAP.get(countryCode)?.label ??
        countryCode;

      const referenceCoords = coords ??
        getCountryCentroid(countryCode) ?? { latitude: 0, longitude: 0 };

      const payload = (
        await import("@/features/home/utils/payload-builder")
      ).buildInsertPayload({
        dates: filteredDates,
        referenceCoords,
        userId,
        countryCode,
        displayCountry: resolvedCountryName,
        zoneName,
      });

      await insertManualEntries(payload);
      return {
        count: payload.length,
        skipped: rangeDates.length - payload.length,
      };
    },
    onSuccess: (result) => {
      showToast(
        "success",
        i18n.t("home.add-visit.toast.success-title"),
        i18n.t("home.add-visit.toast.success-description", {
          count: result.count,
        }),
      );
      if (result.skipped > 0) {
        showToast(
          "info",
          i18n.t("home.add-visit.toast.partial-title"),
          i18n.t("home.add-visit.toast.partial-description", {
            count: result.skipped,
          }),
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["location", "visited-countries"],
      });
      queryClient.invalidateQueries({ queryKey: ["map", "visited-countries"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : i18n.t("home.add-visit.toast.error-description");
      showToast("error", i18n.t("home.add-visit.toast.error-title"), message);
    },
  });
}
