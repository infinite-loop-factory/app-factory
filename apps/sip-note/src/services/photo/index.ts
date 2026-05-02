import * as ImagePicker from "expo-image-picker";
import {
  requestCameraPermission,
  requestMediaLibraryPermission,
} from "./permissions";
import {
  buildPhotoFilename,
  compressAndSave,
  deletePhotoFile,
  getPhotoDir,
} from "./storage";

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
  exif: false,
};

export async function takePhoto(): Promise<string | null> {
  const granted = await requestCameraPermission();
  if (!granted) return null;
  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}

export async function pickPhoto(): Promise<string | null> {
  const granted = await requestMediaLibraryPermission();
  if (!granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}

export async function pickPhotos(max: number): Promise<string[]> {
  const granted = await requestMediaLibraryPermission();
  if (!granted) return [];
  const result = await ImagePicker.launchImageLibraryAsync({
    ...PICKER_OPTIONS,
    allowsMultipleSelection: true,
    selectionLimit: max,
  });
  if (result.canceled) return [];
  return result.assets.map((a) => a.uri);
}

export async function savePhotoToNote(
  srcUri: string,
  noteId: string,
  sortOrder: number,
): Promise<string> {
  const filename = buildPhotoFilename(noteId, sortOrder);
  const destPath = `${getPhotoDir()}${filename}`;
  await compressAndSave(srcUri, destPath);
  return destPath;
}

export async function removePhoto(uri: string): Promise<void> {
  await deletePhotoFile(uri);
}

export {
  requestCameraPermission,
  requestMediaLibraryPermission,
} from "./permissions";
