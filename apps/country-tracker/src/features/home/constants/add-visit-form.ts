import type { AddVisitForm } from "@/features/home/constants/add-visit-form-schema";
import type { GeoCoordinates } from "@/features/home/utils/exif";

import { formOptions } from "@tanstack/react-form";
import { DateTime } from "luxon";

// Visit form state shape used as defaults across the feature
export interface VisitState {
  selectedCountry: string | null;
  startDate: string;
  endDate: string;
  sameDay: boolean;
  countryNameOverride: string | undefined;
  coords: GeoCoordinates | null;
}

// Default values for the visit form
export const initialVisitState: VisitState = {
  selectedCountry: null,
  startDate: DateTime.local().toISODate() || "",
  endDate: DateTime.local().toISODate() || "",
  sameDay: true,
  countryNameOverride: undefined,
  coords: null,
};

// Form ID constant to identify the Add Visit form for `useForm`
export const ADD_VISIT_FORM_ID = "add-visit-form";

// Default range in days used when a date range is unspecified
export const DEFAULT_RANGE_DAYS = 1;

// Form options for the Add Visit form — kept here to live alongside the visit
// defaults so consumers can import a single constants module.
export const addVisitFormOptions = formOptions({
  defaultValues: {
    ...initialVisitState,
  } satisfies AddVisitForm,
});
