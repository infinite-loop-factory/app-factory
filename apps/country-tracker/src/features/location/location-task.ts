import type { LocationObject } from "expo-location";

import { LOCATION_TASK_NAME } from "@/constants/location";
import * as TaskManager from "expo-task-manager";

type LocationTaskEvent = {
  data?: {
    locations: LocationObject[];
  };
  error?: Error;
};

TaskManager.defineTask<LocationTaskEvent>(
  LOCATION_TASK_NAME,
  ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }

    if (data.data) {
      // TODO: 서버 저장
    }
  },
);
