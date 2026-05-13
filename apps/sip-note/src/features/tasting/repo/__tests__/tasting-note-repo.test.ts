import type { TastingNoteRow } from "@/db/schema";

jest.mock("@/db/client", () => ({
  getDb: jest.fn(),
}));

import { getDb } from "@/db/client";
import { create, get, list, remove, update } from "../tasting-note-repo";

type MockDb = {
  runAsync: jest.Mock;
  getAllAsync: jest.Mock;
  getFirstAsync: jest.Mock;
  withTransactionAsync: jest.Mock;
};

let mockDb: MockDb;

const sampleRow: TastingNoteRow = {
  id: "note-1",
  category: "whiskey",
  name: "Lagavulin 16",
  score: 4.5,
  memo: "peaty",
  price: 18000,
  price_unit: "glass",
  date: 1_700_000_000_000,
  place_id: null,
  created_at: 1_700_000_000_000,
  updated_at: 1_700_000_000_000,
};

beforeEach(() => {
  mockDb = {
    runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 0 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    withTransactionAsync: jest
      .fn()
      .mockImplementation(async (fn: () => Promise<void>) => fn()),
  };
  (getDb as jest.Mock).mockResolvedValue(mockDb);
});

describe("tastingNoteRepo.create", () => {
  it("transaction 안에서 노트 + 태그 + 사진을 한 번에 insert 한다", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(sampleRow);

    await create({
      category: "whiskey",
      name: "Lagavulin 16",
      score: 4.5,
      memo: "peaty",
      date: 1_700_000_000_000,
      tags: ["smoky", "peat"],
      photos: ["file:///a.jpg", "file:///b.jpg"],
    });

    expect(mockDb.withTransactionAsync).toHaveBeenCalledTimes(1);
    const insertNoteCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("INSERT INTO tasting_notes"),
    );
    expect(insertNoteCall).toBeDefined();
    expect(insertNoteCall?.slice(2, 9)).toEqual([
      "whiskey",
      "Lagavulin 16",
      4.5,
      "peaty",
      null,
      null,
      1_700_000_000_000,
    ]);

    const tagInserts = mockDb.runAsync.mock.calls.filter((c) =>
      String(c[0]).startsWith("INSERT OR IGNORE INTO tasting_note_tags"),
    );
    expect(tagInserts).toHaveLength(2);
    expect(tagInserts.map((c) => c[2])).toEqual(["smoky", "peat"]);

    const photoInserts = mockDb.runAsync.mock.calls.filter((c) =>
      String(c[0]).startsWith("INSERT INTO tasting_note_photos"),
    );
    expect(photoInserts).toHaveLength(2);
    expect(photoInserts[0]?.slice(2)).toEqual(["file:///a.jpg", 0]);
    expect(photoInserts[1]?.slice(2)).toEqual(["file:///b.jpg", 1]);
  });
});

describe("tastingNoteRepo.get", () => {
  it("row 가 없으면 null", async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);
    expect(await get("missing")).toBeNull();
  });

  it("row 가 있으면 도메인 타입(camelCase) 으로 매핑하고 태그/사진을 합친다", async () => {
    mockDb.getFirstAsync.mockResolvedValue(sampleRow);
    mockDb.getAllAsync
      .mockResolvedValueOnce([
        { note_id: "note-1", tag: "smoky" },
        { note_id: "note-1", tag: "peat" },
      ])
      .mockResolvedValueOnce([
        { note_id: "note-1", uri: "file:///a.jpg", sort_order: 0 },
      ]);

    const note = await get("note-1");

    expect(note).toEqual({
      id: "note-1",
      category: "whiskey",
      name: "Lagavulin 16",
      score: 4.5,
      memo: "peaty",
      price: 18000,
      priceUnit: "glass",
      date: 1_700_000_000_000,
      placeId: null,
      tags: ["smoky", "peat"],
      photos: ["file:///a.jpg"],
      createdAt: 1_700_000_000_000,
      updatedAt: 1_700_000_000_000,
    });
  });
});

describe("tastingNoteRepo.update", () => {
  it("UPDATE 후 태그/사진을 모두 지우고 새로 insert 한다", async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(sampleRow);

    await update("note-1", {
      category: "whiskey",
      name: "Lagavulin 16 (revised)",
      score: 5,
      date: 1_700_000_000_000,
      tags: ["smoky"],
      photos: [],
    });

    const updateCall = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("UPDATE tasting_notes"),
    );
    expect(updateCall).toBeDefined();

    const deletedTags = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("DELETE FROM tasting_note_tags"),
    );
    const deletedPhotos = mockDb.runAsync.mock.calls.find((c) =>
      String(c[0]).startsWith("DELETE FROM tasting_note_photos"),
    );
    expect(deletedTags?.[1]).toBe("note-1");
    expect(deletedPhotos?.[1]).toBe("note-1");

    const reinsertedTags = mockDb.runAsync.mock.calls.filter((c) =>
      String(c[0]).startsWith("INSERT OR IGNORE INTO tasting_note_tags"),
    );
    expect(reinsertedTags.map((c) => c[2])).toEqual(["smoky"]);
  });

  it("UPDATE 결과 changes 가 0 이면 에러", async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });

    await expect(
      update("missing", {
        category: "whiskey",
        name: "x",
        date: 1,
      }),
    ).rejects.toThrow(/Tasting note not found/);
  });
});

describe("tastingNoteRepo.remove", () => {
  it("DELETE FROM tasting_notes WHERE id = ? 를 호출", async () => {
    await remove("note-1");
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "DELETE FROM tasting_notes WHERE id = ?",
      "note-1",
    );
  });
});

describe("tastingNoteRepo.list", () => {
  it("결과 row 가 있으면 태그/사진을 한 번에 fetch 해서 매핑", async () => {
    mockDb.getAllAsync
      .mockResolvedValueOnce([sampleRow])
      .mockResolvedValueOnce([{ note_id: "note-1", tag: "smoky" }])
      .mockResolvedValueOnce([
        { note_id: "note-1", uri: "file:///a.jpg", sort_order: 0 },
      ]);

    const result = await list({ category: "whiskey" });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("note-1");
    expect(result[0]?.tags).toEqual(["smoky"]);
    expect(result[0]?.photos).toEqual(["file:///a.jpg"]);
  });

  it("결과 row 가 없으면 빈 배열 반환 + 태그/사진 fetch 생략", async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]);

    const result = await list();

    expect(result).toEqual([]);
    expect(mockDb.getAllAsync).toHaveBeenCalledTimes(1);
  });
});
