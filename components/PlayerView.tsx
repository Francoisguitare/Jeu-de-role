import React from 'react';
import { Player } from '../types';
import { ShieldAlertIcon, HeartIcon, ZapIcon, SkullIcon } from 'lucide-react';

interface PlayerViewProps {
  players: Player[];
}

const PlayerView: React.FC<PlayerViewProps> = ({ players }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player, index) => {
        const hpPercent = (player.stats.pv / player.stats.maxPv) * 100;
        const isDead = player.stats.pv <= 0;
        
        return (
          <div 
            key={player.id} 
            className={`
              relative overflow-hidden rounded-xl border-2 transition-all duration-300
              ${isDead ? 'border-slate-800 bg-slate-900 opacity-75' : index === 0 ? 'border-fantasy-gold bg-fantasy-panel shadow-lg shadow-fantasy-gold/20 scale-105 z-10' : 'border-slate-700 bg-fantasy-panel'}
            `}
          >
            {/* Header Badge */}
            <div className="absolute top-0 right-0 p-3">
              <span className={`
                text-2xl font-bold font-mono opacity-50
                ${index === 0 ? 'text-fantasy-gold' : 'text-slate-600'}
              `}>
                #{index + 1}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Identity */}
              <div>
                <h3 className={`text-2xl font-bold truncate ${isDead ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {player.name}
                </h3>
                <p className="text-slate-400 text-sm">{player.role}</p>
              </div>

              {/* Health Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-slate-300"><HeartIcon size={14} className="text-red-500"/> PV</span>
                  <span className={isDead ? 'text-red-600 font-bold' : 'text-white'}>
                    {player.stats.pv} / {player.stats.maxPv}
                  </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className={`h-full transition-all duration-500 ${hpPercent < 30 ? 'bg-red-600' : 'bg-green-600'}`}
                    style={{ width: `${Math.max(0, hpPercent)}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col items-center">
                  <span className="text-xs text-slate-400 uppercase flex items-center gap-1"><ZapIcon size={12}/> Initiative</span>
                  <span className="text-xl font-bold text-fantasy-gold">
                    {player.stats.iniBase + player.stats.iniRoll}
                  </span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col items-center">
                   <span className="text-xs text-slate-400 uppercase flex items-center gap-1"><ShieldAlertIcon size={12}/> DEX</span>
                   <span className="text-lg font-bold text-slate-200">{player.stats.dex}</span>
                </div>
              </div>

              {/* Conditions */}
              {player.conditions.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-slate-500 mb-1">États actuels:</p>
                  <div className="flex flex-wrap gap-2">
                    {player.conditions.map(c => (
                      <span key={c} className="px-2 py-1 bg-red-900/30 border border-red-800 text-red-300 text-xs rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {isDead && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
                  <SkullIcon size={64} className="text-slate-600 opacity-50" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerView;