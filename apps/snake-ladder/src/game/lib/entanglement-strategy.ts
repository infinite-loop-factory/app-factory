export type EntanglementOutcome = "snake" | "ladder" | "interference";

export type EntanglementStrategyName = "basic" | "biased";

export interface EntanglementContext {
  thetaA: number;
  thetaB: number;
  phase?: number;
}

export interface EntanglementParsed {
  playerOutcome: EntanglementOutcome;
  partnerOutcome: EntanglementOutcome | null;
}

export interface EntanglementStrategy {
  readonly name: EntanglementStrategyName;
  readonly label: string;
  buildQASM(ctx: EntanglementContext): string;
  describe(ctx: EntanglementContext): string[];
  parseResult(measurements: readonly number[]): EntanglementParsed;
}

export const basicBellStrategy: EntanglementStrategy = {
  name: "basic",
  label: "Basic Bell",
  buildQASM() {
    return `OPENQASM 2.0;
qreg q[2];
creg c[2];
h q[0];
cx q[0], q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`;
  },
  describe() {
    return [
      "Circuit: H → CNOT creates Bell state (|00⟩+|11⟩)/√2",
      "Outcomes: 00(50%)=both ladders, 11(50%)=both snakes",
    ];
  },
  parseResult(measurements) {
    if (measurements.length < 2) {
      throw new Error(
        `basicBellStrategy.parseResult: expected ≥2 bits, got ${measurements.length}`,
      );
    }
    const [m0, m1] = measurements;
    if (m0 === 0 && m1 === 0) {
      return { playerOutcome: "ladder", partnerOutcome: "ladder" };
    }
    if (m0 === 1 && m1 === 1) {
      return { playerOutcome: "snake", partnerOutcome: "snake" };
    }
    return { playerOutcome: "interference", partnerOutcome: "interference" };
  },
};

function outcomeFromBits(m0: number, m2: number): EntanglementOutcome {
  if (m0 === 1) return "interference";
  return m2 === 0 ? "ladder" : "snake";
}

export const biasedBellStrategy: EntanglementStrategy = {
  name: "biased",
  label: "Biased visibility + Bell type (4 qubits)",
  buildQASM(ctx) {
    const phase = ctx.phase ?? 0;
    const fmt = (n: number) => n.toFixed(3);
    const lines = [
      "OPENQASM 2.0;",
      "qreg q[4];",
      "creg c[4];",
      `ry(${fmt(ctx.thetaB)}) q[1];`,
      `ry(${fmt(ctx.thetaA)}) q[0];`,
      "z q[1];",
    ];
    if (phase !== 0) lines.push(`rz(${fmt(phase)}) q[0];`);
    lines.push(
      "h q[0];",
      "cx q[0], q[1];",
      "h q[2];",
      "cx q[2], q[3];",
      "measure q[0] -> c[0];",
      "measure q[1] -> c[1];",
      "measure q[2] -> c[2];",
      "measure q[3] -> c[3];",
    );
    return lines.join("\n");
  },
  describe(ctx) {
    const phase = ctx.phase ?? 0;
    return [
      `Circuit (4 qubits): Ry(${ctx.thetaB.toFixed(3)}) q[1] · Ry(${ctx.thetaA.toFixed(3)}) q[0] · Z q[1]${
        phase ? ` · Rz(${phase.toFixed(3)}) q[0]` : ""
      } · H q[0] · CNOT(q[0],q[1]) | H q[2] · CNOT(q[2],q[3])`,
      "Mapping: q[0]=player visible, q[1]=partner visible, q[2]/q[3]=type",
    ];
  },
  parseResult(measurements) {
    if (measurements.length < 3) {
      throw new Error(
        `biasedBellStrategy.parseResult: expected ≥3 bits, got ${measurements.length}`,
      );
    }
    const [m0, m1, m2] = measurements;
    return {
      playerOutcome: outcomeFromBits(m0 ?? 0, m2 ?? 0),
      partnerOutcome: outcomeFromBits(m1 ?? 0, m2 ?? 0),
    };
  },
};

export const DEFAULT_ENTANGLEMENT_STRATEGY: EntanglementStrategy =
  biasedBellStrategy;
