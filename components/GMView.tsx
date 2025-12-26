import React, { useState } from 'react';
import { Player, Stats } from '../types';
import Button from './Button';
import { generateNpc, generateScenarioHook } from '../services/geminiService';
import { PlusIcon, TrashIcon, SparklesIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { CONDITIONS_LIST } from '../constants';

interface GMViewProps {
  players: Player[];
  onUpdatePlayer: (id: string, updates: Partial<Player>) => void;
  onUpdateStats: (id: string, updates: Partial<Stats>) => void;
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (id: string) => void;
  onSortInitiative: () => void;
}

const GMView: React.FC<GMViewProps> = ({
  players,
  onUpdatePlayer,
  onUpdateStats,
  onAddPlayer,
  onRemovePlayer,
  onSortInitiative
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenarioText, setScenarioText] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleCreateNpc = async () => {
    setIsGenerating(true);
    const npcData = await generateNpc("Ennemi standard ou PNJ mystérieux");
    if (npcData) {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: npcData.name || 'Inconnu',
        role: npcData.role || 'PNJ',
        isNpc: true,
        stats: {
          pv: npcData.stats?.maxPv || 10,
          maxPv: npcData.stats?.maxPv || 10,
          dex: npcData.stats?.dex || 10,
          iniBase: npcData.stats?.iniBase || 0,
          iniRoll: 0
        },
        notes: npcData.notes || '',
        conditions: []
      };
      onAddPlayer(newPlayer);
    }
    setIsGenerating(false);
  };

  const handleGenerateHook = async () => {
    setIsGenerating(true);
    const text = await generateScenarioHook(players.map(p => p.name));
    setScenarioText(text);
    setIsGenerating(false);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: newPlayerName,
      role: 'Inconnu',
      isNpc: true,
      stats: { pv: 20, maxPv: 20, dex: 10, iniBase: 0, iniRoll: 0 },
      notes: '',
      conditions: []
    };
    onAddPlayer(newPlayer);
    setNewPlayerName('');
  };

  return (
    <div className="space-y-6">
      {/* AI Tools Section */}
      <div className="bg-fantasy-panel p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-bold text-fantasy-gold mb-4 flex items-center gap-2">
          <SparklesIcon size={20} /> Outils du MJ (IA)
        </h3>
        <div className="flex flex-wrap gap-4 items-start">
            <Button onClick={handleCreateNpc} disabled={isGenerating} size="sm" variant="secondary">
               {isGenerating ? 'Invocation...' : 'Générer un PNJ aléatoire'}
            </Button>
            <Button onClick={handleGenerateHook} disabled={isGenerating} size="sm" variant="secondary">
               {isGenerating ? 'Divination...' : 'Inspirer une scène'}
            </Button>
        </div>
        {scenarioText && (
          <div className="mt-4 p-3 bg-slate-800 rounded text-slate-300 italic text-sm border-l-2 border-fantasy-gold">
            "{scenarioText}"
          </div>
        )}
      </div>

      {/* Main Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleManualAdd} className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nom du nouveau..."
            className="bg-slate-800 border border-slate-600 text-white px-3 py-1 rounded text-sm focus:border-fantasy-gold outline-none"
          />
          <Button type="submit" size="sm"><PlusIcon size={16} /></Button>
        </form>
        <Button onClick={onSortInitiative} variant="primary">
          Trier par Initiative (Total)
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-fantasy-panel rounded-lg shadow-xl border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-xs">
            <tr>
              <th className="p-3">Ordre</th>
              <th className="p-3">Nom / Classe</th>
              <th className="p-3 text-center">PV / Max</th>
              <th className="p-3 text-center">DEX</th>
              <th className="p-3 text-center">Ini Base + Dé = Total</th>
              <th className="p-3">Conditions</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {players.map((player, index) => (
              <tr key={player.id} className={`hover:bg-slate-700/50 transition-colors ${player.stats.pv <= 0 ? 'opacity-50 grayscale' : ''}`}>
                <td className="p-3 font-mono text-fantasy-gold text-lg font-bold">#{index + 1}</td>
                <td className="p-3">
                  <input
                    value={player.name}
                    onChange={(e) => onUpdatePlayer(player.id, { name: e.target.value })}
                    className="bg-transparent border-b border-transparent focus:border-fantasy-gold outline-none font-bold block w-full"
                  />
                  <input
                    value={player.role}
                    onChange={(e) => onUpdatePlayer(player.id, { role: e.target.value })}
                    className="bg-transparent border-b border-transparent focus:border-fantasy-gold outline-none text-xs text-slate-400 block w-full"
                  />
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => onUpdateStats(player.id, { pv: Math.max(0, player.stats.pv - 1) })}
                      className="text-red-400 hover:bg-red-900/30 rounded p-1"
                    >
                      <ChevronDownIcon size={14} />
                    </button>
                    <input
                      type="number"
                      value={player.stats.pv}
                      onChange={(e) => onUpdateStats(player.id, { pv: parseInt(e.target.value) || 0 })}
                      className="w-12 text-center bg-slate-900 rounded border border-slate-600 py-1"
                    />
                    <span className="text-slate-500">/</span>
                    <input
                      type="number"
                      value={player.stats.maxPv}
                      onChange={(e) => onUpdateStats(player.id, { maxPv: parseInt(e.target.value) || 0 })}
                      className="w-12 text-center bg-transparent border-b border-transparent focus:border-slate-500 outline-none text-slate-400"
                    />
                    <button 
                      onClick={() => onUpdateStats(player.id, { pv: Math.min(player.stats.maxPv, player.stats.pv + 1) })}
                      className="text-green-400 hover:bg-green-900/30 rounded p-1"
                    >
                      <ChevronUpIcon size={14} />
                    </button>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={player.stats.dex}
                    onChange={(e) => onUpdateStats(player.id, { dex: parseInt(e.target.value) || 0 })}
                    className="w-12 text-center bg-transparent border-b border-slate-700 focus:border-fantasy-gold outline-none"
                  />
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-slate-400 text-xs w-6">{player.stats.iniBase}</span>
                    <span>+</span>
                    <input
                      type="number"
                      value={player.stats.iniRoll}
                      onChange={(e) => onUpdateStats(player.id, { iniRoll: parseInt(e.target.value) || 0 })}
                      className="w-12 text-center bg-slate-900 border border-slate-600 rounded py-1 text-fantasy-gold font-bold"
                    />
                    <span>=</span>
                    <span className="font-bold text-lg w-8">{player.stats.iniBase + player.stats.iniRoll}</span>
                  </div>
                </td>
                <td className="p-3">
                   <select 
                    className="bg-slate-900 border border-slate-700 text-xs rounded p-1 max-w-[100px]"
                    onChange={(e) => {
                      if (e.target.value && !player.conditions.includes(e.target.value)) {
                        onUpdatePlayer(player.id, { conditions: [...player.conditions, e.target.value] });
                      }
                      e.target.value = '';
                    }}
                   >
                     <option value="">+ État</option>
                     {CONDITIONS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   <div className="flex flex-wrap gap-1 mt-1">
                     {player.conditions.map(c => (
                       <span key={c} className="text-[10px] bg-red-900/50 text-red-200 px-1 rounded flex items-center gap-1 border border-red-800">
                         {c}
                         <button onClick={() => onUpdatePlayer(player.id, { conditions: player.conditions.filter(x => x !== c) })}>&times;</button>
                       </span>
                     ))}
                   </div>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onRemovePlayer(player.id)} className="text-slate-500 hover:text-red-500">
                    <TrashIcon size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GMView;