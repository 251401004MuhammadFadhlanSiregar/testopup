import React, { useState } from 'react';
import { X, Calculator, Sparkles, Trophy, HelpCircle, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface CalculatorWRModalProps {
  onClose: () => void;
  onTopUpMLBB: () => void;
}

export const CalculatorWRModal: React.FC<CalculatorWRModalProps> = ({
  onClose,
  onTopUpMLBB,
}) => {
  const [activeTab, setActiveTab] = useState<'wr' | 'magic' | 'zodiac'>('wr');

  // Win Rate Calculator State
  const [totalMatches, setTotalMatches] = useState<string>('850');
  const [currentWR, setCurrentWR] = useState<string>('54.2');
  const [targetWR, setTargetWR] = useState<string>('60.0');
  const [requiredWins, setRequiredWins] = useState<number | null>(124);

  // Magic Wheel / Zodiac State
  const [currentMagicPoints, setCurrentMagicPoints] = useState<string>('120');
  const [currentZodiacStars, setCurrentZodiacStars] = useState<string>('45');

  const calculateWinRate = () => {
    const total = parseFloat(totalMatches);
    const curr = parseFloat(currentWR);
    const target = parseFloat(targetWR);

    if (isNaN(total) || isNaN(curr) || isNaN(target) || total <= 0) {
      setRequiredWins(null);
      return;
    }

    if (target <= curr) {
      setRequiredWins(0);
      return;
    }

    if (target >= 100) {
      setRequiredWins(99999);
      return;
    }

    // Formula: (target% * Total - curr% * Total) / (100 - target%)
    const currentWins = (curr / 100) * total;
    const winsNeeded = Math.ceil((target * total - 100 * currentWins) / (100 - target));
    setRequiredWins(Math.max(0, winsNeeded));
  };

  // Magic Wheel calculation (200 points max)
  const magicPointsLeft = Math.max(0, 200 - (parseInt(currentMagicPoints) || 0));
  const estimatedMagicDiamonds = magicPointsLeft * 54; // Average 5x spin = 270 diamonds (54 per point)
  const estimatedMagicRupiah = Math.round(estimatedMagicDiamonds * 250); // Approx Rp 250/diamond

  // Zodiac calculation (100 points max)
  const zodiacPointsLeft = Math.max(0, 100 - (parseInt(currentZodiacStars) || 0));
  const estimatedZodiacDiamonds = zodiacPointsLeft * 14;
  const estimatedZodiacRupiah = Math.round(estimatedZodiacDiamonds * 250);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full my-8 overflow-hidden shadow-2xl relative text-slate-800 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Kalkulator Gaming MLBB
              </h3>
              <p className="text-xs text-slate-500">
                Hitung target Win Rate & estimasi Diamond Magic Wheel / Zodiac
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('wr')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'wr'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🏆 Kalkulator Win Rate (WR)
          </button>
          <button
            onClick={() => setActiveTab('magic')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'magic'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ✨ Magic Wheel Legend
          </button>
          <button
            onClick={() => setActiveTab('zodiac')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'zodiac'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ♈ Zodiac Skin
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'wr' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Total Pertandingan Anda (Match)
                  </label>
                  <input
                    type="number"
                    value={totalMatches}
                    onChange={(e) => setTotalMatches(e.target.value)}
                    placeholder="Contoh: 850"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Win Rate Saat Ini (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentWR}
                      onChange={(e) => setCurrentWR(e.target.value)}
                      placeholder="Contoh: 54.2"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Target Win Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={targetWR}
                      onChange={(e) => setTargetWR(e.target.value)}
                      placeholder="Contoh: 60.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateWinRate}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Hitung Jumlah Kemenangan (Win Streak)
                </button>
              </div>

              {/* Result Box */}
              {requiredWins !== null && (
                <div className="bg-slate-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1 shadow-xs">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                    Hasil Perhitungan:
                  </span>
                  <p className="text-sm text-slate-600">
                    Kamu memerlukan sekitar:
                  </p>
                  <p className="text-3xl font-black text-amber-600 my-1">
                    {requiredWins >= 99999 ? 'Mustahil 100%' : `${requiredWins} Match`}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold">
                    Kemenangan berturut-turut (Win Streak) tanpa kalah!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'magic' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Magic Core / Poin Magic Wheel Saat Ini (0 - 200)
                </label>
                <input
                  type="number"
                  max={200}
                  value={currentMagicPoints}
                  onChange={(e) => setCurrentMagicPoints(e.target.value)}
                  placeholder="Contoh: 120"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Poin Tersisa Menuju Skin Legend</span>
                  <span className="font-bold text-slate-900">{magicPointsLeft} Poin</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Diamond Diperlukan</span>
                  <span className="font-bold text-indigo-600">~{estimatedMagicDiamonds} Diamonds</span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2 text-sm font-black">
                  <span>Estimasi Biaya Rupiah</span>
                  <span className="text-slate-900">{formatRupiah(estimatedMagicRupiah)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'zodiac' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bintang Zodiac Saat Ini (0 - 100)
                </label>
                <input
                  type="number"
                  max={100}
                  value={currentZodiacStars}
                  onChange={(e) => setCurrentZodiacStars(e.target.value)}
                  placeholder="Contoh: 45"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs shadow-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Bintang Tersisa Menuju Skin Zodiac</span>
                  <span className="font-bold text-slate-900">{zodiacPointsLeft} Bintang</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Diamond Diperlukan</span>
                  <span className="font-bold text-indigo-600">~{estimatedZodiacDiamonds} Diamonds</span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2 text-sm font-black">
                  <span>Estimasi Biaya Rupiah</span>
                  <span className="text-slate-900">{formatRupiah(estimatedZodiacRupiah)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <button
            onClick={() => {
              onClose();
              onTopUpMLBB();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <span>Top Up Diamond MLBB Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
