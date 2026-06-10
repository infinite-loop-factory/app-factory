import AsyncStorage from "@react-native-async-storage/async-storage";
import { E2E_STORAGE_SEED, isE2E } from "@/lib/e2e-seed";

export async function prepareE2EStorage(): Promise<void> {
  if (!isE2E()) return;
  await Promise.all(
    Object.entries(E2E_STORAGE_SEED).map(([key, value]) =>
      AsyncStorage.setItem(key, value),
    ),
  );
}
