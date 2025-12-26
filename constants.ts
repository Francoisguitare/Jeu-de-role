import { Player } from './types';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Grommash',
    role: 'Barbare',
    isNpc: false,
    stats: { pv: 45, maxPv: 45, dex: 12, iniBase: 2, iniRoll: 0 },
    notes: 'Rage disponible',
    conditions: []
  },
  {
    id: '2',
    name: 'Elara',
    role: 'Mage',
    isNpc: false,
    stats: { pv: 22, maxPv: 22, dex: 16, iniBase: 4, iniRoll: 0 },
    notes: 'Sorts niv 2',
    conditions: []
  },
  {
    id: '3',
    name: 'Gobelin Chef',
    role: 'Monstre',
    isNpc: true,
    stats: { pv: 15, maxPv: 15, dex: 14, iniBase: 3, iniRoll: 0 },
    notes: 'Lâche',
    conditions: []
  }
];

export const CONDITIONS_LIST = ['Empoisonné', 'Étourdi', 'À terre', 'Aveuglé', 'Charmé'];
