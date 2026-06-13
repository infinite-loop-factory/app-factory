import type { PlaceRow } from "@/db/schema";

jest.mock("@/db/client", () => ({
  getDb: jest.fn(),
}));

import { getDb } from "@/db/client";
import {
  create,
  get,
  getVisitTotals,
  incrementVisitCount,
  list,
  listCityVisitStats,
  listPlaceVisitStats,
  listRegionVisitStats,
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
  city: "Glasgow",
  region: "Scotland",
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
      city: "Glasgow",
      region: "Scotland",
    });

    const insertCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("INSERT INTO places"),
    );
    expect(insertCall).toBeDefined();
    expect(insertCall?.slice(2, 10)).toEqual([
      "The Pot Still",
      "bar",
      55.86,
      -4.255,
      "154 Hope St, Glasgow",
      "Glasgow",
      "Scotland",
      0, // is_wishlist 기본값 false → 0
    ]);

    expect(place).toEqual({
      id: "place-1",
      name: "The Pot Still",
      category: "bar",
      latitude: 55.86,
      longitude: -4.255,
      address: "154 Hope St, Glasgow",
      city: "Glasgow",
      region: "Scotland",
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
    expect(insertCall?.[9]).toBe(1);
  });

  it("city/region 미지정 시 null 로 저장", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(sampleRow);

    await create({ name: "x" });

    const insertCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("INSERT INTO places"),
    );
    expect(insertCall?.[7]).toBeNull(); // city
    expect(insertCall?.[8]).toBeNull(); // region
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

describe("placeRepo.listCityVisitStats", () => {
  it("rows 를 카멜케이스 도메인 타입으로 매핑", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      { city: "Glasgow", place_count: 2, visit_count: 5, note_count: 7 },
      { city: null, place_count: 1, visit_count: 0, note_count: 0 },
    ]);

    const stats = await listCityVisitStats();

    expect(stats).toEqual([
      { city: "Glasgow", placeCount: 2, visitCount: 5, noteCount: 7 },
      { city: null, placeCount: 1, visitCount: 0, noteCount: 0 },
    ]);
  });

  it("filter 의 category 는 SQL 파라미터로 전달", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]);
    await listCityVisitStats({ category: "winery" });
    const [, ...params] = mockDb.getAllAsync.mock.calls[0] ?? [];
    expect(params).toEqual(["winery"]);
  });
});

describe("placeRepo.listRegionVisitStats", () => {
  it("region null 도 그대로 매핑", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      { region: "Scotland", place_count: 3, visit_count: 9, note_count: 11 },
    ]);

    const stats = await listRegionVisitStats();

    expect(stats).toEqual([
      {
        region: "Scotland",
        placeCount: 3,
        visitCount: 9,
        noteCount: 11,
      },
    ]);
  });
});

describe("placeRepo.listPlaceVisitStats", () => {
  it("place 단위 visit/note count 매핑", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      {
        id: "place-1",
        name: "The Pot Still",
        category: "bar",
        city: "Glasgow",
        region: "Scotland",
        visit_count: 3,
        note_count: 4,
      },
    ]);

    const stats = await listPlaceVisitStats();

    expect(stats).toEqual([
      {
        id: "place-1",
        name: "The Pot Still",
        category: "bar",
        city: "Glasgow",
        region: "Scotland",
        visitCount: 3,
        noteCount: 4,
      },
    ]);
  });
});

describe("placeRepo.getVisitTotals", () => {
  it("totals row 를 카멜케이스로 매핑", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      total_cities: 4,
      total_regions: 2,
      total_places: 12,
      total_visits: 38,
      total_notes: 50,
    });

    const totals = await getVisitTotals();

    expect(totals).toEqual({
      totalCities: 4,
      totalRegions: 2,
      totalPlaces: 12,
      totalVisits: 38,
      totalNotes: 50,
    });
  });

  it("row 가 null 이면 모두 0", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    expect(await getVisitTotals()).toEqual({
      totalCities: 0,
      totalRegions: 0,
      totalPlaces: 0,
      totalVisits: 0,
      totalNotes: 0,
    });
  });
});
