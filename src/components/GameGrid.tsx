import React, { useState } from 'react';
import { Flame, Smartphone, Monitor, Ticket, Layers, Sparkles, Search } from 'lucide-react';
import { Game, GameCategory } from '../types';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ games, onSelectGame }) => {
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'all'>('all');
  const [filterQuery, setFilterQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Semua Game & Produk', icon: Layers },
    { id: 'popular', label: '🔥 Paling Populer', icon: Flame },
    { id: 'mobile', label: '📱 Game Mobile', icon: Smartphone },
    { id: 'pc', label: '💻 PC & Konsol', icon: Monitor },
    { id: 'voucher', label: '🎟️ Voucher Digital', icon: Ticket },
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory;
    const matchesSearch =
      filterQuery.trim() === '' ||
      game.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(filterQuery.toLowerCase()) ||
      game.currencyName.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="game-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>KATALOG RESMI STECUTOPUP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            PILIH GAME & PRODUK FAVORIT
          </h2>
          <p className="text-sm text-slate-500">
            Pilih game yang ingin kamu top up, masukkan User ID, dan bayar instan dengan QRIS.
          </p>
        </div>

        {/* Local Filter Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="filter-game-input"
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari dalam katalog..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`tab-cat-${cat.id}`}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Games */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} onSelectGame={onSelectGame} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-800">Tidak ada game yang cocok</p>
          <p className="text-xs text-slate-500 mt-1">
            Coba kata kunci lain atau pilih kategori "Semua Game"
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setFilterQuery('');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}
    </section>
  );
};
