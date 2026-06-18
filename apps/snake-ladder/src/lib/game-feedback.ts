export type GameFeedbackEvent =
  | { type: "selection" }
  | { type: "roll" }
  | { type: "dice_impact"; strength: number }
  | { type: "hop" }
  | { type: "collapse" }
  | { type: "ladder_step" }
  | { type: "snake_step" }
  | { type: "tunnel" }
  | { type: "win" }
  | { type: "lose" };

export type GameFeedbackHandler = (event: GameFeedbackEvent) => void;
