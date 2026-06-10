export function buildSingleQubitQASM(ladderProb: number): string {
  const theta = 2 * Math.acos(Math.sqrt(ladderProb));
  return `OPENQASM 2.0;
qreg q[1];
creg c[1];
ry(${Number.parseFloat(theta.toFixed(4))}) q[0];
measure q[0] -> c[0];`;
}
