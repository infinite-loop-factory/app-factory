import { DateTime } from "luxon";

type BaseFormatOptions = {
  format?: string;
  zone?: string;
};

type FormatIsoDateOptions<TFallback = string> = BaseFormatOptions & {
  fallback?: TFallback;
};

function createDateTime(isoString: string, zone?: string) {
  const config = zone ? { zone } : undefined;
  return DateTime.fromISO(isoString, config);
}

export function formatIsoDate(
  isoString: string,
  options?: FormatIsoDateOptions,
): string;

export function formatIsoDate<TFallback>(
  isoString: string,
  options: FormatIsoDateOptions<TFallback>,
): string | TFallback;

export function formatIsoDate<TFallback = string>(
  isoString: string,
  options: FormatIsoDateOptions<TFallback> = {},
): string | TFallback {
  const { format = "yyyy-MM-dd", fallback, zone } = options;
  const dt = createDateTime(isoString, zone);
  if (!dt.isValid) {
    if (fallback !== undefined) {
      return fallback;
    }
    return isoString as string | TFallback;
  }
  return dt.toFormat(format);
}
