jest.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///doc/",
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  moveAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: { JPEG: "jpeg" },
}));

import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import {
  buildPhotoFilename,
  compressAndSave,
  deletePhotoFile,
  ensurePhotoDir,
  getPhotoDir,
} from "../storage";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("buildPhotoFilename", () => {
  it("sortOrder 를 3 자리로 패딩하고 기본 jpg 확장자", () => {
    expect(buildPhotoFilename("note-1", 0)).toBe("note-1-000.jpg");
    expect(buildPhotoFilename("note-1", 12)).toBe("note-1-012.jpg");
  });

  it("확장자 지정 가능", () => {
    expect(buildPhotoFilename("note-1", 0, "png")).toBe("note-1-000.png");
  });
});

describe("getPhotoDir", () => {
  it("documentDirectory 하위에 photos/ 디렉토리", () => {
    expect(getPhotoDir()).toBe("file:///doc/photos/");
  });
});

describe("ensurePhotoDir", () => {
  it("디렉토리 없으면 intermediates 옵션으로 생성", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

    await ensurePhotoDir();

    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
      "file:///doc/photos/",
      { intermediates: true },
    );
  });

  it("이미 존재하면 생성 생략", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

    await ensurePhotoDir();

    expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
  });
});

describe("compressAndSave", () => {
  it("1600px 폭 리사이즈 + 0.85 압축 + JPEG 로 manipulate 후 dest 로 이동", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: "file:///tmp/compressed.jpg",
    });

    await compressAndSave(
      "file:///src.jpg",
      "file:///doc/photos/note-1-000.jpg",
    );

    expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
      "file:///src.jpg",
      [{ resize: { width: 1600 } }],
      { compress: 0.85, format: "jpeg" },
    );
    expect(FileSystem.moveAsync).toHaveBeenCalledWith({
      from: "file:///tmp/compressed.jpg",
      to: "file:///doc/photos/note-1-000.jpg",
    });
  });
});

describe("deletePhotoFile", () => {
  it("파일이 존재하면 idempotent 옵션으로 삭제", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

    await deletePhotoFile("file:///doc/photos/note-1-000.jpg");

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///doc/photos/note-1-000.jpg",
      { idempotent: true },
    );
  });

  it("파일이 없으면 deleteAsync 호출 생략", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });

    await deletePhotoFile("file:///doc/photos/missing.jpg");

    expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
  });
});
