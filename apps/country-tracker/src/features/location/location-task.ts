import type { LocationObject } from "expo-location";

import { LOCATION_TASK_NAME } from "@/constants/location";
import supabase from "@/libs/supabase";
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
        const rows = data.data.locations.map((loc: LocationObject) => ({
          user_id: user.id,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: new Date(loc.timestamp),
        }));
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
