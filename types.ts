export interface Stats {
  pv: number;
  maxPv: number;
  dex: number;
  iniBase: number; // Bonus d'initiative fixe
  iniRoll: number; // Résultat du dé
}

export interface Player {
  id: string;
  name: string;
  role: string; // Classe ou Race
  isNpc: boolean; // Si c'est un PNJ contrôlé par le MJ
  stats: Stats;
  notes: string;
  conditions: string[]; // Poison, étourdi, etc.
}

export type ViewMode = 'GM' | 'PLAYER';
