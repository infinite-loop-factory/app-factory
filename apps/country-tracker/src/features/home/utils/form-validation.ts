import type { User } from "@supabase/supabase-js";

import i18n from "@/libs/i18n";
import { buildIsoDateRange } from "@/utils/date-range";

export function ensureValidForm(params: {
  user: User | null;
  selectedCountry: string | null;
  startDate: string;
  endDate: string;
  isRangeInvalid: boolean;
}) {
  const { user, selectedCountry, startDate, endDate, isRangeInvalid } = params;
  if (!user) throw new Error(i18n.t("home.add-visit.errors.no-user"));
  if (!selectedCountry)
    throw new Error(i18n.t("home.add-visit.errors.no-country"));
  if (!(startDate && endDate))
    throw new Error(i18n.t("home.add-visit.errors.no-dates"));
  if (isRangeInvalid) {
    throw new Error(i18n.t("home.add-visit.errors.invalid-range"));
  }
  const rangeDates = buildIsoDateRange(startDate, endDate);
  if (!rangeDates.length)
    throw new Error(i18n.t("home.add-visit.errors.invalid-range"));
  return { userId: user.id, countryCode: selectedCountry, rangeDates };
}
