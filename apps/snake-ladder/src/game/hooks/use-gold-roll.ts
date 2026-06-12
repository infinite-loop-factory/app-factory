import { useMemoizedFn } from "ahooks";
import { useState } from "react";
import { rollGoldDie } from "@/lib/monetization/gold-dice";

type UseGoldRollArgs = {
  /** Gold dice are locked out of shared-seed modes — scores must be fair. */
  isPreset: boolean;
  goldDiceCount: number;
  consumeGoldDice: (count: number) => boolean;
  handleRoll: (forcedValue?: number) => Promise<void>;
  onRollStart: () => void;
};

/**
 * Dice-throw state shared by the human roll button and the CPU turn:
 * throw charge, the gold-die forcing pipeline, and the roll dispatcher.
 */
export function useGoldRoll({
  isPreset,
  goldDiceCount,
  consumeGoldDice,
  handleRoll,
  onRollStart,
}: UseGoldRollArgs) {
  const [goldDiceEnabled, setGoldDiceEnabled] = useState(false);
  const [goldDesiredFace, setGoldDesiredFace] = useState(6);
  const [pendingForcedRoll, setPendingForcedRoll] = useState<number | null>(
    null,
  );
  const [throwCharge, setThrowCharge] = useState(0.5);

  const goldActive = !isPreset && goldDiceEnabled && goldDiceCount > 0;

  const rollDice = useMemoizedFn((charge: number) => {
    onRollStart();
    setThrowCharge(charge);
    if (goldActive) {
      if (!consumeGoldDice(1)) return;
      const forced = rollGoldDie(goldDesiredFace);
      setPendingForcedRoll(forced);
      void handleRoll(forced);
      return;
    }
    setPendingForcedRoll(null);
    void handleRoll();
  });

  /** CPU rolls are always fair and get a randomized throw strength. */
  const prepareCpuRoll = useMemoizedFn(() => {
    setPendingForcedRoll(null);
    setThrowCharge(0.3 + Math.random() * 0.55);
  });

  const toggleGoldDice = useMemoizedFn(() => {
    setGoldDiceEnabled((value) => !value);
  });

  const disableGoldDice = useMemoizedFn(() => {
    setGoldDiceEnabled(false);
  });

  return {
    goldDiceEnabled,
    goldDesiredFace,
    setGoldDesiredFace,
    pendingForcedRoll,
    throwCharge,
    goldActive,
    rollDice,
    prepareCpuRoll,
    toggleGoldDice,
    disableGoldDice,
  };
}
