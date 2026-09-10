import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  History, 
  Calculator, 
  Flame, 
  HelpCircle, 
  ShieldCheck, 
  Menu, 
  X, 
  PhoneCall,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Game } from '../types';

interface NavbarProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onOpenOrderTracker: () => void;
  onOpenCalculator: () => void;
  onOpenLiveChat: () => void;
  onOpenAdmin?: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  games,
  onSelectGame,
  onOpenOrderTracker,
  onOpenCalculator,
  onOpenLiveChat,
  onOpenAdmin,
  onGoHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredGames = searchQuery.trim() === ''
    ? []
    : games.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.currencyName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectSearchResult = (game: Game) => {
    onSelectGame(game);
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-indigo-600 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-indigo-700 text-indigo-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> FLASH PROMO
            </span>
            <p className="truncate text-xs sm:text-sm">
              ⚡ Cashback QRIS 15% pakai kode promo <span className="font-bold underline decoration-amber-300">QRISFLASH</span> | Top Up 1 Detik Otomatis!
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 opacity-90">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> 100% Legal & Bergaransi
            </span>
            <span className="flex items-center gap-1 opacity-90">
              <QrCode className="w-3.5 h-3.5 text-amber-300" /> QRIS Instan Ready
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  STECU<span className="text-indigo-600">TOPUP</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Top Up Game & Digital QRIS Instan #1
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Cari game (MLBB, Free Fire, Valorant, Genshin...)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && filteredGames.length > 0 && (
              <div 
                id="search-results-dropdown"
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto divide-y divide-slate-100"
              >
                {filteredGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleSelectSearchResult(game)}
                    className="w-full text-left p-3 hover:bg-indigo-50/50 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <img
                      src={game.logo}
                      alt={game.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                        {game.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {game.publisher} • {game.currencyName}
                      </p>
                    </div>
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded border border-indigo-200">
                      Top Up &rarr;
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Navigation */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <button
              id="nav-order-tracker"
              onClick={onOpenOrderTracker}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 text-sm font-medium transition-all shadow-xs group cursor-pointer"
            >
              <History className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span>Lacak Pesanan</span>
            </button>

            <button
              id="nav-calculator"
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 text-sm font-medium transition-all shadow-xs group cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Kalkulator WR</span>
            </button>

            <button
              id="nav-livechat"
              onClick={onOpenLiveChat}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>CS 24/7</span>
            </button>

            {onOpenAdmin && (
              <button
                id="nav-admin"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ml-1"
                title="Panel Admin Transaksi & Harga"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game (MLBB, Free Fire, Valorant, Genshin...)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-indigo-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            {filteredGames.length > 0 && (
              <div className="mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
                {filteredGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleSelectSearchResult(game)}
                    className="w-full text-left p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer"
                  >
                    <img
                      src={game.logo}
                      alt={game.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{game.name}</p>
                      <p className="text-xs text-slate-500">{game.publisher}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                onGoHome();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-medium flex items-center gap-2.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-indigo-600" /> Beranda Game
            </button>
            <button
              onClick={() => {
                onOpenOrderTracker();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-medium flex items-center gap-2.5 cursor-pointer"
            >
              <History className="w-4 h-4 text-indigo-600" /> Lacak Pesanan & Cek Transaksi
            </button>
            <button
              onClick={() => {
                onOpenCalculator();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-medium flex items-center gap-2.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-indigo-600" /> Kalkulator MLBB Win Rate
            </button>
            <button
              onClick={() => {
                onOpenLiveChat();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium flex items-center gap-2.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-indigo-600" /> Bantuan CS WhatsApp 24/7
            </button>
            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold flex items-center gap-2.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Admin Dashboard (PIN)
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
