import { DateTime } from "luxon";
import { z } from "zod";

export const AddVisitFormSchema = z.object({
  selectedCountry: z.string().nullable(),
  // Keep runtime behavior: value may be absent/undefined; for TS we expose
  // a shape where the key exists but may be `undefined`.
  countryNameOverride: z.string().optional(),
  startDate: z.string().refine((val) => DateTime.fromISO(val).isValid, {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((val) => DateTime.fromISO(val).isValid, {
    message: "Invalid end date",
  }),
  sameDay: z.boolean(),
  coords: z.object({ latitude: z.number(), longitude: z.number() }).nullable(),
});

export type AddVisitForm = z.infer<typeof AddVisitFormSchema>;
