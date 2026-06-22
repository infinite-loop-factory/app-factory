jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  AndroidImportance: { DEFAULT: 5, HIGH: 6 },
  IosAuthorizationStatus: {
    NOT_DETERMINED: 0,
    DENIED: 1,
    AUTHORIZED: 2,
    PROVISIONAL: 3,
  },
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: {
    t: (key: string, opts?: { name?: string }) =>
      opts?.name ? `${key}|${opts.name}` : key,
  },
}));

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  getNotificationPermissionStatus,
  initNotifications,
  presentPlaceNotification,
  requestNotificationPermission,
} from "../index";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("initNotifications", () => {
  it("핸들러에 SDK 54 필수 필드(banner/list)를 설정한다", () => {
    initNotifications();
    expect(Notifications.setNotificationHandler).toHaveBeenCalledTimes(1);
    const handler = (Notifications.setNotificationHandler as jest.Mock).mock
      .calls[0][0];
    return handler.handleNotification().then((behavior: object) => {
      expect(behavior).toEqual({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      });
    });
  });
});

describe("requestNotificationPermission", () => {
  it("granted 면 true", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    expect(await requestNotificationPermission()).toBe(true);
  });

  it("granted 가 아니어도 iOS provisional 이면 true", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      ios: { status: Notifications.IosAuthorizationStatus.PROVISIONAL },
    });
    expect(await requestNotificationPermission()).toBe(true);
  });

  it("거부면 false", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
      ios: { status: Notifications.IosAuthorizationStatus.DENIED },
    });
    expect(await requestNotificationPermission()).toBe(false);
  });
});

describe("getNotificationPermissionStatus", () => {
  it("request 를 호출하지 않고 현재 상태만 조회한다", async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    expect(await getNotificationPermissionStatus()).toBe(true);
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });
});

describe("presentPlaceNotification", () => {
  it("placeId 를 data 에 싣고 이름을 본문에 보간한다", async () => {
    await presentPlaceNotification("place-9", "위스키 바");
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "notification.geofence.title",
        body: "notification.geofence.body|위스키 바",
        data: { type: "geofence", placeId: "place-9" },
      },
      trigger: null,
    });
  });
});

describe("web 가드", () => {
  const originalOS = Platform.OS;
  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("web 에서는 알림 API 를 호출하지 않는다", async () => {
    Platform.OS = "web";
    initNotifications();
    await presentPlaceNotification("p", "n");
    expect(await requestNotificationPermission()).toBe(false);
    expect(Notifications.setNotificationHandler).not.toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });
});
