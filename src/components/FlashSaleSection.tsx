import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ArrowRight } from 'lucide-react';
import { FlashSaleItem, Game } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FlashSaleSectionProps {
  flashSales: FlashSaleItem[];
  onSelectFlashSale: (gameId: string, itemId: string) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  flashSales,
  onSelectFlashSale,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-md shadow-rose-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  FLASH SALE HARI INI
                </h3>
                <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  TERBATAS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Diskon ekstra kilat untuk item game pilihan. Kuota terbatas!
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-rose-600 animate-spin" />
            <span className="text-xs text-rose-700 font-medium mr-1">Berakhir dalam:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-white">
              <span className="bg-rose-600 px-1.5 py-0.5 rounded">{formatDigits(timeLeft.hours)}</span>
              <span className="text-rose-600">:</span>
              <span className="bg-rose-600 px-1.5 py-0.5 rounded">{formatDigits(timeLeft.minutes)}</span>
              <span className="text-rose-600">:</span>
              <span className="bg-rose-600 px-1.5 py-0.5 rounded">{formatDigits(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Flash Sale Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {flashSales.map((fs) => {
            const discountPercent = fs.item.originalPrice
              ? Math.round(((fs.item.originalPrice - fs.item.price) / fs.item.originalPrice) * 100)
              : 15;

            return (
              <div
                key={fs.id}
                id={`flash-card-${fs.id}`}
                onClick={() => onSelectFlashSale(fs.gameId, fs.item.id)}
                className="bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-white rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={fs.gameLogo}
                      alt={fs.gameName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded mb-1">
                        -{discountPercent}% OFF
                      </span>
                      <h4 className="text-xs text-slate-500 truncate">{fs.gameName}</h4>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {fs.item.name}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black text-rose-600">
                        {formatRupiah(fs.item.price)}
                      </span>
                      {fs.item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatRupiah(fs.item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress & Action */}
                <div>
                  {/* Stock Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Terjual {fs.soldCount}</span>
                      <span className="text-rose-600 font-bold">Sisa {100 - fs.stockPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all"
                        style={{ width: `${fs.stockPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    id={`btn-fs-buy-${fs.id}`}
                    className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Beli Kilat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
