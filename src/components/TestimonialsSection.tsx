import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Zap, Sparkles, CheckCircle2, User } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  avatarColor: string;
  game: string;
  item: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Dimas Rizky',
    avatarColor: 'from-amber-500 to-rose-500',
    game: 'Mobile Legends',
    item: 'Weekly Diamond Pass',
    rating: 5,
    comment: 'Top up Weekly Diamond Pass beneran 1 detik langsung masuk sehabis scan QRIS! Mantap banget harganya paling murah.',
    timeAgo: '5 menit lalu',
  },
  {
    id: 'r2',
    name: 'Fadhil Pratama',
    avatarColor: 'from-indigo-500 to-cyan-500',
    game: 'Valorant',
    item: '1000 Valorant Points',
    rating: 5,
    comment: 'Beli VP Valorant buat battle pass, proses cepat no delay. Web topup andalan buat push rank.',
    timeAgo: '12 menit lalu',
  },
  {
    id: 'r3',
    name: 'Siti Rahmawati',
    avatarColor: 'from-purple-500 to-pink-500',
    game: 'Genshin Impact',
    item: 'Blessing of the Welkin Moon',
    rating: 5,
    comment: 'Aman banget gak perlu password akun, tinggal UID dan Server Asia. Welkin moon langsung aktif di in-game!',
    timeAgo: '25 menit lalu',
  },
  {
    id: 'r4',
    name: 'Bayu Arya',
    avatarColor: 'from-emerald-500 to-teal-500',
    game: 'Free Fire',
    item: 'Membership Mingguan',
    rating: 5,
    comment: 'Dapat diskon kode promo QRISFLASH lumayan banget. Pelayanan CS juga responsif pas tanya-tanya.',
    timeAgo: '40 menit lalu',
  },
];

const RECENT_PURCHASES = [
  { user: '0812***891', game: 'Mobile Legends', item: '257 Diamonds', time: '2 detik lalu' },
  { user: '0857***412', game: 'Free Fire', item: '70+7 Diamonds', time: '5 detik lalu' },
  { user: '0813***009', game: 'Valorant', item: '1000 VP', time: '8 detik lalu' },
  { user: '0878***654', game: 'Genshin Impact', item: 'Welkin Moon', time: '12 detik lalu' },
  { user: '0896***331', game: 'Honor of Kings', item: '240 Tokens', time: '15 detik lalu' },
  { user: '0821***780', game: 'Roblox', item: '400 Robux', time: '18 detik lalu' },
];

export const TestimonialsSection: React.FC = () => {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentTicker = RECENT_PURCHASES[tickerIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Live Transaction Activity Ticker Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 mb-10 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 animate-pulse border border-emerald-100">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
            <span className="font-bold text-slate-700">Aktivitas Real-Time:</span>
            <span className="text-slate-500 font-mono">{currentTicker.user}</span>
            <span className="text-slate-600">sukses top up</span>
            <span className="font-bold text-indigo-600">{currentTicker.item}</span>
            <span className="text-slate-500">({currentTicker.game})</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex-shrink-0 hidden sm:inline-block">
          ⚡ {currentTicker.time}
        </span>
      </div>

      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>4.9 / 5.0 DARI 250.000+ TRANSAKSI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Apa Kata Para Gamers Indonesia?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ulasan jujur dari komunitas pro player dan content creator yang berlangganan di Stecutopup.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                "{rev.comment}"
              </p>
            </div>

            {/* User Meta */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${rev.avatarColor} flex items-center justify-center text-white font-black text-xs shadow-xs`}>
                {rev.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{rev.name}</p>
                <p className="text-[10px] text-slate-500 truncate">
                  {rev.game} • <span className="text-indigo-600 font-medium">{rev.item}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
