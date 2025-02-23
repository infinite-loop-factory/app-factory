import { useOrderStore } from "@/features/order/store/order.store";
import { supabase } from "@/supabase/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEmpty } from "es-toolkit/compat";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    const orderId = await AsyncStorage.getItem("orderId");

    if (error || !data || !orderId)
      return console.error("🚨 백그라운드 위치 추적 오류:", error);

    const orderStatus = await supabase
      .from("order")
      .select("id, order_status(status), driver_location(id)")
      .order("created_at", {
        ascending: true,
        referencedTable: "driver_location",
      })
      .limit(1, { referencedTable: "driver_location" })
      .eq("order_status.status", "DURING_DELIVERY")
      .eq("id", +orderId)
      .single();

    if (orderStatus.error) return console.error("🚨 에러발생");
    if (isEmpty(orderStatus.data.order_status)) {
      console.error("배송이 완료되었습니다.");
      return stopBackgroundLocationTracking();
    }

    const {
      locations: [locations],
    } = data;

    const { latitude = 0, longitude = 0 } = locations?.coords ?? {};

    const driver = orderStatus.data.driver_location[0];
    if (!driver) return console.error("🚨 에러발생");

    await supabase
      .from("driver_location")
      .update({ lat: latitude, lon: longitude })
      .eq("id", driver.id);
  },
);

export async function startBackgroundLocationTracking() {
  const { order } = useOrderStore.getState();

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted")
    return console.error("🚨 포그라운드 위치 권한이 필요합니다!");

  const { status: bgS } = await Location.requestBackgroundPermissionsAsync();
  if (bgS !== "granted")
    return console.error("🚨 백그라운드 위치 권한이 필요합니다!");

  const isTracking =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (!isTracking) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 5,
      foregroundService: {
        notificationTitle: "위치 추적 중...",
        notificationBody: "운행 중 위치를 계속 업데이트합니다.",
      },
    });
    await AsyncStorage.setItem("orderId", `${order?.id}`);
    setTimeout(stopBackgroundLocationTracking, 2 * 60 * 60 * 1000);
  }
}

export async function stopBackgroundLocationTracking() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  await AsyncStorage.removeItem("orderId");
}
