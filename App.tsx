import React, { useState, useEffect } from 'react';
import { Player, Stats, ViewMode } from './types';
import { INITIAL_PLAYERS } from './constants';
import GMView from './components/GMView';
import PlayerView from './components/PlayerView';
import { SwordIcon, UsersIcon } from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [viewMode, setViewMode] = useState<ViewMode>('GM');
  const [activeApiKey, setActiveApiKey] = useState<string>('');

  // Handle updates
  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateStats = (id: string, updates: Partial<Stats>) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, stats: { ...p.stats, ...updates } } : p));
  };

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const sortInitiative = () => {
    setPlayers(prev => [...prev].sort((a, b) => {
      const totalA = a.stats.iniBase + a.stats.iniRoll;
      const totalB = b.stats.iniBase + b.stats.iniRoll;
      return totalB - totalA; // Descending
    }));
  };

  return (
    <div className="min-h-screen bg-fantasy-dark p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <div className="bg-fantasy-gold p-2 rounded-full shadow-lg shadow-amber-500/20">
                <SwordIcon size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                JDR <span className="text-fantasy-gold">Compagnon</span>
            </h1>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('GM')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'GM' ? 'bg-fantasy-panel text-fantasy-gold shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <span className="flex items-center gap-2"><SwordIcon size={16}/> Maître du Jeu</span>
          </button>
          <button
            onClick={() => setViewMode('PLAYER')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'PLAYER' ? 'bg-fantasy-panel text-fantasy-gold shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
             <span className="flex items-center gap-2"><UsersIcon size={16}/> Joueurs</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {viewMode === 'GM' ? (
          <GMView 
            players={players}
            onUpdatePlayer={updatePlayer}
            onUpdateStats={updateStats}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onSortInitiative={sortInitiative}
          />
        ) : (
          <PlayerView players={players} />
        )}
      </main>

      <footer className="mt-12 text-center text-slate-600 text-sm">
        <p>Propulsé par Gemini 2.5 Flash • Créé pour l'aventure</p>
      </footer>
    </div>
  );
}
