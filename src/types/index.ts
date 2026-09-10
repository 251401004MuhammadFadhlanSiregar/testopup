export type GameCategory = 'popular' | 'mobile' | 'pc' | 'voucher' | 'entertainment' | 'pulsa';

export interface IdFieldConfig {
  label: string;
  name: string;
  placeholder: string;
  type: 'text' | 'number' | 'select';
  options?: { label: string; value: string }[];
  helperText?: string;
  tooltipImage?: string;
}

export interface Denomination {
  id: string;
  name: string;
  amount: number | string;
  unit: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  flashSale?: boolean;
  bonus?: string;
  icon?: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  category: GameCategory;
  logo: string;
  banner: string;
  tag?: string;
  currencyName: string;
  isInstant: boolean;
  idFields: IdFieldConfig[];
  denominations: Denomination[];
  description: string;
  guideText?: string;
}

export type PaymentCategory = 'qris' | 'ewallet' | 'va' | 'retail' | 'pulsa';

export interface PaymentMethod {
  id: string;
  name: string;
  category: PaymentCategory;
  icon: string;
  feeFixed: number;
  feePercentage: number;
  minAmount: number;
  description: string;
  instructions: string[];
  isInstant: boolean;
  badge?: string;
}

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'EXPIRED' | 'CANCELLED' | 'FAILED';

export interface Transaction {
  invoiceId: string;
  gameId: string;
  gameName: string;
  gameLogo: string;
  accountData: Record<string, string>;
  accountNickname?: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  paymentMethodId: string;
  paymentMethodName: string;
  paymentFee: number;
  discountAmount: number;
  promoCode?: string;
  totalAmount: number;
  whatsapp: string;
  email?: string;
  status: TransactionStatus;
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  qrisPayload?: string;
  snReference?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minSpend: number;
  description: string;
}

export interface FlashSaleItem {
  id: string;
  gameId: string;
  gameName: string;
  gameLogo: string;
  item: Denomination;
  stockPercent: number;
  soldCount: number;
  endTime: string;
}
