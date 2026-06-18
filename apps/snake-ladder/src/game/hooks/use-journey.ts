import type { BoardFxKind } from "@/components/board-fx";
import type { GameFeedbackEvent } from "@/lib/game-feedback";

import { useMemoizedFn } from "ahooks";
import { useRef } from "react";
import { EMPTY_JOURNEY, type JourneyCounts } from "@/lib/share";

/**
 * Tracks the per-game journey (rolls, ladders, snakes, tunnels) consumed by
 * the share message and the result card. Counters live in refs on purpose —
 * they must not re-render the screen on every hop. Argless so it can be
 * wired before the game controller (whose feedback callback feeds it).
 */
export function useJourney() {
  const rollCountRef = useRef(0);
  const journeyRef = useRef<JourneyCounts>({ ...EMPTY_JOURNEY });

  const trackFeedback = useMemoizedFn((event: GameFeedbackEvent) => {
    if (event.type === "tunnel") journeyRef.current.tunnels += 1;
  });

  const trackSlide = useMemoizedFn((kind: BoardFxKind) => {
    if (kind === "ladder") journeyRef.current.ladders += 1;
    else journeyRef.current.snakes += 1;
  });

  const trackRoll = useMemoizedFn(() => {
    rollCountRef.current += 1;
  });

  const resetJourney = useMemoizedFn(() => {
    rollCountRef.current = 0;
    journeyRef.current = { ...EMPTY_JOURNEY };
  });

  return {
    rollCountRef,
    journeyRef,
    trackFeedback,
    trackSlide,
    trackRoll,
    resetJourney,
  };
}
