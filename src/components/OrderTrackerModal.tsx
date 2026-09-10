import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  History, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  QrCode,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Transaction } from '../types';
import { getStoredTransactions, formatRupiah } from '../utils/formatters';

interface OrderTrackerModalProps {
  onClose: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onContinuePayment: (tx: Transaction) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  onClose,
  onSelectTransaction,
  onContinuePayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredResults, setFilteredResults] = useState<Transaction[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const list = getStoredTransactions();
    setTransactions(list);
    setFilteredResults(list);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!searchQuery.trim()) {
      setFilteredResults(transactions);
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const results = transactions.filter(
      (tx) =>
        tx.invoiceId.toLowerCase().includes(q) ||
        tx.whatsapp.toLowerCase().includes(q) ||
        tx.gameName.toLowerCase().includes(q) ||
        tx.accountData['userId']?.toLowerCase().includes(q)
    );
    setFilteredResults(results);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative text-slate-800 animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Lacak Pesanan & Cek Riwayat Transaksi
              </h3>
              <p className="text-xs text-slate-500">
                Pantau status pengiriman item game & unduh invoice transaksi
              </p>
            </div>
          </div>

          <button
            id="btn-close-tracker-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Search Input Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="tracker-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan No. Invoice (STECU-...) atau Nomor WhatsApp"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              id="btn-tracker-submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              Cari Pesanan
            </button>
          </form>

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{hasSearched ? `Hasil Pencarian (${filteredResults.length})` : `Riwayat Transaksi Terakhir (${transactions.length})`}</span>
            </div>

            {filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((tx) => {
                  const isSuccess = tx.status === 'SUCCESS';
                  const isPending = tx.status === 'PENDING';

                  return (
                    <div
                      key={tx.invoiceId}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                          {isSuccess ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600">
                              {tx.invoiceId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isSuccess
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {isSuccess ? 'LUNAS / BERHASIL' : 'MENUNGGU PEMBAYARAN'}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-900 mt-1">
                            {tx.gameName} • {tx.itemName}
                          </p>
                          <p className="text-xs text-slate-500">
                            User ID: {tx.accountData['userId']} | {formatRupiah(tx.totalAmount)} via {tx.paymentMethodName}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => {
                              onContinuePayment(tx);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Bayar Sekarang</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectTransaction(tx);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Lihat Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Belum ada transaksi ditemukan</p>
                <p className="text-xs text-slate-500 mt-1">
                  Coba periksa kembali nomor invoice Anda atau lakukan top up pertama Anda!
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
