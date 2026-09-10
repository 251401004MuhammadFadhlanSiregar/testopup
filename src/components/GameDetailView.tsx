import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  Tag, 
  QrCode, 
  Wallet, 
  Building2, 
  Store, 
  Smartphone, 
  Flame, 
  Sparkles, 
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Game, Denomination, PaymentMethod, Transaction } from '../types';
import { PAYMENT_METHODS } from '../data/payments';
import { PROMO_CODES } from '../data/games';
import { formatRupiah, calculateFee } from '../utils/formatters';

interface GameDetailViewProps {
  game: Game;
  initialItemId?: string;
  onBack: () => void;
  onSubmitOrder: (orderData: {
    game: Game;
    item: Denomination;
    paymentMethod: PaymentMethod;
    accountData: Record<string, string>;
    accountNickname?: string;
    whatsapp: string;
    email?: string;
    promoCode?: string;
    discountAmount: number;
    paymentFee: number;
    totalAmount: number;
  }) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  initialItemId,
  onBack,
  onSubmitOrder,
}) => {
  // Form States
  const [accountData, setAccountData] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<Denomination | null>(() => {
    if (initialItemId) {
      const found = game.denominations.find((d) => d.id === initialItemId);
      if (found) return found;
    }
    return game.denominations.find((d) => d.popular) || game.denominations[0] || null;
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    PAYMENT_METHODS.find((p) => p.category === 'qris') || PAYMENT_METHODS[0]
  );
  const [activePaymentCategory, setActivePaymentCategory] = useState<string>('all');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  
  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Guide modal / tooltip state
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Simulated Nickname Check
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize fields with default server if applicable
  useEffect(() => {
    const initial: Record<string, string> = {};
    game.idFields.forEach((field) => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        initial[field.name] = field.options[0].value;
      } else {
        initial[field.name] = '';
      }
    });
    setAccountData(initial);
  }, [game]);

  const handleInputChange = (field: string, value: string) => {
    setAccountData((prev) => ({ ...prev, [field]: value }));
    setVerifiedNickname(null); // Reset nickname check
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCheckNickname = () => {
    // Check if main userId is filled
    const mainId = accountData['userId'];
    if (!mainId || mainId.trim().length < 3) {
      setErrors((prev) => ({ ...prev, userId: 'Masukkan User ID terlebih dahulu!' }));
      return;
    }

    setIsCheckingNickname(true);
    setTimeout(() => {
      setIsCheckingNickname(false);
      // Realistic simulated gamer nickname
      const sampleNames = ['StecuPro_Player', 'Garuda_Mythic', 'LegendaryHero_99', 'Sultan_Gaming', 'ProGamer_ID'];
      const randomNick = sampleNames[Math.floor(Math.random() * sampleNames.length)] + ` (${mainId.slice(-3)})`;
      setVerifiedNickname(randomNick);
    }, 600);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) return;

    const code = promoInput.trim().toUpperCase();
    const promo = PROMO_CODES[code];

    if (!promo) {
      setPromoError('Kode promo tidak valid atau telah kedaluwarsa.');
      return;
    }

    if (!selectedItem) {
      setPromoError('Pilih nominal item terlebih dahulu.');
      return;
    }

    if (selectedItem.price < promo.minSpend) {
      setPromoError(`Minimal belanja untuk promo ini adalah ${formatRupiah(promo.minSpend)}.`);
      return;
    }

    const calculatedDiscount = Math.min(
      Math.round((selectedItem.price * promo.discountPercent) / 100),
      promo.maxDiscount
    );

    setAppliedPromo({
      code,
      discount: calculatedDiscount,
      description: promo.description,
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  // Pricing calculations
  const itemPrice = selectedItem ? selectedItem.price : 0;
  const paymentFee = (selectedItem && selectedPayment) ? calculateFee(itemPrice, selectedPayment) : 0;
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const totalAmount = Math.max(0, itemPrice + paymentFee - discountAmount);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate account fields
    game.idFields.forEach((field) => {
      const val = accountData[field.name];
      if (!val || val.trim() === '') {
        newErrors[field.name] = `${field.label} wajib diisi.`;
      }
    });

    if (!selectedItem) {
      newErrors['item'] = 'Pilih nominal top up terlebih dahulu.';
    }

    if (!selectedPayment) {
      newErrors['payment'] = 'Pilih metode pembayaran.';
    }

    if (!whatsapp.trim()) {
      newErrors['whatsapp'] = 'Nomor WhatsApp wajib diisi untuk konfirmasi bukti pesanan.';
    } else if (whatsapp.length < 9) {
      newErrors['whatsapp'] = 'Format nomor WhatsApp tidak valid.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(`step-error-${firstErrorKey}`) || document.getElementById('step-1-container');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Submit valid order
    onSubmitOrder({
      game,
      item: selectedItem!,
      paymentMethod: selectedPayment!,
      accountData,
      accountNickname: verifiedNickname || undefined,
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      promoCode: appliedPromo?.code,
      discountAmount,
      paymentFee,
      totalAmount,
    });
  };

  const paymentCategoriesList = [
    { id: 'all', label: 'Semua Metode' },
    { id: 'qris', label: '⚡ QRIS Real-Time' },
    { id: 'ewallet', label: 'E-Wallet' },
    { id: 'va', label: 'Virtual Account' },
    { id: 'retail', label: 'Minimarket' },
    { id: 'pulsa', label: 'Pulsa' },
  ];

  const filteredPayments = activePaymentCategory === 'all'
    ? PAYMENT_METHODS
    : PAYMENT_METHODS.filter((p) => p.category === activePaymentCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        id="btn-back-to-home"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 text-xs font-semibold mb-6 transition-colors shadow-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda Game</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Game Profile Banner & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-24 shadow-xs">
            {/* Game Banner Header */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-900">
              <img
                src={game.banner}
                alt={game.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Profile Content */}
            <div className="p-5 -mt-12 relative z-10">
              <div className="flex items-end gap-3 mb-4">
                <img
                  src={game.logo}
                  alt={game.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
                />
                <div className="pb-1">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {game.publisher}
                  </span>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-1">
                    {game.name}
                  </h1>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {game.description}
              </p>

              {/* Guarantees Box */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                  <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Proses Otomatis 1 Detik Masuk</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold">
                  <QrCode className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Mendukung Pembayaran QRIS Semua Bank</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>100% Legal & Bergaransi Anti-Banned</span>
                </div>
              </div>

              {/* Guide Button */}
              {game.guideText && (
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="w-full mt-4 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Petunjuk Cara Menemukan User ID</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 4-Step Top Up Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Masukkan Data Akun */}
          <div id="step-1-container" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Masukkan Data Akun Game</h3>
                <p className="text-xs text-slate-500">Pastikan User ID dan Server sesuai dengan akun Anda</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {game.idFields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {field.label} <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {field.type === 'select' ? (
                    <select
                      id={`input-${field.name}`}
                      value={accountData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`input-${field.name}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={accountData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors shadow-xs ${
                        errors[field.name] ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    />
                  )}

                  {field.helperText && !errors[field.name] && (
                    <p className="text-[11px] text-slate-500">{field.helperText}</p>
                  )}
                  {errors[field.name] && (
                    <p id={`step-error-${field.name}`} className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Check Nickname Simulator Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                id="btn-check-nickname"
                onClick={handleCheckNickname}
                disabled={isCheckingNickname}
                className="px-3.5 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-600 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isCheckingNickname ? 'Memeriksa Akun...' : 'Cek Nickname Akun'}</span>
              </button>

              {verifiedNickname && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-800">
                    Nickname Ditemukan: <strong className="text-slate-900">{verifiedNickname}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: Pilih Nominal Top Up */}
          <div id="step-2-container" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Pilih Nominal Top Up</h3>
                <p className="text-xs text-slate-500">Pilih item, paket diamond, atau pass yang ingin dibeli</p>
              </div>
            </div>

            {errors['item'] && (
              <p className="text-xs text-rose-600 font-semibold mb-3 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors['item']}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {game.denominations.map((denom) => {
                const isSelected = selectedItem?.id === denom.id;
                return (
                  <div
                    key={denom.id}
                    id={`denom-card-${denom.id}`}
                    onClick={() => setSelectedItem(denom)}
                    className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    {/* Badges */}
                    {denom.popular && (
                      <div className="absolute -top-2 right-2">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          POPULER
                        </span>
                      </div>
                    )}
                    {denom.flashSale && (
                      <div className="absolute -top-2 right-2">
                        <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> FLASH SALE
                        </span>
                      </div>
                    )}

                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {denom.name}
                      </p>
                      {denom.bonus && (
                        <p className="text-[10px] text-indigo-600 font-medium mt-0.5 line-clamp-1">
                          🎁 {denom.bonus}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
                      <span className={`text-xs font-black ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                        {formatRupiah(denom.price)}
                      </span>
                      {denom.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatRupiah(denom.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Pilih Metode Pembayaran */}
          <div id="step-3-container" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Pilih Metode Pembayaran</h3>
                  <p className="text-xs text-slate-500">QRIS real-time, E-Wallet, Virtual Account & Minimarket</p>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {paymentCategoriesList.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  id={`pay-cat-btn-${cat.id}`}
                  onClick={() => setActivePaymentCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activePaymentCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPayments.map((method) => {
                const isSelected = selectedPayment?.id === method.id;
                const dynamicFee = selectedItem ? calculateFee(selectedItem.price, method) : 0;
                const dynamicTotal = selectedItem ? selectedItem.price + dynamicFee : 0;

                return (
                  <div
                    key={method.id}
                    id={`payment-method-${method.id}`}
                    onClick={() => setSelectedPayment(method)}
                    className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    {method.badge && (
                      <div className="absolute -top-2 right-2">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          {method.badge}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
                        {method.category === 'qris' ? (
                          <QrCode className="w-6 h-6 text-indigo-600" />
                        ) : method.category === 'ewallet' ? (
                          <Wallet className="w-6 h-6 text-indigo-600" />
                        ) : method.category === 'va' ? (
                          <Building2 className="w-6 h-6 text-indigo-600" />
                        ) : method.category === 'retail' ? (
                          <Store className="w-6 h-6 text-indigo-600" />
                        ) : (
                          <Smartphone className="w-6 h-6 text-indigo-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {method.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{method.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        Biaya: {dynamicFee === 0 ? 'Gratis' : formatRupiah(dynamicFee)}
                      </span>
                      <span className={`font-black ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                        {selectedItem ? formatRupiah(dynamicTotal) : '-'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Kontak & Kode Promo */}
          <div id="step-4-container" className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                4
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Nomor Kontak & Kode Promo</h3>
                <p className="text-xs text-slate-500">Bukti invoice dan token top up akan dikirim ke kontak ini</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-whatsapp"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    if (errors['whatsapp']) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next['whatsapp'];
                        return next;
                      });
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs ${
                    errors['whatsapp'] ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  }`}
                />
                {errors['whatsapp'] ? (
                  <p id="step-error-whatsapp" className="text-[11px] text-rose-600 font-semibold">{errors['whatsapp']}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">Bukti transaksi QRIS dikirim instan via WhatsApp</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Alamat Email <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  id="input-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
                />
                <p className="text-[11px] text-slate-500">Salinan invoice PDF resmi</p>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Punya Kode Promo / Voucher Diskon?
              </label>

              {!appliedPromo ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-promocode"
                      type="text"
                      placeholder="Masukkan kode (Cth: QRISFLASH / HEMAT2026)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 uppercase tracking-wider focus:outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                  <button
                    type="button"
                    id="btn-apply-promo"
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Gunakan
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Voucher <span className="text-emerald-700">{appliedPromo.code}</span> Digunakan!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Hemat {formatRupiah(appliedPromo.discount)} ({appliedPromo.description})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                </p>
              )}

              {/* Quick Promo Suggestions */}
              {!appliedPromo && (
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[11px] text-slate-500">Kode Promo Aktif:</span>
                  <button
                    type="button"
                    onClick={() => setPromoInput('QRISFLASH')}
                    className="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-mono hover:bg-indigo-100 cursor-pointer"
                  >
                    QRISFLASH (Diskon 15%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoInput('HEMAT2026')}
                    className="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-mono hover:bg-indigo-100 cursor-pointer"
                  >
                    HEMAT2026 (Diskon 10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoInput('STECUTOPUP')}
                    className="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-mono hover:bg-indigo-100 cursor-pointer"
                  >
                    STECUTOPUP (Diskon 5%)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ORDER SUMMARY & CHECKOUT BUTTON */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
            <h4 className="font-bold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Ringkasan Pembelian
            </h4>

            <div className="space-y-2 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between text-slate-600">
                <span>Game</span>
                <span className="font-semibold text-slate-900">{game.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Item / Nominal</span>
                <span className="font-semibold text-slate-900">{selectedItem ? selectedItem.name : '-'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Metode Pembayaran</span>
                <span className="font-semibold text-indigo-600">{selectedPayment ? selectedPayment.name : '-'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Harga Item</span>
                <span className="text-slate-900 font-semibold">{formatRupiah(itemPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Layanan</span>
                <span>{paymentFee === 0 ? 'Gratis (Rp 0)' : formatRupiah(paymentFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Promo ({appliedPromo?.code})</span>
                  <span>- {formatRupiah(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-xs text-slate-500">Total Pembayaran</p>
                <p className="text-2xl sm:text-3xl font-black text-indigo-600">
                  {formatRupiah(totalAmount)}
                </p>
              </div>

              <button
                type="button"
                id="btn-submit-order"
                onClick={handleSubmit}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>Beli Sekarang</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Dengan mengklik "Beli Sekarang", Anda menyetujui Syarat & Ketentuan Stecutopup. Transaksi aman terlindungi.
            </p>
          </div>

        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Petunjuk User ID {game.name}</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>{game.guideText}</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-indigo-700">
                Format: <br />
                - User ID: Angka ID Akun Game Anda<br />
                - Zone ID / Server: Nomor Server atau Region Anda
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full mt-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
