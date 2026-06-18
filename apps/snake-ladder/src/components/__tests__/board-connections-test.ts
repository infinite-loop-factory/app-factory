import type { PlacedQubit } from "@/game/types";

import { describe, expect, it } from "@jest/globals";
import { getSnakeLadderConnections } from "@/components/board-connections";

function qubit(overrides: Partial<PlacedQubit>): PlacedQubit {
  return {
    id: "q1",
    cell: 10,
    owner: 0,
    configIndex: 0,
    collapsed: null,
    ...overrides,
  };
}

describe("board connections", () => {
  it("includes collapsed snakes and ladders with destinations", () => {
    const qubits = [
      qubit({ id: "l1", collapsed: "ladder", destinationCell: 24 }),
      qubit({ id: "s1", collapsed: "snake", destinationCell: 8 }),
      qubit({ id: "a1", collapsed: null }),
      qubit({ id: "i1", collapsed: "interference" }),
      qubit({ id: "x1", collapsed: "ladder" }),
    ];

    const connections = getSnakeLadderConnections(qubits);
    expect(connections.map((q) => q.id)).toEqual(["l1", "s1"]);
  });
});
