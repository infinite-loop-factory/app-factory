import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import {
  clearQueue,
  enqueueOperation,
  getPendingCount,
  getQueue,
  isOnline,
} from "@/utils/offline-queue";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<
  typeof AsyncStorage.getItem
>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<
  typeof AsyncStorage.setItem
>;
const mockRemoveItem = AsyncStorage.removeItem as jest.MockedFunction<
  typeof AsyncStorage.removeItem
>;
const mockGetNetworkState = Network.getNetworkStateAsync as jest.MockedFunction<
  typeof Network.getNetworkStateAsync
>;

const STORAGE_KEY = "visit-offline-queue";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("isOnline", () => {
  it("returns true when connected and internet is reachable", async () => {
    mockGetNetworkState.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: "WIFI" as Network.NetworkStateType,
    });

    const result = await isOnline();

    expect(result).toBe(true);
  });

  it("returns false when not connected", async () => {
    mockGetNetworkState.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
      type: "NONE" as Network.NetworkStateType,
    });

    const result = await isOnline();

    expect(result).toBe(false);
  });

  it("returns false when connected but internet is not reachable", async () => {
    mockGetNetworkState.mockResolvedValue({
      isConnected: true,
      isInternetReachable: false,
      type: "WIFI" as Network.NetworkStateType,
    });

    const result = await isOnline();

    expect(result).toBe(false);
  });

  it("returns true when getNetworkStateAsync throws (assumes online on error)", async () => {
    mockGetNetworkState.mockRejectedValue(new Error("network check failed"));

    const result = await isOnline();

    expect(result).toBe(true);
  });
});

describe("getQueue", () => {
  it("returns empty array when no items exist in storage", async () => {
    mockGetItem.mockResolvedValue(null);

    const queue = await getQueue();

    expect(queue).toEqual([]);
    expect(mockGetItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("returns parsed queue when storage contains items", async () => {
    const stored = [
      {
        id: "1234-abc",
        type: "insert",
        table: "visits",
        payload: { country_code: "jp" },
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    mockGetItem.mockResolvedValue(JSON.stringify(stored));

    const queue = await getQueue();

    expect(queue).toEqual(stored);
  });
});

describe("enqueueOperation", () => {
  it("appends a new operation to an existing queue", async () => {
    const existing = [
      {
        id: "existing-1",
        type: "insert" as const,
        table: "visits",
        payload: { country_code: "jp" },
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    mockGetItem.mockResolvedValue(JSON.stringify(existing));
    mockSetItem.mockResolvedValue(undefined);

    await enqueueOperation({
      type: "insert",
      table: "visits",
      payload: { country_code: "us" },
    });

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    const [calledKey, calledValue] = (mockSetItem as jest.Mock).mock
      .calls[0] as [string, string];
    expect(calledKey).toBe(STORAGE_KEY);

    const saved = JSON.parse(calledValue);
    expect(saved).toHaveLength(2);
    expect(saved[0].id).toBe("existing-1");
    expect(saved[1].type).toBe("insert");
    expect(saved[1].table).toBe("visits");
    expect(typeof saved[1].id).toBe("string");
    expect(typeof saved[1].createdAt).toBe("string");
  });

  it("creates the queue when storage is empty", async () => {
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);

    await enqueueOperation({
      type: "delete",
      table: "visits",
      payload: {},
      deleteParams: {
        userId: "user-1",
        countryCode: "jp",
        dateSet: ["2024-01-01"],
      },
    });

    const [, calledValue] = (mockSetItem as jest.Mock).mock.calls[0] as [
      string,
      string,
    ];
    const saved = JSON.parse(calledValue);
    expect(saved).toHaveLength(1);
    expect(saved[0].type).toBe("delete");
  });
});

describe("clearQueue", () => {
  it("removes the storage key", async () => {
    mockRemoveItem.mockResolvedValue(undefined);

    await clearQueue();

    expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});

describe("getPendingCount", () => {
  it("returns 0 when queue is empty", async () => {
    mockGetItem.mockResolvedValue(null);

    const count = await getPendingCount();

    expect(count).toBe(0);
  });

  it("returns correct count when queue has items", async () => {
    const stored = [
      {
        id: "1",
        type: "insert",
        table: "visits",
        payload: {},
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        type: "insert",
        table: "visits",
        payload: {},
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "3",
        type: "delete",
        table: "visits",
        payload: {},
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    mockGetItem.mockResolvedValue(JSON.stringify(stored));

    const count = await getPendingCount();

    expect(count).toBe(3);
  });
});
