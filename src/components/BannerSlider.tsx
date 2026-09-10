import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, QrCode, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Game } from '../types';

interface BannerSliderProps {
  onSelectGameById: (gameId: string) => void;
  games: Game[];
}

interface PromoBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  gameId: string;
  image: string;
  gradient: string;
}

const BANNERS: PromoBanner[] = [
  {
    id: 'b1',
    badge: '🔥 FLASH SALE QRIS 15%',
    title: 'Top Up Mobile Legends Paling Murah',
    subtitle: 'Weekly Diamond Pass hemat s.d 25%. Verifikasi otomatis 1 detik via QRIS & E-Wallet.',
    ctaText: 'Top Up MLBB Sekarang',
    gameId: 'mlbb',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    gradient: 'from-amber-600/90 via-rose-600/80 to-slate-950',
  },
  {
    id: 'b2',
    badge: '💎 DISKON GARENA 20%',
    title: 'Free Fire MAX Diamond & Membership',
    subtitle: 'Langganan Membership Mingguan dan Bulanan langsung masuk akun hanya pakai Player ID.',
    ctaText: 'Beli Diamond Free Fire',
    gameId: 'ff',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1000&auto=format&fit=crop&q=80',
    gradient: 'from-rose-600/90 via-orange-600/80 to-slate-950',
  },
  {
    id: 'b3',
    badge: '✨ RESMI HOYOVERSE',
    title: 'Genshin Impact & Honkai Star Rail',
    subtitle: 'Blessing of Welkin Moon & Express Supply Pass resmi server Asia tanpa login akun.',
    ctaText: 'Top Up Hoyoverse',
    gameId: 'genshin',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1000&auto=format&fit=crop&q=80',
    gradient: 'from-indigo-600/90 via-purple-600/80 to-slate-950',
  },
  {
    id: 'b4',
    badge: '🎯 RIOT GAMES OFFICIAL',
    title: 'Valorant Points (VP) Kilat APAC',
    subtitle: 'Dapatkan skin bundle idaman & Battle Pass dengan proses instan 24 jam non-stop.',
    ctaText: 'Beli Valorant Points',
    gameId: 'valorant',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&auto=format&fit=crop&q=80',
    gradient: 'from-cyan-600/90 via-blue-600/80 to-slate-950',
  },
];

export const BannerSlider: React.FC<BannerSliderProps> = ({ onSelectGameById }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const currentBanner = BANNERS[currentIndex];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Slider Container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900 group">
        
        {/* Background Image with Ambient Glow */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ease-out brightness-50"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient} opacity-90 transition-all duration-700`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* Banner Content */}
          <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between max-w-2xl">
            {/* Top Tag */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                {currentBanner.badge}
              </span>
            </div>

            {/* Middle Title & Subtitle */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                {currentBanner.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 line-clamp-2 max-w-lg font-medium">
                {currentBanner.subtitle}
              </p>
            </div>

            {/* Bottom Actions & Trust */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id={`banner-cta-${currentBanner.id}`}
                onClick={() => onSelectGameById(currentBanner.gameId)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>{currentBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-4 text-xs text-white/80 font-medium">
                <span className="flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-amber-300" /> QRIS Instan
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Legal Moonton/Garena
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-3 right-6 flex items-center gap-1.5 z-10">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Feature Value Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">QRIS Instan Otomatis</p>
            <p className="text-[11px] text-slate-500">Scan & masuk dalam 1 detik</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">100% Legal & Aman</p>
            <p className="text-[11px] text-slate-500">Garansi uang kembali</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Harga Termurah</p>
            <p className="text-[11px] text-slate-500">Promo diskon setiap hari</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Layanan 24 Jam</p>
            <p className="text-[11px] text-slate-500">CS WhatsApp siap bantu</p>
          </div>
        </div>
      </div>
    </section>
  );
};
