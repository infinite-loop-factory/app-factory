export const STEP_PHASE = Math.PI / 4;
export const BARRIER_THETA = 1.2;

export function buildTunnelQASM(theta: number, phi: number): string {
  const fmt = (n: number) => n.toFixed(6);
  return `OPENQASM 2.0;
qreg q[1];
creg c[1];
ry(${fmt(theta)}) q[0];
rz(${fmt(phi)}) q[0];
ry(${fmt(theta)}) q[0];
measure q[0] -> c[0];`;
}

export function computeTunnelPhase(pathLength: number): number {
  const raw = pathLength * STEP_PHASE;
  const TWO_PI = 2 * Math.PI;
  return ((raw % TWO_PI) + TWO_PI) % TWO_PI;
}

export function tunnelPassProbability(theta: number, phi: number): number {
  return Math.sin(theta) ** 2 * Math.cos(phi / 2) ** 2;
}

export function isResonant(phi: number): boolean {
  return Math.cos(phi / 2) ** 2 > 0.9;
}
