// Generated from en.json — edit JSON then run: pnpm i18n:build
export default {
  home: {
    title: "Snake & Ladder",
    subtitle:
      "Quantum board game vs the computer. Place qubits, roll superposition dice, tunnel through rivals.",
    play: "New Game",
    offline: "All quantum circuits run locally — no network required.",
    statsSummary: "{played} games · {rate}% win rate",
    feature: {
      dice: {
        title: "Quantum Dice",
        body: "Qubit collapse decides ladder vs snake when you land on a placed tile.",
      },
      entangle: {
        title: "Entanglement",
        body: "Pair qubits so outcomes can interfere or resolve together.",
      },
      ladder: {
        title: "Vector Slides",
        body: "Ladders climb and snakes fall using X/Y vector rolls on the board grid.",
      },
      tunnel: {
        title: "Tunneling",
        body: "Land on the same cell as your opponent? Path-dependent interference may let you pass through.",
      },
    },
  },
  game: {
    title: "Snake & Ladder",
    you: "You",
    roll: "Roll",
    playAgain: "Play Again",
    back: "Back to home",
    restart: "Start new game",
    newGameTitle: "Start a new game?",
    newGameMessage: "Your current match progress will be lost.",
    newGameConfirm: "New game",
    newGameCancel: "Cancel",
    goldDice: {
      balance: "Gold dice: {count}",
      on: "Gold ON",
      off: "Gold OFF",
    },
    shopCta: "Get gold dice in the shop",
    log: {
      qasmTap: "Tap for circuit diagram",
    },
  },
  setup: {
    pickQubit: "Pick a qubit, then tap a cell (6–95)",
    entangledBadge: "⧗ entangled",
    passTurn: "Continue",
    humanTurn: "Place your qubits on the board",
    opponentTurn: "{name} is placing qubits…",
    confirmPass: "Tap Continue when ready",
    interference: "Interference! Your qubit cancelled the opponent's.",
  },
  turn: {
    yours: "Your turn!",
    opponent: "{name}'s turn",
  },
  play: {
    humanRoll: "Your turn — roll the dice",
    opponentRoll: "{name} is rolling…",
    moving: "Moving…",
    moved: "Turn complete",
    collapsing: "Quantum measurement…",
    ladder: "Ladder! Climbing…",
    snake: "Snake! Sliding…",
    interference: "Interference — no move",
    overshoot: "Overshoot! Bouncing back…",
    overshootDone: "Must land exactly on 100",
    youWin: "You win!",
    opponentWin: "{name} wins!",
  },
  onboarding: {
    title: "How to Play",
    subtitle: "Quantum Snakes & Ladders vs the computer — all on device.",
    step1: {
      title: "Place qubits",
      body: "During setup, pick qubit types and tap cells 6–95 on the board.",
    },
    step2: {
      title: "Entangle & interfere",
      body: "Pair qubits so collapse outcomes can interfere or resolve together.",
    },
    step3: {
      title: "Roll & collapse",
      body: "Land on a qubit tile to measure it — ladder up, snake down, or tunnel through rivals.",
    },
    start: "Got it",
  },
  opponent: {
    defaultName: "Computer",
  },
  player: {
    defaultName: "You",
  },
  settings: {
    title: "Settings",
    stats: {
      title: "Statistics",
      played: "Games played: {count}",
      wins: "Wins: {count}",
      losses: "Losses: {count}",
      winRate: "Win rate: {rate}%",
    },
    movementSpeed: "Movement speed",
    opponentNickname: "Opponent nickname",
    opponentPreview: "Opponent shown as: {name}",
    playerNickname: "Your nickname",
    playerPreview: "You shown as: {name}",
    resetStats: "Reset statistics",
    resetStatsTitle: "Reset statistics?",
    resetStatsMessage: "All win/loss records will be cleared.",
    resetStatsConfirm: "Reset",
    diceSpeed: "Dice animation",
    theme: "Theme",
    haptics: "Haptics",
    sound: "Sound effects",
    option: {
      slow: "Slow",
      normal: "Normal",
      fast: "Fast",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    monetization: {
      title: "Shop & items",
      goldBalance: "Gold dice: {count}",
      adRemoved: "Ads removed on this device",
      adsEnabled: "Interstitial ads may appear every 3 games",
      openShop: "Open shop",
    },
    legal: {
      title: "Legal",
      privacy: "Privacy policy",
    },
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "Snake & Ladder runs quantum simulations on your device. We do not operate game servers or collect gameplay telemetry.",
    section: {
      data: {
        title: "Data we store locally",
        body: "Settings, win/loss statistics, gold dice balance, and ad-removal status are saved on your device with AsyncStorage. Quantum circuits are computed locally and are not uploaded.",
      },
      ads: {
        title: "Advertising",
        body: "On iOS we may request App Tracking Transparency before showing AdMob interstitials. Ad partners may collect device identifiers per their policies. Purchase ad removal to disable interstitials.",
      },
      iap: {
        title: "In-app purchases",
        body: "Gold dice and ad removal are processed by Apple App Store or Google Play. We verify iOS receipts on-device before granting items. Purchase history for restore is handled by the store.",
      },
      contact: {
        title: "Contact",
        body: "Questions about this policy: open an issue at github.com/infinite-loop-factory/app-factory or contact the publisher listed on the store listing.",
      },
    },
    publicUrl: "Public URL: {url}",
  },
  shop: {
    title: "Shop",
    goldBalance: "Gold dice: {count}",
    goldDescription:
      "Gold dice bias your roll — 50% chance for the face you pick, 10% for each other face. Consumed on use.",
    goldPack: "{count} gold dice",
    goldPackHint: "Consumable · use in-game",
    adRemoval: "Remove ads",
    adRemovalHint: "One-time purchase · no interstitials",
    adRemovalOwned: "Ads removed on this device",
    owned: "Owned",
    restore: "Restore purchases",
    restoring: "Restoring…",
    restoreDone: "Purchases restored",
    restoreFailed: "Could not restore purchases",
    purchaseSuccess: "Purchase complete",
    purchaseFailed: "Purchase failed",
    goldAdded: "{count} gold dice added",
    adRemovalActive: "Ads have been removed",
    priceUnavailable: "—",
    storeUnavailable: "Store is not available right now",
    connectingStore: "Connecting to store…",
    verificationFailed:
      "Purchase could not be verified. No items were granted.",
    webUnavailable:
      "In-app purchases are available in the iOS and Android apps only.",
  },
  board: {
    qubit: {
      active: "Quantum field",
      entangled: "Entangled quantum field",
      collapsedLadder: "Collapsed quantum field — ladder",
      collapsedSnake: "Collapsed quantum field — snake",
      collapsedInterference: "Collapsed quantum field — interference",
    },
  },
  notFound: {
    title: "This square doesn't exist",
    goHome: "Back to the board",
  },
} as const;
