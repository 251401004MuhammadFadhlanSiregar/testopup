import React, { useRef } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Printer, 
  Zap, 
  Sparkles,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface InvoiceViewProps {
  transaction: Transaction;
  onBackToHome: () => void;
  onTopUpAgain: (gameId: string) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  transaction,
  onBackToHome,
  onTopUpAgain,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*BUKTI PEMBAYARAN TOP UP - STECUTOPUP*\n\n` +
      `No. Invoice: ${transaction.invoiceId}\n` +
      `Game: ${transaction.gameName}\n` +
      `Item: ${transaction.itemName}\n` +
      `User ID: ${transaction.accountData['userId']} ${transaction.accountData['zoneId'] ? `(${transaction.accountData['zoneId']})` : ''}\n` +
      `Total Bayar: ${formatRupiah(transaction.totalAmount)}\n` +
      `Metode: ${transaction.paymentMethodName}\n` +
      `Status: SUKSES / LUNAS\n` +
      `SN Ref: ${transaction.snReference || 'SN-AUTO-2026'}\n\n` +
      `Terima kasih telah top up di Stecutopup!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Back Navigation */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 text-xs font-semibold mb-6 transition-colors shadow-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Game</span>
      </button>

      {/* Invoice Card */}
      <div 
        ref={invoiceRef}
        className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative"
      >
        {/* Status Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white fill-emerald-600" />
          </div>
          <span className="bg-black/20 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            TRANSAKSI BERHASIL & SELESAI
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Top Up Sukses Terkirim!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 mt-1 max-w-md mx-auto">
            Item game telah berhasil dikirim ke akun Anda secara otomatis via integrasi server provider.
          </p>
        </div>

        {/* Invoice Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs text-slate-500">Nomor Invoice</span>
              <p className="text-base sm:text-lg font-mono font-black text-indigo-600">
                {transaction.invoiceId}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-500">Waktu Transaksi</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {new Date(transaction.createdAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })} WIB
              </p>
            </div>
          </div>

          {/* Serial Number (SN Reference) Badge */}
          {transaction.snReference && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">Nomor Seri / SN Reference (Bukti Resmi):</span>
                  <p className="text-sm font-mono font-bold text-slate-900 tracking-wide">
                    {transaction.snReference}
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                TERVERIFIKASI MOONTON/GARENA
              </span>
            </div>
          )}

          {/* Detailed Transaction Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rincian Akun & Item Game
            </h4>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 text-xs sm:text-sm shadow-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Nama Game</span>
                <span className="font-bold text-slate-900">{transaction.gameName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Item Dibeli</span>
                <span className="font-bold text-indigo-700">{transaction.itemName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">User ID Akun</span>
                <span className="font-mono font-bold text-slate-900">
                  {transaction.accountData['userId']}{' '}
                  {transaction.accountData['zoneId'] ? `(${transaction.accountData['zoneId']})` : ''}
                  {transaction.accountData['server'] ? ` [${transaction.accountData['server']}]` : ''}
                </span>
              </div>

              {transaction.accountNickname && (
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Nickname Game</span>
                  <span className="font-bold text-indigo-600">{transaction.accountNickname}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Metode Pembayaran</span>
                <span className="font-semibold text-slate-900">{transaction.paymentMethodName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Nomor WhatsApp</span>
                <span className="font-semibold text-slate-900">{transaction.whatsapp}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-500">Harga Item</span>
                <span className="text-slate-900">{formatRupiah(transaction.itemPrice)}</span>
              </div>

              {transaction.paymentFee > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Biaya Layanan</span>
                  <span className="text-slate-900">{formatRupiah(transaction.paymentFee)}</span>
                </div>
              )}

              {transaction.discountAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200/80 text-emerald-600 font-semibold">
                  <span>Diskon Promo ({transaction.promoCode})</span>
                  <span>- {formatRupiah(transaction.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 text-base font-black">
                <span className="text-slate-900">Total Pembayaran</span>
                <span className="text-indigo-600 text-lg">{formatRupiah(transaction.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                id="btn-invoice-print"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200 shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Cetak Invoice</span>
              </button>

              <button
                id="btn-invoice-wa"
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Kirim Bukti WhatsApp</span>
              </button>
            </div>

            <button
              id="btn-invoice-buy-again"
              onClick={() => onTopUpAgain(transaction.gameId)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Top Up Lagi</span>
            </button>
          </div>

          {/* Trust Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3 text-xs text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p>
              Simpan nomor invoice ini jika Anda membutuhkan bantuan lebih lanjut dengan Customer Support Stecutopup 24/7.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
