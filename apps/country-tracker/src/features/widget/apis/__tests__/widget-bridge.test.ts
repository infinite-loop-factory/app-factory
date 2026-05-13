import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("@bacons/apple-targets/build/ExtensionStorage", () => {
  const reloadWidget = jest.fn();
  const set = jest.fn();
  const get = jest.fn();
  const remove = jest.fn();
  class MockExtensionStorage {
    static reloadWidget = reloadWidget;
    set = set;
    get = get;
    remove = remove;
  }
  return {
    __esModule: true,
    ExtensionStorage: MockExtensionStorage,
    __mocks: { reloadWidget, set, get, remove },
  };
});

import type { WidgetSnapshot } from "@/features/widget/types/widget-snapshot";

import * as ExtensionStorageModule from "@bacons/apple-targets/build/ExtensionStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  readSnapshot,
  syncWidget,
  WIDGET_STORAGE_KEY,
} from "@/features/widget/apis/widget-bridge";
import { EMPTY_SNAPSHOT } from "@/features/widget/types/widget-snapshot";

type GetItemMock = jest.Mock<(key: string) => Promise<string | null>>;
type SetItemMock = jest.Mock<(key: string, value: string) => Promise<void>>;
type RemoveItemMock = jest.Mock<(key: string) => Promise<void>>;
type StorageSetMock = jest.Mock<(key: string, value: string) => void>;
type ReloadWidgetMock = jest.Mock<(name?: string) => void>;

const asyncStorage = AsyncStorage as unknown as {
  getItem: GetItemMock;
  setItem: SetItemMock;
  removeItem: RemoveItemMock;
};

const { __mocks: extensionMocks } = ExtensionStorageModule as unknown as {
  __mocks: {
    reloadWidget: ReloadWidgetMock;
    set: StorageSetMock;
    get: jest.Mock;
    remove: jest.Mock;
  };
};

const mockSnapshot: WidgetSnapshot = {
  totalCountries: 5,
  totalDays: 42,
  recent: [
    { code: "JP", flag: "🇯🇵", name: "Japan", days: 10 },
    { code: "FR", flag: "🇫🇷", name: "France", days: 7 },
  ],
  updatedAt: "2024-05-01T00:00:00.000Z",
};

describe("syncWidget", () => {
  beforeEach(() => {
    asyncStorage.getItem.mockReset();
    asyncStorage.setItem.mockReset();
    asyncStorage.setItem.mockResolvedValue(undefined);
    extensionMocks.reloadWidget.mockReset();
    extensionMocks.set.mockReset();
  });

  it("항상 AsyncStorage에 올바른 JSON을 저장한다", async () => {
    await syncWidget(mockSnapshot);

    expect(asyncStorage.setItem).toHaveBeenCalledWith(
      WIDGET_STORAGE_KEY,
      JSON.stringify(mockSnapshot),
    );
  });

  it("iOS에서 ExtensionStorage에 snapshot을 저장한다", async () => {
    await syncWidget(mockSnapshot);

    expect(extensionMocks.set).toHaveBeenCalledWith(
      "snapshot",
      JSON.stringify(mockSnapshot),
    );
  });

  it("iOS에서 ExtensionStorage.reloadWidget이 호출된다", async () => {
    await syncWidget(mockSnapshot);

    expect(extensionMocks.reloadWidget).toHaveBeenCalledWith("CountryWidget");
  });
});

describe("readSnapshot", () => {
  beforeEach(() => {
    asyncStorage.getItem.mockReset();
  });

  it("저장된 snapshot을 파싱하여 반환한다", async () => {
    asyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSnapshot));

    const result = await readSnapshot();

    expect(result.totalCountries).toBe(5);
    expect(result.totalDays).toBe(42);
    expect(result.recent).toHaveLength(2);
  });

  it("AsyncStorage에 데이터가 없으면 EMPTY_SNAPSHOT 반환", async () => {
    asyncStorage.getItem.mockResolvedValue(null);

    const result = await readSnapshot();

    expect(result).toEqual(EMPTY_SNAPSHOT);
  });

  it("JSON 파싱 실패 시 EMPTY_SNAPSHOT 반환", async () => {
    asyncStorage.getItem.mockResolvedValue("invalid-json{{{");

    const result = await readSnapshot();

    expect(result).toEqual(EMPTY_SNAPSHOT);
  });

  it("AsyncStorage 오류 시 EMPTY_SNAPSHOT 반환", async () => {
    asyncStorage.getItem.mockRejectedValue(new Error("storage error"));

    const result = await readSnapshot();

    expect(result).toEqual(EMPTY_SNAPSHOT);
  });
});
