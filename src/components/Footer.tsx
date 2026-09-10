import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  QrCode, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ExternalLink,
  MessageCircle,
  Clock,
  Heart
} from 'lucide-react';

export const Footer: React.FC<{ onOpenLiveChat: () => void; onOpenAdmin?: () => void }> = ({ onOpenLiveChat, onOpenAdmin }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-12">
      
      {/* Payment Partners Wall */}
      <div className="border-b border-slate-100 py-8 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
            Mendukung Seluruh Metode Pembayaran Resmi Indonesia
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="bg-white border border-slate-200 text-rose-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              QRIS
            </span>
            <span className="bg-white border border-slate-200 text-slate-800 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              GPN
            </span>
            <span className="bg-white border border-slate-200 text-blue-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              BCA
            </span>
            <span className="bg-white border border-slate-200 text-amber-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              MANDIRI
            </span>
            <span className="bg-white border border-slate-200 text-blue-700 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              BRI
            </span>
            <span className="bg-white border border-slate-200 text-orange-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              BNI
            </span>
            <span className="bg-white border border-slate-200 text-cyan-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              DANA
            </span>
            <span className="bg-white border border-slate-200 text-emerald-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              GOPAY
            </span>
            <span className="bg-white border border-slate-200 text-purple-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              OVO
            </span>
            <span className="bg-white border border-slate-200 text-orange-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              SHOPEEPAY
            </span>
            <span className="bg-white border border-slate-200 text-blue-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              INDOMARET
            </span>
            <span className="bg-white border border-slate-200 text-red-600 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              ALFAMART
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 p-0.5 shadow-sm">
                <div className="w-full h-full bg-indigo-600 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                </div>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                STECU<span className="text-indigo-600">TOPUP</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Stecutopup adalah platform top up game dan produk digital nomor 1 di Indonesia. Melayani top up Mobile Legends, Free Fire, Valorant, Genshin Impact, dan voucher game lainnya dengan sistem QRIS instan otomatis 24 jam.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% LEGAL RESMI
              </span>
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5" /> PROSES 1 DETIK
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Top Up Game Populer
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#game-catalog" className="hover:text-indigo-600 transition-colors">Mobile Legends (MLBB)</a></li>
              <li><a href="#game-catalog" className="hover:text-indigo-600 transition-colors">Free Fire & FF MAX</a></li>
              <li><a href="#game-catalog" className="hover:text-indigo-600 transition-colors">Valorant Points APAC</a></li>
              <li><a href="#game-catalog" className="hover:text-indigo-600 transition-colors">Genshin Impact Crystals</a></li>
              <li><a href="#game-catalog" className="hover:text-indigo-600 transition-colors">PUBG Mobile UC</a></li>
              <li><a href="#game-catalog" className="hover:text-indigo-600 transition-colors">Honor of Kings (HoK)</a></li>
            </ul>
          </div>

          {/* Tools & Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Fitur & Layanan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="text-slate-600">Integrasi QRIS Real-Time</span></li>
              <li><span className="text-slate-600">Kalkulator MLBB Win Rate</span></li>
              <li><span className="text-slate-600">Kalkulator Magic Wheel Legend</span></li>
              <li><span className="text-slate-600">Pelacakan Status Invoice</span></li>
              <li><span className="text-slate-600">Voucher Kode Promo Diskon</span></li>
              {onOpenAdmin && (
                <li>
                  <button 
                    onClick={onOpenAdmin} 
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>🛡️ Portal Admin (PIN)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Bantuan & CS 24/7
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>WhatsApp: +62 812-9988-7766</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>support@stecutopup.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Cyber 2 Tower, Jakarta Selatan</span>
              </li>
            </ul>

            <button
              onClick={onOpenLiveChat}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hubungi CS WhatsApp</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Stecutopup. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-indigo-600 cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer">API Kemitraan</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="text-slate-600 hover:text-indigo-600 font-bold cursor-pointer"
                >
                  Admin Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
