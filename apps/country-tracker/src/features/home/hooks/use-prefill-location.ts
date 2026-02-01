import type { GeoCoordinates } from "@/features/home/utils/exif";

import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import i18n from "@/lib/i18n";

export type PrefillResult = {
  coords?: GeoCoordinates;
  error?: string;
};

/**
 * Hook that encapsulates the location-prefill flow as a React Query mutation.
 * The implementation was moved here from the former util so callers only need
 * to depend on the hook's stable API (mutate/mutateAsync, isPending, error).
 */
export function usePrefillLocationMutation() {
  return useMutation<PrefillResult, unknown, void>({
    mutationFn: async (): Promise<PrefillResult> => {
      const currentPermission = await Location.getForegroundPermissionsAsync();
      let granted =
        currentPermission.status === Location.PermissionStatus.GRANTED;
      if (!granted) {
        const requested = await Location.requestForegroundPermissionsAsync();
        granted = requested.status === Location.PermissionStatus.GRANTED;
      }
      if (!granted) {
        return { error: i18n.t("home.add-visit.errors.location-denied") };
      }

      try {
        const latest =
          (await Location.getLastKnownPositionAsync()) ??
          (await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }));

        if (!latest) {
          return { error: i18n.t("home.add-visit.errors.location-failed") };
        }

        const { latitude, longitude } = latest.coords;
        return { coords: { latitude, longitude } };
      } catch (error) {
        console.error("Failed to fetch current location", error);
        return { error: i18n.t("home.add-visit.errors.location-failed") };
      }
    },
  });
}
