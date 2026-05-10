import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { VISIT_QUEUE_STORAGE_KEY } from "@/constants/storage-keys";

export type QueuedOperation = {
  id: string;
  type: "insert" | "delete";
  table: string;
  payload: Record<string, unknown> | Record<string, unknown>[];
  createdAt: string;
  // For delete operations
  deleteParams?: {
    userId: string;
    countryCode: string;
    dateSet: string[];
  };
};

export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state?.isConnected) && state?.isInternetReachable !== false;
  } catch {
    return true; // assume online if can't check
  }
}

export async function enqueueOperation(
  op: Omit<QueuedOperation, "id" | "createdAt">,
): Promise<void> {
  const queue = await getQueue();
  queue.push({
    ...op,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  });
  await AsyncStorage.setItem(VISIT_QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

export async function getQueue(): Promise<QueuedOperation[]> {
  const raw = await AsyncStorage.getItem(VISIT_QUEUE_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(VISIT_QUEUE_STORAGE_KEY);
}

export async function getPendingCount(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}

async function processInsertOp(
  op: QueuedOperation,
  supabase: Awaited<typeof import("@/lib/supabase")>["default"],
): Promise<boolean> {
  const payload = Array.isArray(op.payload) ? op.payload : [op.payload];
  const { error } = await supabase.from(op.table).insert(payload);
  if (!error) return true;
  // Duplicate (conflict) — treat as success
  if (error.code === "23505") return true;
  throw error;
}

async function processDeleteOp(op: QueuedOperation): Promise<boolean> {
  if (!op.deleteParams) return false;
  const { deleteVisitDays } = await import("@/features/home/apis/delete-visit");
  await deleteVisitDays(op.deleteParams);
  return true;
}

export async function flushVisitQueue(): Promise<{
  flushed: number;
  failed: number;
}> {
  const online = await isOnline();
  if (!online) return { flushed: 0, failed: 0 };

  const queue = await getQueue();
  if (queue.length === 0) return { flushed: 0, failed: 0 };

  const { default: supabase } = await import("@/lib/supabase");

  let flushed = 0;
  let failed = 0;
  const remaining: QueuedOperation[] = [];

  for (const op of queue) {
    try {
      const ok =
        op.type === "insert"
          ? await processInsertOp(op, supabase)
          : await processDeleteOp(op);
      if (ok) flushed++;
    } catch {
      failed++;
      remaining.push(op);
    }
  }

  if (remaining.length > 0) {
    await AsyncStorage.setItem(
      VISIT_QUEUE_STORAGE_KEY,
      JSON.stringify(remaining),
    );
  } else {
    await clearQueue();
  }

  return { flushed, failed };
}
