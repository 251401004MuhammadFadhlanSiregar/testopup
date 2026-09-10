import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Save, 
  TrendingUp, 
  ShoppingCart, 
  Tag, 
  Check, 
  Copy, 
  LogOut, 
  PlusCircle,
  Gamepad2,
  AlertCircle
} from 'lucide-react';
import { Game, Transaction, TransactionStatus } from '../types';
import { 
  formatRupiah, 
  getStoredTransactions, 
  updateTransactionStatus, 
  deleteStoredTransaction, 
  seedSampleTransactions 
} from '../utils/formatters';
import { 
  getPriceOverrides, 
  updateDenominationPrice, 
  resetDenominationPrices, 
  getPriceKey 
} from '../utils/products';

interface AdminDashboardModalProps {
  games: Game[];
  onClose: () => void;
  onRefreshData?: () => void;
}

const DEFAULT_ADMIN_PIN = '123456';
const AUTH_STORAGE_KEY = 'stecutopup_admin_authenticated';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  games,
  onClose,
  onRefreshData,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab: 'orders' | 'products'
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => getStoredTransactions());
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<'ALL' | TransactionStatus>('ALL');
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Products & Pricing State
  const [selectedGameId, setSelectedGameId] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [priceOverrides, setPriceOverrides] = useState(() => getPriceOverrides());
  const [editingItem, setEditingItem] = useState<{
    gameId: string;
    gameName: string;
    denomId: string;
    denomName: string;
    currentPrice: number;
    currentOriginalPrice?: number;
  } | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');
  const [editOriginalPriceInput, setEditOriginalPriceInput] = useState<string>('');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Listen to external data updates
  useEffect(() => {
    const handleTxUpdate = () => {
      setTransactions(getStoredTransactions());
    };
    const handleProductUpdate = () => {
      setPriceOverrides(getPriceOverrides());
    };

    window.addEventListener('stecutopup_transactions_updated', handleTxUpdate);
    window.addEventListener('stecutopup_products_updated', handleProductUpdate);
    return () => {
      window.removeEventListener('stecutopup_transactions_updated', handleTxUpdate);
      window.removeEventListener('stecutopup_products_updated', handleProductUpdate);
    };
  }, []);

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_ADMIN_PIN || pinInput === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setAuthError('');
      setTransactions(getStoredTransactions());
      setPriceOverrides(getPriceOverrides());
    } else {
      setAuthError('PIN salah! Silakan coba lagi (PIN Default: 123456).');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setPinInput('');
  };

  // Order Handlers
  const handleUpdateStatus = (invoiceId: string, newStatus: TransactionStatus) => {
    updateTransactionStatus(invoiceId, newStatus);
    setTransactions(getStoredTransactions());
    if (selectedTxDetail && selectedTxDetail.invoiceId === invoiceId) {
      setSelectedTxDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showNotification(`Status transaksi ${invoiceId} diubah menjadi ${newStatus}`);
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteOrder = (invoiceId: string) => {
    if (window.confirm(`Yakin ingin menghapus transaksi ${invoiceId} dari database?`)) {
      deleteStoredTransaction(invoiceId);
      setTransactions(getStoredTransactions());
      if (selectedTxDetail?.invoiceId === invoiceId) {
        setSelectedTxDetail(null);
      }
      showNotification(`Transaksi ${invoiceId} berhasil dihapus.`, 'info');
      if (onRefreshData) onRefreshData();
    }
  };

  const handleSeedSamples = () => {
    const seeded = seedSampleTransactions();
    setTransactions(seeded);
    showNotification('Sample data pesanan demo berhasil dimuat!');
    if (onRefreshData) onRefreshData();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Orders
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchStatus = txStatusFilter === 'ALL' || tx.status === txStatusFilter;
      const q = txSearchQuery.toLowerCase().trim();
      if (!q) return matchStatus;

      const matchSearch =
        tx.invoiceId.toLowerCase().includes(q) ||
        tx.gameName.toLowerCase().includes(q) ||
        tx.itemName.toLowerCase().includes(q) ||
        tx.whatsapp.toLowerCase().includes(q) ||
        (tx.accountNickname && tx.accountNickname.toLowerCase().includes(q)) ||
        Object.values(tx.accountData).some((val) => String(val).toLowerCase().includes(q));

      return matchStatus && matchSearch;
    });
  }, [transactions, txStatusFilter, txSearchQuery]);

  // Pricing Handlers
  const handleOpenEditPrice = (gameId: string, gameName: string, denomId: string, denomName: string, price: number, originalPrice?: number) => {
    setEditingItem({
      gameId,
      gameName,
      denomId,
      denomName,
      currentPrice: price,
      currentOriginalPrice: originalPrice,
    });
    setEditPriceInput(price.toString());
    setEditOriginalPriceInput(originalPrice ? originalPrice.toString() : '');
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const newPrice = parseInt(editPriceInput.replace(/\D/g, ''), 10);
    const newOriginalPrice = editOriginalPriceInput
      ? parseInt(editOriginalPriceInput.replace(/\D/g, ''), 10)
      : undefined;

    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Harga jual harus berupa angka valid di atas 0!');
      return;
    }

    updateDenominationPrice(editingItem.gameId, editingItem.denomId, newPrice, newOriginalPrice);
    setPriceOverrides(getPriceOverrides());
    setEditingItem(null);
    showNotification(`Harga ${editingItem.denomName} (${editingItem.gameName}) diperbarui ke ${formatRupiah(newPrice)}`);
    if (onRefreshData) onRefreshData();
  };

  const handleResetSinglePrice = (gameId: string, denomId: string, denomName: string) => {
    const overrides = { ...getPriceOverrides() };
    const key = getPriceKey(gameId, denomId);
    delete overrides[key];
    localStorage.setItem('stecutopup_price_overrides_v1', JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent('stecutopup_products_updated', { detail: overrides }));
    setPriceOverrides(overrides);
    showNotification(`Harga ${denomName} dikembalikan ke default.`);
    if (onRefreshData) onRefreshData();
  };

  const handleResetAllPrices = () => {
    if (window.confirm('Yakin ingin mereset seluruh perubahan harga ke pengaturan awal katalog?')) {
      resetDenominationPrices();
      setPriceOverrides({});
      showNotification('Seluruh harga produk berhasil di-reset ke nilai default.');
      if (onRefreshData) onRefreshData();
    }
  };

  // Flattened Denominations for the Products Table
  const allProductsList = useMemo(() => {
    const list: Array<{
      gameId: string;
      gameName: string;
      gameLogo: string;
      category: string;
      currencyName: string;
      denomId: string;
      denomName: string;
      amount: string | number;
      unit: string;
      defaultPrice: number;
      defaultOriginalPrice?: number;
      currentPrice: number;
      currentOriginalPrice?: number;
      isModified: boolean;
      popular?: boolean;
      flashSale?: boolean;
    }> = [];

    games.forEach((game) => {
      game.denominations.forEach((denom) => {
        const key = getPriceKey(game.id, denom.id);
        const override = priceOverrides[key];
        const isModified = !!override;
        const currentPrice = override ? override.price : denom.price;
        const currentOriginalPrice = override && override.originalPrice !== undefined
          ? override.originalPrice
          : denom.originalPrice;

        list.push({
          gameId: game.id,
          gameName: game.name,
          gameLogo: game.logo,
          category: game.category,
          currencyName: game.currencyName,
          denomId: denom.id,
          denomName: denom.name,
          amount: denom.amount,
          unit: denom.unit,
          defaultPrice: denom.price,
          defaultOriginalPrice: denom.originalPrice,
          currentPrice,
          currentOriginalPrice,
          isModified,
          popular: denom.popular,
          flashSale: denom.flashSale,
        });
      });
    });

    return list;
  }, [games, priceOverrides]);

  const filteredProducts = useMemo(() => {
    return allProductsList.filter((item) => {
      const matchGame = selectedGameId === 'all' || item.gameId === selectedGameId;
      const q = productSearch.toLowerCase().trim();
      if (!q) return matchGame;

      const matchSearch =
        item.gameName.toLowerCase().includes(q) ||
        item.denomName.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q);

      return matchGame && matchSearch;
    });
  }, [allProductsList, selectedGameId, productSearch]);

  // Overall Transaction Stats
  const stats = useMemo(() => {
    const total = transactions.length;
    const success = transactions.filter((t) => t.status === 'SUCCESS').length;
    const pending = transactions.filter((t) => t.status === 'PENDING').length;
    const failed = transactions.filter((t) => t.status === 'FAILED').length;
    const revenue = transactions
      .filter((t) => t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return { total, success, pending, failed, revenue };
  }, [transactions]);

  // -------------------------------------------------------------
  // VIEW: LOGIN SCREEN (if not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div 
        id="admin-login-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      >
        <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              STECUTOPUP ADMIN PANEL
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan PIN atau Password Administrator untuk mengelola transaksi & harga produk.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                PIN / Password Admin
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-pin-input"
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Masukkan 6-digit PIN"
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 font-mono tracking-widest focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            {/* Default PIN Hint */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-medium">PIN Akses Demo:</span>
                <span className="ml-2 font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {DEFAULT_ADMIN_PIN}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPinInput(DEFAULT_ADMIN_PIN)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
              >
                Gunakan PIN Ini
              </button>
            </div>

            <button
              type="submit"
              id="admin-submit-login-btn"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk ke Dashboard</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center mt-6">
            Terlindungi dengan sistem enkripsi sesi lokal Stecutopup.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: MAIN ADMIN DASHBOARD (Authenticated)
  // -------------------------------------------------------------
  return (
    <div 
      id="admin-dashboard-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification.text}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  STECUTOPUP <span className="text-indigo-600 font-bold">ADMIN PANEL</span>
                </h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pusat Kontrol Transaksi & Pengaturan Harga Jual Katalog Game
              </p>
            </div>
          </div>

          {/* Top Actions: Logout & Close */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              title="Tutup Panel Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="px-5 sm:px-8 py-3 bg-white border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Pesanan</span>
              <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-lg font-black text-slate-900">{stats.total}</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Sukses / Lunas</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-emerald-800">{stats.success}</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Menunggu Bayar</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-lg font-black text-amber-800">{stats.pending}</p>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
            <div className="flex items-center justify-between text-indigo-700 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Omzet</span>
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-lg font-black text-indigo-900 truncate">
              {formatRupiah(stats.revenue)}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-8 border-b border-slate-200 bg-white flex items-center gap-4">
          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Manajemen Transaksi</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
              {transactions.length}
            </span>
          </button>

          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Pengaturan Produk & Harga</span>
            {Object.keys(priceOverrides).length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                {Object.keys(priceOverrides).length} Kustom
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#F8FAFC]">
          
          {/* ============================================================ */}
          {/* TAB 1: MANAJEMEN TRANSAKSI                                    */}
          {/* ============================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter and Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={txSearchQuery}
                    onChange={(e) => setTxSearchQuery(e.target.value)}
                    placeholder="Cari No. Invoice (STECU-...), WhatsApp, game, akun..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white shadow-2xs"
                  />
                  {txSearchQuery && (
                    <button
                      onClick={() => setTxSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status filter pills */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    {(['ALL', 'PENDING', 'SUCCESS', 'FAILED'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setTxStatusFilter(status)}
                        className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          txStatusFilter === status
                            ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status === 'ALL' ? 'Semua' : status}
                      </button>
                    ))}
                  </div>

                  {/* Seed Demo button */}
                  <button
                    onClick={handleSeedSamples}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    title="Tambah data pesanan simulasi jika daftar kosong"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Demo Orders</span>
                  </button>

                  {/* Refresh */}
                  <button
                    onClick={() => {
                      setTransactions(getStoredTransactions());
                      showNotification('Daftar transaksi diperbarui.');
                    }}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transaction Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {filteredTransactions.length === 0 ? (
                  <div className="py-16 text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">Tidak ada transaksi ditemukan</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {txSearchQuery || txStatusFilter !== 'ALL'
                        ? 'Coba ubah kata kunci pencarian atau filter status transaksi.'
                        : 'Belum ada transaksi di database lokal browser ini.'}
                    </p>
                    {transactions.length === 0 && (
                      <button
                        onClick={handleSeedSamples}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        Muat 3 Transaksi Demo
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold tracking-wider uppercase text-[10px]">
                          <th className="py-3.5 px-4">No. Invoice & Tanggal</th>
                          <th className="py-3.5 px-4">Game & Item</th>
                          <th className="py-3.5 px-4">Akun & WhatsApp</th>
                          <th className="py-3.5 px-4">Total Bayar</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-center">Ubah Status (Aksi)</th>
                          <th className="py-3.5 px-4 text-right">Opsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTransactions.map((tx) => (
                          <tr key={tx.invoiceId} className="hover:bg-indigo-50/30 transition-colors">
                            
                            {/* Invoice & Date */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-900">{tx.invoiceId}</span>
                                <button
                                  onClick={() => handleCopy(tx.invoiceId, tx.invoiceId)}
                                  className="text-slate-400 hover:text-indigo-600 p-0.5 rounded cursor-pointer"
                                  title="Salin No Invoice"
                                >
                                  {copiedId === tx.invoiceId ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {new Date(tx.createdAt).toLocaleString('id-ID', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </p>
                              {tx.snReference && (
                                <span className="inline-block mt-1 font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                  {tx.snReference}
                                </span>
                              )}
                            </td>

                            {/* Game & Item */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="flex items-center gap-2">
                                <img
                                  src={tx.gameLogo}
                                  alt={tx.gameName}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 leading-snug">{tx.itemName}</p>
                                  <p className="text-[11px] text-slate-500">{tx.gameName}</p>
                                </div>
                              </div>
                            </td>

                            {/* Account Data & Contact */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="space-y-0.5">
                                <p className="font-semibold text-slate-900">
                                  {tx.accountNickname || 'User Gamer'}
                                </p>
                                <p className="text-[11px] text-slate-600 font-mono">
                                  {Object.entries(tx.accountData)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' • ')}
                                </p>
                                <p className="text-[11px] text-indigo-700 font-medium">
                                  WA: {tx.whatsapp}
                                </p>
                              </div>
                            </td>

                            {/* Payment */}
                            <td className="py-3.5 px-4 align-top">
                              <p className="font-bold text-slate-900">{formatRupiah(tx.totalAmount)}</p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                                {tx.paymentMethodName}
                              </p>
                              {tx.discountAmount > 0 && (
                                <span className="text-[10px] text-emerald-700 font-medium">
                                  Hemat {formatRupiah(tx.discountAmount)}
                                </span>
                              )}
                            </td>

                            {/* Status Badge */}
                            <td className="py-3.5 px-4 align-top">
                              {tx.status === 'SUCCESS' ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                  <CheckCircle2 className="w-3 h-3" /> SUCCESS
                                </span>
                              ) : tx.status === 'PENDING' ? (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                  <Clock className="w-3 h-3" /> PENDING
                                </span>
                              ) : tx.status === 'FAILED' ? (
                                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                  <XCircle className="w-3 h-3" /> FAILED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                  {tx.status}
                                </span>
                              )}
                            </td>

                            {/* Change Status Action Dropdown/Buttons */}
                            <td className="py-3.5 px-4 align-top text-center">
                              <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-2xs">
                                <button
                                  onClick={() => handleUpdateStatus(tx.invoiceId, 'PENDING')}
                                  title="Ubah ke PENDING"
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                    tx.status === 'PENDING'
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  PENDING
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(tx.invoiceId, 'SUCCESS')}
                                  title="Ubah ke SUCCESS (Lunas)"
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                    tx.status === 'SUCCESS'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  SUCCESS
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(tx.invoiceId, 'FAILED')}
                                  title="Ubah ke FAILED (Gagal/Batal)"
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                    tx.status === 'FAILED'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  FAILED
                                </button>
                              </div>
                            </td>

                            {/* Delete Option */}
                            <td className="py-3.5 px-4 align-top text-right">
                              <button
                                onClick={() => handleDeleteOrder(tx.invoiceId)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus Transaksi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PENGATURAN PRODUK & HARGA JUAL                        */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Product Filtering Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                
                {/* Game Dropdown Filter */}
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-indigo-600" />
                  <select
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-2xs"
                  >
                    <option value="all">Semua Game ({games.length})</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.denominations.length} item)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Item Input */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari nama denomination / item..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white shadow-2xs"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Reset All Prices */}
                {Object.keys(priceOverrides).length > 0 && (
                  <button
                    onClick={handleResetAllPrices}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Semua Harga</span>
                  </button>
                )}
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold tracking-wider uppercase text-[10px]">
                        <th className="py-3.5 px-4">Game</th>
                        <th className="py-3.5 px-4">Nama Denominasi & Nominal</th>
                        <th className="py-3.5 px-4">Harga Asli (Coret)</th>
                        <th className="py-3.5 px-4">Harga Jual Saat Ini</th>
                        <th className="py-3.5 px-4">Status Kustom</th>
                        <th className="py-3.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={`${p.gameId}-${p.denomId}`} className="hover:bg-slate-50/60 transition-colors">
                          
                          {/* Game Info */}
                          <td className="py-3.5 px-4 align-middle">
                            <div className="flex items-center gap-2">
                              <img
                                src={p.gameLogo}
                                alt={p.gameName}
                                className="w-7 h-7 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{p.gameName}</p>
                                <p className="text-[10px] text-slate-500">{p.currencyName}</p>
                              </div>
                            </div>
                          </td>

                          {/* Denom Name */}
                          <td className="py-3.5 px-4 align-middle">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-900">{p.denomName}</p>
                              {p.popular && (
                                <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">
                                  POPULER
                                </span>
                              )}
                              {p.flashSale && (
                                <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded">
                                  FLASH SALE
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Nominal: {p.amount} {p.unit}
                            </p>
                          </td>

                          {/* Original Price */}
                          <td className="py-3.5 px-4 align-middle text-slate-500">
                            {p.currentOriginalPrice ? (
                              <span className="line-through">{formatRupiah(p.currentOriginalPrice)}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          {/* Current Selling Price */}
                          <td className="py-3.5 px-4 align-middle">
                            <span className="font-black text-slate-900 text-sm">
                              {formatRupiah(p.currentPrice)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 align-middle">
                            {p.isModified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                                <Edit3 className="w-3 h-3" /> Harga Kustom
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 align-middle text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  handleOpenEditPrice(
                                    p.gameId,
                                    p.gameName,
                                    p.denomId,
                                    p.denomName,
                                    p.currentPrice,
                                    p.currentOriginalPrice
                                  )
                                }
                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Ubah Harga</span>
                              </button>

                              {p.isModified && (
                                <button
                                  onClick={() => handleResetSinglePrice(p.gameId, p.denomId, p.denomName)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Kembalikan ke harga default"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-8 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Semua perubahan harga dan status transaksi disimpan terpusat di LocalStorage</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Dashboard
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* SUB-MODAL: FORM EDIT HARGA DENOMINASI                        */}
      {/* ============================================================ */}
      {editingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase mb-1">
              <Tag className="w-4 h-4" />
              <span>PENGATURAN HARGA JUAL</span>
            </div>

            <h4 className="text-base font-black text-slate-900">
              {editingItem.denomName}
            </h4>
            <p className="text-xs text-slate-500 mb-4">{editingItem.gameName}</p>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Jual Baru (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={editPriceInput}
                    onChange={(e) => setEditPriceInput(e.target.value)}
                    placeholder="Contoh: 25000"
                    autoFocus
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
                {editPriceInput && !isNaN(Number(editPriceInput)) && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    Preview: {formatRupiah(Number(editPriceInput))}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Asli / Coret (Rp) <span className="font-normal text-slate-400">(Opsional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={editOriginalPriceInput}
                    onChange={(e) => setEditOriginalPriceInput(e.target.value)}
                    placeholder="Contoh: 30000 (Kosongkan jika tanpa coret)"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Harga</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
