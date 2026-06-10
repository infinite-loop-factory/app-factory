import type { ResolvedTimings } from "@/lib/settings";

import { describe, expect, it } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useGameController } from "@/game/hooks/use-game-controller";
import { resolveDiceAnimation } from "@/lib/dice-roll-bridge";

const FAST_TIMINGS: ResolvedTimings = {
  hopMs: 5,
  ladderStepMs: 5,
  snakeStepMs: 5,
  diceDurationMs: 1,
  diceRollDurationMs: 1,
  cpuThinkMs: 1,
};

type Controller = ReturnType<typeof useGameController>;

function completeSetup(current: () => Controller) {
  for (const config of [0, 1, 2, 3, 4]) {
    act(() => current().selectQubit(config));
    act(() => current().placeQubit(60 + config * 5));
  }
  act(() => current().confirmPass());
  for (const config of [0, 1, 2, 3, 4]) {
    act(() => current().placeCpuQubit(86 + config, config));
  }
  act(() => current().confirmPass());
}

describe("use-game-controller roll guard", () => {
  it("ignores re-roll while token movement is in progress", async () => {
    const { result } = renderHook(() =>
      useGameController({ timings: FAST_TIMINGS }),
    );
    completeSetup(() => result.current);
    expect(result.current.state.phase).toBe("play");
    expect(result.current.state.currentPlayer).toBe(0);

    let firstRoll: Promise<void> | undefined;
    act(() => {
      firstRoll = result.current.handleRoll(3) as Promise<void>;
    });
    act(() => {
      resolveDiceAnimation(3);
    });
    await waitFor(() => expect(result.current.state.isMoving).toBe(true));

    // Re-roll attempt mid-move must be a no-op.
    act(() => {
      void result.current.handleRoll(6);
    });

    await act(async () => {
      await firstRoll;
    });
    await waitFor(() => expect(result.current.state.isMoving).toBe(false));
    await new Promise((r) => setTimeout(r, 60));

    expect(result.current.state.positions[0]).toBe(4);
    expect(result.current.state.currentPlayer).toBe(1);
  });
});
