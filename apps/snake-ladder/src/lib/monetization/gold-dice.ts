import { rollDie } from "@/game/lib/game-helpers";

/** Gold dice: 50% desired face, 10% each for the other five (epic #208) */
export function rollGoldDie(desiredFace: number): number {
  if (desiredFace < 1 || desiredFace > 6) return rollDie();
  if (Math.random() < 0.5) return desiredFace;
  const others = [1, 2, 3, 4, 5, 6].filter((n) => n !== desiredFace);
  const index = Math.floor(Math.random() * others.length);
  return others[index] ?? desiredFace;
}
