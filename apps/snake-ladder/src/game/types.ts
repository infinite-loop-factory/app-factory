export interface PlacedQubit {
  id: string;
  cell: number;
  owner: 0 | 1;
  configIndex: number;
  collapsed: null | "snake" | "ladder" | "interference";
  destinationCell?: number;
  entangledPartnerId?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  type: "info" | "qasm" | "result" | "error";
  message: string;
}

export type GamePhase = "setup" | "passing" | "play" | "gameover";

export interface GameState {
  phase: GamePhase;
  positions: [number, number];
  currentPlayer: 0 | 1;
  dice: number | null;
  qubits: PlacedQubit[];
  selectedConfigIndex: number | null;
  setupRemaining: [number[], number[]];
  message: string;
  isRolling: boolean;
  isCollapsing: boolean;
  /** Token hop/slide resolution in progress — blocks re-rolling mid-move. */
  isMoving: boolean;
  slidingPlayer: 0 | 1 | null;
  /** Source cell of the snake/ladder currently being traversed (null when idle). */
  slidingFromCell: number | null;
  overshootPlayer: 0 | 1 | null;
  gameOver: boolean;
  logs: LogEntry[];
  paths: [number[], number[]];
}

export interface CollapseParams {
  qubit: PlacedQubit;
  player: 0 | 1;
  targetCell: number;
}

export interface CollapseResult {
  qubitId: string;
  outcome: "snake" | "ladder" | "interference";
  partnerId?: string;
  partnerOutcome?: "snake" | "ladder" | "interference";
}
