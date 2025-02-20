import { LOCATION_TASK_NAME } from "@/constants/location";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export async function startLocationTask() {
  // 포그라운드 권한 요청
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") {
    return;
  }

  // 백그라운드 권한 요청
  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== "granted") {
    return;
  }

  if (!(await TaskManager.isAvailableAsync())) {
    return;
  }

  const isTaskDefined =
    await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60 * 60 * 1000,
    });
  }
}

export async function stopLocationTask() {
  if (!(await TaskManager.isAvailableAsync())) {
    return;
  }

  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
}
