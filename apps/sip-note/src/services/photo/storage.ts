import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

const PHOTO_DIR_NAME = "photos";

export function getPhotoDir(): string {
  return `${FileSystem.documentDirectory}${PHOTO_DIR_NAME}/`;
}

export function buildPhotoFilename(
  noteId: string,
  sortOrder: number,
  ext = "jpg",
): string {
  const padded = String(sortOrder).padStart(3, "0");
  return `${noteId}-${padded}.${ext}`;
}

export async function ensurePhotoDir(): Promise<void> {
  const dir = getPhotoDir();
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function compressAndSave(
  srcUri: string,
  destPath: string,
): Promise<void> {
  await ensurePhotoDir();
  const result = await ImageManipulator.manipulateAsync(
    srcUri,
    [{ resize: { width: 1600 } }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
  );
  await FileSystem.moveAsync({ from: result.uri, to: destPath });
}

export async function deletePhotoFile(uri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}
