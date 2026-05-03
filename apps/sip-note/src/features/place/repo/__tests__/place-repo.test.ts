import type { PlaceRow } from "@/db/schema";

jest.mock("@/db/client", () => ({
  getDb: jest.fn(),
}));

import { getDb } from "@/db/client";
import {
  create,
  get,
  incrementVisitCount,
  list,
  remove,
  toggleWishlist,
  update,
} from "../place-repo";

type MockDb = {
  runAsync: jest.Mock;
  getAllAsync: jest.Mock;
  getFirstAsync: jest.Mock;
};

let mockDb: MockDb;

const sampleRow: PlaceRow = {
  id: "place-1",
  name: "The Pot Still",
  category: "bar",
  latitude: 55.86,
  longitude: -4.255,
  address: "154 Hope St, Glasgow",
  is_wishlist: 0,
  visit_count: 3,
  created_at: 1_700_000_000_000,
  updated_at: 1_700_000_000_000,
};

beforeEach(() => {
  mockDb = {
    runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 0 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
  };
  (getDb as jest.Mock).mockResolvedValue(mockDb);
});

describe("placeRepo.create", () => {
  it("INSERT 후 새로 fetch 한 row 를 도메인 타입으로 반환", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(sampleRow);

    const place = await create({
      name: "The Pot Still",
      category: "bar",
      latitude: 55.86,
      longitude: -4.255,
      address: "154 Hope St, Glasgow",
    });

    const insertCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("INSERT INTO places"),
    );
    expect(insertCall).toBeDefined();
    expect(insertCall?.slice(2, 8)).toEqual([
      "The Pot Still",
      "bar",
      55.86,
      -4.255,
      "154 Hope St, Glasgow",
      0, // is_wishlist 기본값 false → 0
    ]);

    expect(place).toEqual({
      id: "place-1",
      name: "The Pot Still",
      category: "bar",
      latitude: 55.86,
      longitude: -4.255,
      address: "154 Hope St, Glasgow",
      isWishlist: false,
      visitCount: 3,
      createdAt: 1_700_000_000_000,
      updatedAt: 1_700_000_000_000,
    });
  });

  it("isWishlist 옵션 true 면 1 로 저장", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      ...sampleRow,
      is_wishlist: 1,
    });

    await create({ name: "x", isWishlist: true });

    const insertCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("INSERT INTO places"),
    );
    expect(insertCall?.[7]).toBe(1);
  });
});

describe("placeRepo.get", () => {
  it("row 가 없으면 null", async () => {
    expect(await get("missing")).toBeNull();
  });

  it("row 가 있으면 isWishlist boolean 으로 매핑", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      ...sampleRow,
      is_wishlist: 1,
    });
    const place = await get("place-1");
    expect(place?.isWishlist).toBe(true);
  });
});

describe("placeRepo.update", () => {
  it("changes 가 0 이면 에러", async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });
    await expect(update("missing", { name: "x" })).rejects.toThrow(
      /Place not found/,
    );
  });
});

describe("placeRepo.remove", () => {
  it("DELETE FROM places WHERE id = ? 호출", async () => {
    await remove("place-1");
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "DELETE FROM places WHERE id = ?",
      "place-1",
    );
  });
});

describe("placeRepo.list", () => {
  it("rows 를 도메인 타입 배열로 매핑", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      sampleRow,
      { ...sampleRow, id: "place-2", is_wishlist: 1 },
    ]);

    const result = await list();

    expect(result).toHaveLength(2);
    expect(result[0]?.id).toBe("place-1");
    expect(result[0]?.isWishlist).toBe(false);
    expect(result[1]?.isWishlist).toBe(true);
  });

  it("빈 결과는 빈 배열", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]);
    expect(await list({ category: "winery" })).toEqual([]);
  });
});

describe("placeRepo.toggleWishlist", () => {
  it("UPDATE … CASE is_wishlist 토글 SQL 호출 후 row 재조회", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      ...sampleRow,
      is_wishlist: 1,
    });
    const place = await toggleWishlist("place-1");

    const updateCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).includes("CASE is_wishlist"),
    );
    expect(updateCall).toBeDefined();
    expect(place.isWishlist).toBe(true);
  });

  it("changes 0 이면 에러", async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });
    await expect(toggleWishlist("missing")).rejects.toThrow(/Place not found/);
  });
});

describe("placeRepo.incrementVisitCount", () => {
  it("visit_count + 1 SQL 호출", async () => {
    await incrementVisitCount("place-1");
    const call = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).includes("visit_count = visit_count + 1"),
    );
    expect(call).toBeDefined();
  });

  it("changes 0 이면 에러", async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });
    await expect(incrementVisitCount("missing")).rejects.toThrow(
      /Place not found/,
    );
  });
});
