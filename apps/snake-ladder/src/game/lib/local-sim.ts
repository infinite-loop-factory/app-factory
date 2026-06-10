/**
 * Local QASM simulator — ported from uts-iqc-group15/snake-ladder
 * biome-ignore-all lint/style/noNonNullAssertion: simulator hot path
 * biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: QASM parser
 * biome-ignore-all lint/suspicious/noAssignInExpressions: regex parse loop
 */

type Complex = { re: number; im: number };

const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cAdd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});
const cReal = (r: number): Complex => ({ re: r, im: 0 });
const cExpI = (theta: number): Complex => ({
  re: Math.cos(theta),
  im: Math.sin(theta),
});
const cAbs2 = (a: Complex): number => a.re * a.re + a.im * a.im;

type Gate2x2 = [Complex, Complex, Complex, Complex];

function ryMat(theta: number): Gate2x2 {
  const c = Math.cos(theta / 2);
  const s = Math.sin(theta / 2);
  return [cReal(c), cReal(-s), cReal(s), cReal(c)];
}

function rzMat(theta: number): Gate2x2 {
  return [cExpI(-theta / 2), cReal(0), cReal(0), cExpI(theta / 2)];
}

const H_MAT: Gate2x2 = (() => {
  const v = 1 / Math.sqrt(2);
  return [cReal(v), cReal(v), cReal(v), cReal(-v)];
})();

const Z_MAT: Gate2x2 = [cReal(1), cReal(0), cReal(0), cReal(-1)];

function apply1Q(state: Complex[], target: number, g: Gate2x2): void {
  const bit = 1 << target;
  for (let i = 0; i < state.length; i++) {
    if ((i & bit) !== 0) continue;
    const j = i | bit;
    const a = state[i]!;
    const b = state[j]!;
    state[i] = cAdd(cMul(g[0], a), cMul(g[1], b));
    state[j] = cAdd(cMul(g[2], a), cMul(g[3], b));
  }
}

function applyCX(state: Complex[], control: number, target: number): void {
  const cBit = 1 << control;
  const tBit = 1 << target;
  for (let i = 0; i < state.length; i++) {
    if ((i & cBit) === 0) continue;
    if ((i & tBit) !== 0) continue;
    const j = i | tBit;
    const tmp = state[i]!;
    state[i] = state[j]!;
    state[j] = tmp;
  }
}

function sampleBits(state: Complex[], nQubits: number): number[] {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < state.length; i++) {
    acc += cAbs2(state[i]!);
    if (r <= acc) {
      const bits = new Array<number>(nQubits);
      for (let k = 0; k < nQubits; k++) bits[k] = (i >> k) & 1;
      return bits;
    }
  }
  const bits = new Array<number>(nQubits).fill(0);
  bits[nQubits - 1] = 1;
  return bits;
}

interface ParsedProgram {
  nQubits: number;
  gates: Array<
    | { kind: "ry" | "rz"; target: number; theta: number }
    | { kind: "h" | "z"; target: number }
    | { kind: "cx"; control: number; target: number }
  >;
  measures: Array<{ q: number; c: number }>;
}

function parseProgram(program: string): ParsedProgram {
  const out: ParsedProgram = { nQubits: 0, gates: [], measures: [] };
  for (const raw of program.split("\n")) {
    const line = raw.trim().replace(/;$/, "").trim();
    if (
      !line ||
      line.startsWith("//") ||
      line.startsWith("OPENQASM") ||
      line.startsWith("creg")
    ) {
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^qreg q\[(\d+)\]$/))) {
      out.nQubits = Number.parseInt(m[1]!, 10);
    } else if ((m = line.match(/^ry\(([-\d.eE+]+)\) q\[(\d+)\]$/))) {
      out.gates.push({
        kind: "ry",
        target: Number.parseInt(m[2]!, 10),
        theta: Number.parseFloat(m[1]!),
      });
    } else if ((m = line.match(/^rz\(([-\d.eE+]+)\) q\[(\d+)\]$/))) {
      out.gates.push({
        kind: "rz",
        target: Number.parseInt(m[2]!, 10),
        theta: Number.parseFloat(m[1]!),
      });
    } else if ((m = line.match(/^h q\[(\d+)\]$/))) {
      out.gates.push({ kind: "h", target: Number.parseInt(m[1]!, 10) });
    } else if ((m = line.match(/^z q\[(\d+)\]$/))) {
      out.gates.push({ kind: "z", target: Number.parseInt(m[1]!, 10) });
    } else if ((m = line.match(/^cx q\[(\d+)\], ?q\[(\d+)\]$/))) {
      out.gates.push({
        kind: "cx",
        control: Number.parseInt(m[1]!, 10),
        target: Number.parseInt(m[2]!, 10),
      });
    } else if ((m = line.match(/^measure q\[(\d+)\] -> c\[(\d+)\]$/))) {
      out.measures.push({
        q: Number.parseInt(m[1]!, 10),
        c: Number.parseInt(m[2]!, 10),
      });
    } else {
      throw new Error(`local-sim: unsupported QASM line: ${line}`);
    }
  }
  if (out.nQubits === 0) throw new Error("local-sim: missing qreg declaration");
  return out;
}

export function simulateLocally(program: string, count = 1): number[][] {
  const parsed = parseProgram(program);
  const dim = 1 << parsed.nQubits;
  const results: number[][] = [];

  for (let s = 0; s < count; s++) {
    const state: Complex[] = new Array(dim);
    for (let i = 0; i < dim; i++) state[i] = cReal(0);
    state[0] = cReal(1);

    for (const g of parsed.gates) {
      if (g.kind === "ry") apply1Q(state, g.target, ryMat(g.theta));
      else if (g.kind === "rz") apply1Q(state, g.target, rzMat(g.theta));
      else if (g.kind === "h") apply1Q(state, g.target, H_MAT);
      else if (g.kind === "z") apply1Q(state, g.target, Z_MAT);
      else if (g.kind === "cx") applyCX(state, g.control, g.target);
    }

    const bits = sampleBits(state, parsed.nQubits);
    const row: number[] = [];
    for (const { q, c } of parsed.measures) row[c] = bits[q]!;
    results.push(row);
  }

  return results;
}

/** Offline quantum runner — epic requires on-device simulation only. */
export function runQuantumCircuit(qasm: string): Promise<number[][]> {
  return Promise.resolve(simulateLocally(qasm));
}
