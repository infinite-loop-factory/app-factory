/**
 * Room codes: any short code deterministically maps to a board seed, so
 * friends (or a stream chat) can play the exact same board with zero server
 * — agreeing on "PIZZA" is enough.
 */

/** Unambiguous alphabet — no O/0, I/1 confusion. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const ROOM_CODE_LENGTH = 5;
export const ROOM_CODE_MAX_LENGTH = 12;

/** Uppercase, strip spaces — "pizza " and "PIZZA" are the same room. */
export function normalizeRoomCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .slice(0, ROOM_CODE_MAX_LENGTH);
}

export function isValidRoomCode(raw: string): boolean {
  const code = normalizeRoomCode(raw);
  return code.length >= 2 && /^[A-Z0-9]+$/.test(code);
}

/** FNV-1a 32-bit — stable across platforms, good seed dispersion. */
export function seedFromCode(raw: string): number {
  const code = normalizeRoomCode(raw);
  let hash = 0x811c9dc5;
  for (let i = 0; i < code.length; i += 1) {
    hash ^= code.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function randomRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}
