import type { ImagePickerAsset } from "expo-image-picker";

import { DateTime } from "luxon";

export type GeoCoordinates = {
  latitude: number;
  longitude: number;
};

type ExifLike = ImagePickerAsset["exif"];

type CoordinateValue = number | string | Array<number | null | undefined>;

function toDecimalDegrees(value: CoordinateValue, ref?: string): number | null {
  if (value == null) return null;
  const applyRef = (num: number) =>
    ref === "S" || ref === "W" ? -Math.abs(num) : num;

  if (Array.isArray(value)) {
    const [deg, min, sec] = value;
    if (
      typeof deg === "number" &&
      typeof min === "number" &&
      typeof sec === "number"
    ) {
      const decimal = deg + min / 60 + sec / 3600;
      return applyRef(decimal);
    }
  }

  if (typeof value === "number") {
    return applyRef(value);
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return applyRef(numeric);
    }
  }

  return null;
}

function getExifField<T>(
  exif: ExifLike,
  ...keys: Array<string>
): T | undefined {
  if (!exif) return undefined;
  for (const key of keys) {
    if (key in exif) {
      return exif[key as keyof typeof exif] as T;
    }
  }
  return undefined;
}

export function extractCoordinatesFromExif(
  exif: ExifLike,
): GeoCoordinates | null {
  if (!exif) return null;
  const latValue = getExifField<CoordinateValue>(
    exif,
    "GPSLatitude",
    "gpsLatitude",
    "{GPS}Latitude",
  );
  const latRef = getExifField<string>(
    exif,
    "GPSLatitudeRef",
    "gpsLatitudeRef",
    "{GPS}LatitudeRef",
  );
  const lonValue = getExifField<CoordinateValue>(
    exif,
    "GPSLongitude",
    "gpsLongitude",
    "{GPS}Longitude",
  );
  const lonRef = getExifField<string>(
    exif,
    "GPSLongitudeRef",
    "gpsLongitudeRef",
    "{GPS}LongitudeRef",
  );

  const latitude = latValue ? toDecimalDegrees(latValue, latRef) : null;
  const longitude = lonValue ? toDecimalDegrees(lonValue, lonRef) : null;

  if (typeof latitude === "number" && typeof longitude === "number") {
    return { latitude, longitude };
  }
  return null;
}

export function extractIsoDateFromExif(exif: ExifLike): string | null {
  if (!exif) return null;
  const raw = getExifField<string>(
    exif,
    "DateTimeOriginal",
    "DateTime",
    "{Exif}DateTimeOriginal",
    "{Exif}DateTime",
    "CreatedDate",
  );
  if (!raw) return null;
  const normalized = raw.replace(/\.\d+$/, "");
  const formats = [
    "yyyy:MM:dd HH:mm:ss",
    "yyyy-MM-dd HH:mm:ss",
    "yyyy:MM:dd",
    "yyyy-MM-dd",
  ];
  for (const format of formats) {
    const dt = DateTime.fromFormat(normalized, format);
    if (dt.isValid) {
      return dt.toISODate();
    }
  }
  const iso = DateTime.fromISO(normalized);
  return iso.isValid ? iso.toISODate() : null;
}
