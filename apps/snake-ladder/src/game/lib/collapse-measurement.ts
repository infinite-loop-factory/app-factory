/**
 * Quantum measurement for a qubit collapse — extracted from
 * useGameController. Pure async: no React state involved.
 * biome-ignore-all lint/style/noNonNullAssertion: measurement rows
 * biome-ignore-all lint/suspicious/noNonNullAssertedOptionalChain: measurement rows
 */
import type { EntanglementStrategy } from "@/game/lib/entanglement-strategy";
import type { CollapseResult, LogEntry, PlacedQubit } from "@/game/types";

import { QUBIT_CONFIGS } from "@/game/constants/board";
import { rollDie } from "@/game/lib/game-helpers";
import { runQuantumCircuit } from "@/game/lib/local-sim";
import { buildSingleQubitQASM } from "@/game/lib/qasm-builder";

type MeasureArgs = {
  qubit: PlacedQubit;
  /** Entangled partner, when it exists and is still uncollapsed. */
  partner: PlacedQubit | undefined;
  strategy: EntanglementStrategy;
  addLog: (type: LogEntry["type"], message: string) => void;
};

/** Runs the (entangled or single-qubit) circuit and returns the outcome. */
export async function measureCollapseOutcome({
  qubit,
  partner,
  strategy,
  addLog,
}: MeasureArgs): Promise<CollapseResult> {
  const config = QUBIT_CONFIGS[qubit.configIndex]!;
  const partnerStillEntangled =
    config.entangled && partner && partner.collapsed === null;

  try {
    if (partnerStillEntangled && partner) {
      const partnerConfig = QUBIT_CONFIGS[partner.configIndex]!;
      const params = config.entangledParams;
      const thetaFromProb = (p: number) => 2 * Math.acos(Math.sqrt(p));
      const ctx = params
        ? {
            thetaA: params.thetaA,
            thetaB: params.thetaB,
            phase: params.phase,
          }
        : {
            thetaA: thetaFromProb(config.ladderProb),
            thetaB: thetaFromProb(partnerConfig.ladderProb),
          };
      const qasm = strategy.buildQASM(ctx);
      addLog("info", `Measuring ENTANGLED qubit [${config.label}]...`);
      for (const line of strategy.describe(ctx)) {
        addLog("info", line);
      }
      addLog("qasm", qasm);
      const result = await runQuantumCircuit(qasm);
      const parsed = strategy.parseResult(result[0]!);
      return {
        qubitId: qubit.id,
        outcome: parsed.playerOutcome,
        partnerId: qubit.entangledPartnerId,
        partnerOutcome: parsed.partnerOutcome ?? undefined,
      };
    }

    const qasm = buildSingleQubitQASM(config.ladderProb);
    addLog(
      "info",
      `Measuring qubit [${config.label}] at cell ${qubit.cell}...`,
    );
    addLog("qasm", qasm);
    const result = await runQuantumCircuit(qasm);
    const measurement = result[0]?.[0]!;
    const outcome: "snake" | "ladder" = measurement === 0 ? "ladder" : "snake";
    return { qubitId: qubit.id, outcome };
  } catch {
    const fallback =
      rollDie() <= Math.ceil(config.ladderProb * 6) ? "ladder" : "snake";
    return { qubitId: qubit.id, outcome: fallback };
  }
}
