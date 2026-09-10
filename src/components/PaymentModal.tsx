import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  HelpCircle,
  ExternalLink,
  Wallet,
  Building2,
  Store,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, updateTransactionStatus } from '../utils/formatters';

interface PaymentModalProps {
  transaction: Transaction;
  onClose: () => void;
  onPaymentSuccess: (updatedTx: Transaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  transaction,
  onClose,
  onPaymentSuccess,
}) => {
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [qrisDataUrl, setQrisDataUrl] = useState<string>('');
  
  // Timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 900 seconds
  const [isProcessingSimulation, setIsProcessingSimulation] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'bca' | 'gopay' | 'dana' | 'shopee'>('gopay');

  // Generate real QR code image from transaction payload
  useEffect(() => {
    const payload = transaction.qrisPayload || `00020101021226580014ID.LINKAJA.WWW0118936009180000000000520458125303360540${transaction.totalAmount}5802ID5921STECUTOPUP OFFICIAL6007JAKARTA61051011062070703A016304${transaction.invoiceId.slice(-4)}`;
    
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrisDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [transaction]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: 'invoice' | 'amount' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'invoice') {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
    } else if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Simulate Instant Payment via QRIS Scan / Webhook
  const handleSimulatePayment = () => {
    setIsProcessingSimulation(true);
    
    // Simulate webhook arrival and top-up delivery in 2 seconds
    setTimeout(() => {
      const snRef = `SN-STECU${Math.floor(10000000 + Math.random() * 90000000)}`;
      const updated = updateTransactionStatus(transaction.invoiceId, 'SUCCESS', snRef);
      setIsProcessingSimulation(false);

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (updated) {
        onPaymentSuccess(updated);
      }
    }, 1800);
  };

  const isQris = transaction.paymentMethodId === 'qris_fast' || transaction.paymentMethodId.includes('qris');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-xl w-full my-8 overflow-hidden shadow-2xl relative text-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              {isQris ? <QrCode className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {isQris ? 'Pembayaran QRIS Real-Time' : `Pembayaran ${transaction.paymentMethodName}`}
              </h3>
              <p className="text-[11px] text-slate-500">
                Invoice: <span className="font-mono text-indigo-600 font-semibold">{transaction.invoiceId}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-close-payment-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Top Expiration & Total Amount Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[11px] text-slate-500">Total Yang Harus Dibayar:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {formatRupiah(transaction.totalAmount)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(transaction.totalAmount.toString(), 'amount')}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 border border-slate-200 cursor-pointer shadow-xs"
                  title="Salin Nominal"
                >
                  {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4 text-rose-600 animate-spin" />
              <div className="text-right">
                <p className="text-[10px] text-rose-700 uppercase tracking-wider font-bold">Sisa Waktu</p>
                <p className="text-sm font-mono font-bold text-rose-900">{formatTimer(timeLeft)}</p>
              </div>
            </div>
          </div>

          {/* QRIS OFFICIAL CARD */}
          {isQris ? (
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-sm border-2 border-slate-200 flex flex-col items-center">
              
              {/* QRIS Header Banner */}
              <div className="w-full flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded tracking-tighter">
                    QRIS
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 tracking-wider">
                    QR PEMBAYARAN NASIONAL
                  </span>
                </div>
                <div className="bg-slate-900 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                  GPN
                </div>
              </div>

              {/* Merchant Details */}
              <div className="text-center mb-3">
                <h4 className="font-extrabold text-base text-slate-900 tracking-tight uppercase">
                  STECUTOPUP OFFICIAL
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">NMID: ID1020038942918 • A01</p>
              </div>

              {/* QR Code Container */}
              <div className="relative p-3 bg-white border-2 border-slate-300 rounded-xl shadow-xs mb-3">
                {qrisDataUrl ? (
                  <img
                    src={qrisDataUrl}
                    alt="QRIS Stecutopup"
                    className="w-56 h-56 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-50">
                    <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                )}
                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-[11px] shadow-md border-2 border-white">
                    STECU
                  </div>
                </div>
              </div>

              {/* Supported Apps List */}
              <p className="text-[10px] text-slate-500 font-medium text-center max-w-xs mb-3">
                Scan QRIS di atas dengan aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, DANA, OVO, ShopeePay, LinkAja)
              </p>

              {/* Download / Save QR Button */}
              {qrisDataUrl && (
                <a
                  href={qrisDataUrl}
                  download={`QRIS-Stecutopup-${transaction.invoiceId}.png`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Gambar QRIS</span>
                </a>
              )}
            </div>
          ) : (
            /* Non-QRIS Payment Details (VA / Retail / E-Wallet) */
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Kode Pembayaran / Virtual Account:</span>
                <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Otomatis
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
                <span className="text-lg font-mono font-black text-slate-900 tracking-wider">
                  88019{transaction.accountData['userId']?.slice(0, 6) || '789123'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`88019${transaction.accountData['userId']?.slice(0, 6) || '789123'}`, 'code')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Kode</span>
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Nama Penerima: <strong className="text-slate-900">Stecutopup - {transaction.gameName}</strong>
              </p>
            </div>
          )}

          {/* SIMULATE INSTANT PAYMENT BUTTON */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center space-y-3 shadow-xs">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Simulasi Uji Coba Transaksi QRIS</span>
            </div>
            <p className="text-xs text-slate-600">
              Klik tombol di bawah untuk menyimulasikan pembayaran QRIS berhasil secara real-time dan melihat proses top up otomatis:
            </p>
            <button
              id="btn-simulate-qris-paid"
              onClick={handleSimulatePayment}
              disabled={isProcessingSimulation}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingSimulation ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Memverifikasi Pembayaran QRIS...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white fill-current" />
                  <span>Bayar Sekarang (Simulasi QRIS Scan Sukses)</span>
                </>
              )}
            </button>
          </div>

          {/* How to Pay Tabs Instructions */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Cara Melakukan Pembayaran
            </h5>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveStepTab('gopay')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeStepTab === 'gopay' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                GoPay / DANA / OVO
              </button>
              <button
                type="button"
                onClick={() => setActiveStepTab('bca')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeStepTab === 'bca' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                BCA Mobile / myBCA
              </button>
              <button
                type="button"
                onClick={() => setActiveStepTab('shopee')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeStepTab === 'shopee' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                Livin\' Mandiri / BRImo
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              {activeStepTab === 'gopay' && (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Buka aplikasi GoPay, DANA, OVO, atau ShopeePay.</li>
                  <li>Pilih menu <strong>Bayar</strong> atau <strong>Scan QR</strong>.</li>
                  <li>Scan QRIS di atas atau upload tangkapan layar (screenshot) QR.</li>
                  <li>Periksa nama merchant: <strong>STECUTOPUP OFFICIAL</strong>.</li>
                  <li>Masukkan PIN dan transaksi otomatis selesai dalam 1 detik!</li>
                </ol>
              )}
              {activeStepTab === 'bca' && (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Buka BCA Mobile (m-BCA) atau myBCA di ponsel Anda.</li>
                  <li>Tekan tombol <strong>QRIS</strong> di bagian tengah bawah.</li>
                  <li>Arahkan kamera ke kode QRIS di atas.</li>
                  <li>Konfirmasi nominal tagihan dan masukkan PIN m-BCA.</li>
                </ol>
              )}
              {activeStepTab === 'shopee' && (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Buka aplikasi Livin\' by Mandiri atau BRImo.</li>
                  <li>Pilih menu <strong>QR Bayar</strong>.</li>
                  <li>Scan kode QRIS dan konfirmasi transaksi dengan PIN Anda.</li>
                  <li>Status akan langsung berubah menjadi Lunas & item game terkirim.</li>
                </ol>
              )}
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Enkripsi
            </span>
            <span>•</span>
            <span>Bank Indonesia Certified QRIS</span>
          </div>

        </div>
      </div>
    </div>
  );
};
