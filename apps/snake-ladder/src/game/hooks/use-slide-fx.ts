import type { BoardFxKind } from "@/components/board-fx";
import type { GameState } from "@/game/types";

import { useEffect, useRef, useState } from "react";

export type SlideFx = {
  kind: BoardFxKind | null;
  tick: number;
  /** Source cell of the traversal, latched so trails can outlive the slide. */
  fromCell: number | null;
};

/** Emits one board-FX tick per snake/ladder traversal. */
export function useSlideFx(state: GameState): SlideFx {
  const [slideFx, setSlideFx] = useState<SlideFx>({
    kind: null,
    tick: 0,
    fromCell: null,
  });
  const lastSlideCellRef = useRef<number | null>(null);

  useEffect(() => {
    const cell = state.slidingFromCell;
    if (cell === null) {
      lastSlideCellRef.current = null;
      return;
    }
    if (lastSlideCellRef.current === cell) return;
    lastSlideCellRef.current = cell;
    const qubit = state.qubits.find((q) => q.cell === cell);
    if (qubit?.collapsed !== "snake" && qubit?.collapsed !== "ladder") return;
    const kind: BoardFxKind = qubit.collapsed;
    setSlideFx((prev) => ({ kind, tick: prev.tick + 1, fromCell: cell }));
  }, [state.slidingFromCell, state.qubits]);

  return slideFx;
}
