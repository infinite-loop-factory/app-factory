import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

jest.mock("@/lib/supabase", () => {
  const getUser = jest.fn();
  return {
    __esModule: true,
    default: { auth: { getUser } },
    __mocks: { getUser },
  };
});

jest.mock("@/features/map/apis/fetch-year-summaries", () => {
  const fetchYearSummaries = jest.fn();
  return { fetchYearSummaries, __mocks: { fetchYearSummaries } };
});

jest.mock("@/features/widget/apis/widget-bridge", () => {
  const syncWidget = jest.fn();
  return { syncWidget, __mocks: { syncWidget } };
});

jest.mock("@/features/widget/utils/build-snapshot", () => {
  const buildWidgetSnapshot = jest.fn();
  return { buildWidgetSnapshot, __mocks: { buildWidgetSnapshot } };
});

import { renderHook, waitFor } from "@testing-library/react-native";
import { AppState } from "react-native";
import * as fetchYearSummariesModule from "@/features/map/apis/fetch-year-summaries";
import * as widgetBridgeModule from "@/features/widget/apis/widget-bridge";
import { useWidgetSync } from "@/features/widget/hooks/use-widget-sync";
import { EMPTY_SNAPSHOT } from "@/features/widget/types/widget-snapshot";
import * as buildSnapshotModule from "@/features/widget/utils/build-snapshot";
import * as supabaseModule from "@/lib/supabase";

type AnyMock = jest.Mock<(...args: never[]) => unknown>;

const mockGetUser = (
  supabaseModule as unknown as { __mocks: { getUser: AnyMock } }
).__mocks.getUser;
const mockFetchYearSummaries = (
  fetchYearSummariesModule as unknown as {
    __mocks: { fetchYearSummaries: AnyMock };
  }
).__mocks.fetchYearSummaries;
const mockSyncWidget = (
  widgetBridgeModule as unknown as { __mocks: { syncWidget: AnyMock } }
).__mocks.syncWidget;
const mockBuildSnapshot = (
  buildSnapshotModule as unknown as {
    __mocks: { buildWidgetSnapshot: AnyMock };
  }
).__mocks.buildWidgetSnapshot;

const flush = () => new Promise((resolve) => setImmediate(resolve));

describe("useWidgetSync", () => {
  let appStateListener: ((state: string) => void) | null = null;
  const removeListenerMock = jest.fn();
  let addEventListenerSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    mockGetUser.mockReset();
    mockFetchYearSummaries.mockReset();
    mockSyncWidget.mockReset();
    (mockSyncWidget as unknown as jest.Mock).mockResolvedValue(undefined);
    mockBuildSnapshot.mockReset();
    (mockBuildSnapshot as unknown as jest.Mock).mockReturnValue({
      marker: "built",
    });
    appStateListener = null;
    removeListenerMock.mockReset();

    addEventListenerSpy = jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation(((_event: string, cb: (state: string) => void) => {
        appStateListener = cb;
        return { remove: removeListenerMock } as { remove: () => void };
      }) as unknown as typeof AppState.addEventListener);
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
  });

  it("미인증 사용자 → EMPTY_SNAPSHOT으로 위젯 초기화", async () => {
    (mockGetUser as unknown as jest.Mock).mockResolvedValue({
      data: { user: null },
    });

    renderHook(() => useWidgetSync());

    await waitFor(() => expect(mockSyncWidget).toHaveBeenCalledTimes(1));
    expect(mockSyncWidget).toHaveBeenCalledWith(EMPTY_SNAPSHOT);
    expect(mockFetchYearSummaries).not.toHaveBeenCalled();
    expect(mockBuildSnapshot).not.toHaveBeenCalled();
  });

  it("인증 사용자 → fetchYearSummaries → buildWidgetSnapshot → syncWidget 파이프라인", async () => {
    (mockGetUser as unknown as jest.Mock).mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    (mockFetchYearSummaries as unknown as jest.Mock).mockResolvedValue([
      {
        country: "Japan",
        country_code: "jp",
        total_days: "5",
        visit_count: "2",
        latest_visit: "2024-05-01",
      },
    ]);

    renderHook(() => useWidgetSync());

    await waitFor(() => expect(mockSyncWidget).toHaveBeenCalledTimes(1));

    expect(mockFetchYearSummaries).toHaveBeenCalledWith("user-1", null);
    expect(mockBuildSnapshot).toHaveBeenCalledTimes(1);
    const normalized = (
      mockBuildSnapshot.mock.calls[0] as unknown[]
    )[0] as Array<{
      country: string;
      countryCode: string;
      totalDays: number;
      visitCount: number;
    }>;
    expect(normalized[0]).toMatchObject({
      country: "Japan",
      countryCode: "JP",
      totalDays: 5,
      visitCount: 2,
    });
    expect(mockSyncWidget).toHaveBeenCalledWith({ marker: "built" });
  });

  it("AppState가 active로 전환되면 재동기화 발생", async () => {
    (mockGetUser as unknown as jest.Mock).mockResolvedValue({
      data: { user: null },
    });

    renderHook(() => useWidgetSync());

    await waitFor(() => expect(mockSyncWidget).toHaveBeenCalledTimes(1));

    expect(appStateListener).not.toBeNull();
    appStateListener?.("active");

    await waitFor(() => expect(mockSyncWidget).toHaveBeenCalledTimes(2));
  });

  it("AppState background 전환은 재동기화하지 않음", async () => {
    (mockGetUser as unknown as jest.Mock).mockResolvedValue({
      data: { user: null },
    });

    renderHook(() => useWidgetSync());
    await waitFor(() => expect(mockSyncWidget).toHaveBeenCalledTimes(1));

    appStateListener?.("background");
    appStateListener?.("inactive");
    await flush();

    expect(mockSyncWidget).toHaveBeenCalledTimes(1);
  });

  it("언마운트 시 listener 해제", async () => {
    (mockGetUser as unknown as jest.Mock).mockResolvedValue({
      data: { user: null },
    });

    const { unmount } = renderHook(() => useWidgetSync());
    await waitFor(() => expect(mockSyncWidget).toHaveBeenCalledTimes(1));

    unmount();

    expect(removeListenerMock).toHaveBeenCalled();
  });

  it("supabase 에러는 삼키고 위젯 호출 없음 (best-effort)", async () => {
    (mockGetUser as unknown as jest.Mock).mockRejectedValue(
      new Error("network"),
    );

    renderHook(() => useWidgetSync());
    await flush();
    await flush();

    expect(mockSyncWidget).not.toHaveBeenCalled();
  });
});
