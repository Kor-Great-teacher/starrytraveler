export type ScreenType = 'base-camp' | 'world-map' | 'planet-map' | 'game';

export type GameType = 'math' | 'language' | 'science' | 'art';

export interface PlayerStats {
  level: number;
  exp: number;
  starPieces: number;
  roseHappiness: number;
  foxBond: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  cost: number;
  purchased: boolean;
  effectText: string;
}

export interface PlanetNode {
  id: string;
  name: string;
  topic: string;
  description: string;
  x: number; // percentage X position (0 - 100)
  y: number; // percentage Y position (0 - 100)
  difficulty: '하' | '중' | '상';
  completed: boolean;
}

export interface Planet {
  id: string;
  name: string;
  displayName: string;
  gameType: GameType;
  description: string;
  themeColor: string; // Tailwind class prefix, e.g., 'amber'
  accentColor: string; // Tailwind hex color code
  textColor: string;
  bgGradient: string;
  nodes: PlanetNode[];
}

export interface GameState {
  screen: ScreenType;
  activePlanetId: string | null;
  activeNodeId: string | null;
  playerStats: PlayerStats;
  inventory: string[];
  unlockedPlanets: string[];
  completedNodes: string[];
}
