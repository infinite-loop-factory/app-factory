import type { LocationObject } from "expo-location";

import { LOCATION_TASK_NAME } from "@/constants/location";
import supabase from "@/libs/supabase";
import { getCountryByLatLng } from "@/utils/reverse-geo";
import * as TaskManager from "expo-task-manager";

type LocationTaskEvent = {
  data?: {
    locations: LocationObject[];
  };
  error?: Error;
};

TaskManager.defineTask<LocationTaskEvent>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }

    if (data?.data?.locations) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;
        const rows = await Promise.all(
          data.data.locations.map(async (loc: LocationObject) => {
            const {
              coords: { latitude, longitude },
              timestamp,
            } = loc;

            const { country, countryCode } = await getCountryByLatLng(
              latitude,
              longitude,
            );
            return {
              user_id: user.id,
              latitude,
              longitude,
              timestamp: new Date(timestamp),
              country,
              country_code: countryCode,
            };
          }),
        );

        if (rows.length > 0) {
          const { error } = await supabase.from("locations").insert(rows);
          if (error) {
            console.error("Failed to insert locations:", error);
          }
        }
      } catch (err) {
        console.error("Unexpected error during location insert:", err);
      }
    }
  },
);
