import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  User, 
  Bot, 
  CheckCheck,
  PhoneCall
} from 'lucide-react';

interface LiveChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const LiveChatWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Halo Gamer! 👋 Selamat datang di Layanan Pelanggan Resmi Stecutopup 24/7. Ada yang bisa kami bantu seputar top up game atau pembayaran QRIS hari ini?',
      time: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: LiveChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate automated smart CS reply
    setTimeout(() => {
      let botResponse = 'Customer Support kami siap membantu! Semua pesanan dengan QRIS diverifikasi dalam 1 detik secara otomatis. Jika ada kendala, sertakan nomor invoice kamu ya.';

      const lower = text.toLowerCase();
      if (lower.includes('qris') || lower.includes('bayar')) {
        botResponse = 'Pembayaran via QRIS di Stecutopup mendukung semua aplikasi m-Banking (BCA, Mandiri, BRI, BNI) dan E-Wallet (GoPay, DANA, OVO, ShopeePay). Setelah scan, status langsung berubah Lunas dalam 1 detik tanpa perlu kirim bukti transfer!';
      } else if (lower.includes('mlbb') || lower.includes('diamond') || lower.includes('mobile legend')) {
        botResponse = 'Untuk top up MLBB, cukup masukkan User ID dan Zone ID (di dalam kurung). Pilih nominal Weekly Diamond Pass atau paket Diamond, lalu bayar via QRIS.';
      } else if (lower.includes('berapa lama') || lower.includes('proses') || lower.includes('masuk')) {
        botResponse = 'Semua transaksi di Stecutopup berstatus OTOMATIS & INSTAN. Rata-rata item game masuk ke akun dalam 1 hingga 5 detik setelah pembayaran terverifikasi!';
      } else if (lower.includes('legal') || lower.includes('aman') || lower.includes('banned')) {
        botResponse = 'Stecutopup 100% Legal dan resmi langsung terhubung ke publisher resmi (Moonton, Garena, HoYoverse, Riot Games). Akun Anda dijamin aman 100% dari banned.';
      }

      const botMsg: LiveChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const quickQuestions = [
    'Berapa lama diamond MLBB masuk?',
    'Bagaimana cara bayar pakai QRIS?',
    'Apakah top up di sini aman & legal?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] text-slate-800 animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-sm text-slate-900">Customer Support 24/7</h4>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Stecutopup Live Helpdesk</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
        {messages.map((m) => {
          const isBot = m.sender === 'bot';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-100">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isBot
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                    : 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                }`}
              >
                <p>{m.text}</p>
                <div className={`text-[9px] mt-1 flex items-center gap-1 ${isBot ? 'text-slate-400' : 'text-indigo-200 justify-end'}`}>
                  <span>{m.time}</span>
                  {!isBot && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pertanyaan atau nomor invoice..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
