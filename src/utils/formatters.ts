import { PaymentMethod, Transaction } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateFee = (price: number, method: PaymentMethod): number => {
  const percentFee = Math.round((price * method.feePercentage) / 100);
  return method.feeFixed + percentFee;
};

export const generateInvoiceId = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `STECU-${dateStr}-${randomNum}`;
};

export const generateQrisPayload = (invoiceId: string, amount: number): string => {
  // EMVCo QRIS Standard simulated payload
  const formattedAmount = amount.toString();
  return `00020101021226590016ID.CO.QRIS.WWW01189360091800000000000216STECU${invoiceId}520458125303360540${formattedAmount.length}${formattedAmount}5802ID5921STECUTOPUP OFFICIAL6007JAKARTA61051011062070703A016304${invoiceId.slice(-4)}`;
};

const STORAGE_KEY = 'stecutopup_transactions_v1';

export const getStoredTransactions = (): Transaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nusatopup_transactions_v1');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
    return [];
  }
};

export const saveTransaction = (transaction: Transaction): void => {
  try {
    const existing = getStoredTransactions();
    const updated = [transaction, ...existing.filter((t) => t.invoiceId !== transaction.invoiceId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
    window.dispatchEvent(new CustomEvent('stecutopup_transactions_updated'));
  } catch (e) {
    console.error('Failed to save transaction to localStorage', e);
  }
};

export const updateTransactionStatus = (
  invoiceId: string,
  status: Transaction['status'],
  snReference?: string
): Transaction | null => {
  try {
    const existing = getStoredTransactions();
    let updatedTx: Transaction | null = null;
    const updated = existing.map((tx) => {
      if (tx.invoiceId === invoiceId) {
        updatedTx = {
          ...tx,
          status,
          snReference: snReference !== undefined ? snReference : (status === 'SUCCESS' ? (tx.snReference || `SN-STECU${Math.floor(100000000 + Math.random() * 900000000)}`) : tx.snReference),
          paidAt: status === 'SUCCESS' || status === 'PROCESSING' ? (tx.paidAt || new Date().toISOString()) : tx.paidAt,
          completedAt: status === 'SUCCESS' ? (tx.completedAt || new Date().toISOString()) : undefined,
        };
        return updatedTx;
      }
      return tx;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('stecutopup_transactions_updated'));
    return updatedTx;
  } catch (e) {
    console.error('Failed to update transaction status', e);
    return null;
  }
};

export const deleteStoredTransaction = (invoiceId: string): boolean => {
  try {
    const existing = getStoredTransactions();
    const filtered = existing.filter((tx) => tx.invoiceId !== invoiceId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('stecutopup_transactions_updated'));
    return true;
  } catch (e) {
    console.error('Failed to delete transaction', e);
    return false;
  }
};

export const seedSampleTransactions = (): Transaction[] => {
  const sampleOrders: Transaction[] = [
    {
      invoiceId: 'STECU-20260910-849102',
      gameId: 'mlbb',
      gameName: 'Mobile Legends: Bang Bang',
      gameLogo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
      accountData: { userId: '294819201', zoneId: '2109' },
      accountNickname: 'Garuda_Mythic (201)',
      itemId: 'ml_wdp',
      itemName: 'Weekly Diamond Pass',
      itemPrice: 27500,
      paymentMethodId: 'qris',
      paymentMethodName: 'QRIS Real-Time (Semua Bank & E-Wallet)',
      paymentFee: 0,
      discountAmount: 0,
      totalAmount: 27500,
      whatsapp: '081298765432',
      email: 'gamer.sultan@gmail.com',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      invoiceId: 'STECU-20260910-610482',
      gameId: 'ff',
      gameName: 'Free Fire & Free Fire MAX',
      gameLogo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&auto=format&fit=crop&q=80',
      accountData: { userId: '8839201948' },
      accountNickname: 'StecuPro_Player (948)',
      itemId: 'ff_355',
      itemName: '355 Diamonds (310 + 45 Bonus)',
      itemPrice: 47500,
      paymentMethodId: 'qris',
      paymentMethodName: 'QRIS Real-Time (Semua Bank & E-Wallet)',
      paymentFee: 0,
      discountAmount: 2375,
      promoCode: 'STECUTOPUP',
      totalAmount: 45125,
      whatsapp: '085712348899',
      email: 'ff_booyah@yahoo.com',
      status: 'SUCCESS',
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      paidAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 53).toISOString(),
      snReference: 'SN-STECU983910241',
    },
    {
      invoiceId: 'STECU-20260910-394019',
      gameId: 'valorant',
      gameName: 'Valorant',
      gameLogo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
      accountData: { riotId: 'AceHunter#ID1' },
      accountNickname: 'AceHunter (ID1)',
      itemId: 'val_1000',
      itemName: '1,000 Points',
      itemPrice: 110000,
      paymentMethodId: 'va_bca',
      paymentMethodName: 'BCA Virtual Account',
      paymentFee: 2500,
      discountAmount: 11000,
      promoCode: 'HEMAT2026',
      totalAmount: 101500,
      whatsapp: '081388776655',
      status: 'FAILED',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ];

  try {
    const existing = getStoredTransactions();
    const existingIds = new Set(existing.map((t) => t.invoiceId));
    const toAdd = sampleOrders.filter((s) => !existingIds.has(s.invoiceId));
    const merged = [...toAdd, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('stecutopup_transactions_updated'));
    return merged;
  } catch (e) {
    console.error('Failed to seed transactions', e);
    return [];
  }
};
