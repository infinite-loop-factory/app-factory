import type { GameState } from "@/game/types";

import { Redirect } from "expo-router";
import { useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameBoard, getBoardCellSize } from "@/components/game-board";
import { VictoryOverlay } from "@/components/victory-overlay";
import { useAppSettings } from "@/hooks/use-app-settings";

/**
 * Dev-only board art showcase: a fixed mid-game state with collapsed
 * snakes, ladders, and live superposition qubits so the full board art
 * can be reviewed (and screenshotted) without playing a game.
 */
const SHOWCASE_STATE: GameState = {
  phase: "play",
  positions: [23, 67],
  currentPlayer: 0,
  dice: 4,
  qubits: [
    {
      id: "show-ladder-long",
      cell: 8,
      owner: 0,
      configIndex: 0,
      collapsed: "ladder",
      destinationCell: 44,
    },
    {
      id: "show-snake-long",
      cell: 87,
      owner: 1,
      configIndex: 3,
      collapsed: "snake",
      destinationCell: 31,
    },
    {
      id: "show-ladder-short",
      cell: 36,
      owner: 0,
      configIndex: 1,
      collapsed: "ladder",
      destinationCell: 57,
    },
    {
      id: "show-snake-short",
      cell: 62,
      owner: 1,
      configIndex: 2,
      collapsed: "snake",
      destinationCell: 45,
    },
    {
      id: "show-snake-steep",
      cell: 95,
      owner: 0,
      configIndex: 4,
      collapsed: "snake",
      destinationCell: 73,
      entangledPartnerId: "show-ladder-mid",
    },
    {
      id: "show-ladder-mid",
      cell: 51,
      owner: 1,
      configIndex: 4,
      collapsed: "ladder",
      destinationCell: 91,
      entangledPartnerId: "show-snake-steep",
    },
    {
      id: "show-super-1",
      cell: 28,
      owner: 0,
      configIndex: 1,
      collapsed: null,
    },
    {
      id: "show-super-2",
      cell: 76,
      owner: 1,
      configIndex: 4,
      collapsed: null,
    },
  ],
  selectedConfigIndex: null,
  setupRemaining: [[], []],
  message: "",
  isRolling: false,
  isCollapsing: false,
  isMoving: false,
  slidingPlayer: null,
  slidingFromCell: null,
  overshootPlayer: null,
  gameOver: false,
  logs: [],
  paths: [[], []],
};

export default function ArtPreviewScreen() {
  const { width } = useWindowDimensions();
  const { palette } = useAppSettings();
  const cellSize = getBoardCellSize(width);

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: palette.tableFelt,
        alignItems: "center",
        justifyContent: "center",
      }}
      testID="art-preview-screen"
    >
      <View testID="art-preview-board">
        <GameBoard
          cellSize={cellSize}
          palette={palette}
          reducedMotion
          state={SHOWCASE_STATE}
        />
        <VictoryOverlay visible />
      </View>
    </SafeAreaView>
  );
}
