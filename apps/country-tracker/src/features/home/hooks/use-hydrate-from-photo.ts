import { useMutation } from "@tanstack/react-query";
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import {
  extractCoordinatesFromExif,
  extractIsoDateFromExif,
  type GeoCoordinates,
} from "@/features/home/utils/exif";
import i18n from "@/libs/i18n";

export type PhotoHydrationResult = {
  coords?: GeoCoordinates;
  date?: string;
  error?: string;
};

export function useHydrateFromPhotoMutation() {
  return useMutation<PhotoHydrationResult, unknown, void>({
    mutationFn: async (): Promise<PhotoHydrationResult> => {
      try {
        const permission = await requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          return { error: i18n.t("home.add-visit.errors.photo-permission") };
        }

        const result = await launchImageLibraryAsync({
          mediaTypes: "images",
          allowsMultipleSelection: false,
          exif: true,
          quality: 0.8,
        });

        if (result.canceled || !result.assets?.[0]) {
          return {};
        }

        const asset = result.assets[0];
        const extractedCoords = extractCoordinatesFromExif(asset.exif);
        const photoDate = extractIsoDateFromExif(asset.exif);

        if (!extractedCoords) {
          return {
            date: photoDate ?? undefined,
            error: i18n.t("home.add-visit.errors.photo-no-location"),
          };
        }

        return { coords: extractedCoords, date: photoDate ?? undefined };
      } catch (error) {
        console.error("Failed to extract EXIF data", error);
        return { error: i18n.t("home.add-visit.errors.photo-failed") };
      }
    },
  });
}
