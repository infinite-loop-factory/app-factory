import { Platform } from "react-native";

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  try {
    const Notifications = await import("expo-notifications");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export async function scheduleVisaAlert(params: {
  countryCode: string;
  countryName: string;
  daysRemaining: number;
}): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const Notifications = await import("expo-notifications");
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    // Cancel existing notification for this country
    const identifier = `visa-alert-${params.countryCode}`;
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(
      (_e) => {
        /* ignore cancellation error */
      },
    );

    if (params.daysRemaining <= 0) {
      // Already exceeded — send immediate notification
      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: `Visa limit exceeded: ${params.countryName}`,
          body: `You have exceeded your visa-free stay limit in ${params.countryName}.`,
          data: { countryCode: params.countryCode },
        },
        trigger: null, // immediate
      });
    } else {
      // Schedule for N days from now
      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: `Visa alert: ${params.countryName}`,
          body: `${params.daysRemaining} days remaining on your visa-free stay in ${params.countryName}.`,
          data: { countryCode: params.countryCode },
        },
        trigger: {
          type: "timeInterval" as never,
          seconds: params.daysRemaining * 86400,
          repeats: false,
        } as never,
      });
    }
  } catch {
    // Silently fail
  }
}
