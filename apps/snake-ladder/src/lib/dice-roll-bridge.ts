let pending: ((value: number) => void) | null = null;
let rejecter: ((error: Error) => void) | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

export function waitForDiceAnimation(timeoutMs = 12_000): Promise<number> {
  return new Promise((resolve, reject) => {
    if (pending) {
      reject(new Error("dice animation already pending"));
      return;
    }
    pending = resolve;
    rejecter = reject;
    timeoutId = setTimeout(() => {
      pending = null;
      rejecter = null;
      timeoutId = null;
      reject(new Error("dice animation timed out"));
    }, timeoutMs);
  });
}

export function resolveDiceAnimation(value: number) {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  pending?.(value);
  pending = null;
  rejecter = null;
}

export function cancelDiceAnimation() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  rejecter?.(new Error("dice animation cancelled"));
  pending = null;
  rejecter = null;
}
