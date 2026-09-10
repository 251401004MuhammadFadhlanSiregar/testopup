import React from 'react';
import { Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelectGame }) => {
  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onSelectGame(game)}
      className="group relative bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs"
    >
      {/* Top Tag */}
      {game.tag && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
            {game.tag}
          </span>
        </div>
      )}

      {/* Image and Header */}
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
          <img
            src={game.logo}
            alt={game.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="text-[10px] bg-white/90 backdrop-blur-md text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-100 shadow-xs">
              {game.currencyName}
            </span>
            <span className="text-[10px] bg-emerald-50 backdrop-blur-md text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5 shadow-xs">
              <Zap className="w-2.5 h-2.5 fill-current" /> Instant
            </span>
          </div>
        </div>

        {/* Title and Publisher */}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
          {game.name}
        </h3>
        <p className="text-xs text-slate-500 mb-2 truncate">{game.publisher}</p>
      </div>

      {/* Footer / CTA */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
          Top Up Sekarang
        </span>
        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-600 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
