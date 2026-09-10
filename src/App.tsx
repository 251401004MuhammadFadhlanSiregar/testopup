import React, { useState, useEffect, useCallback } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  BannerSlider 
} from './components/BannerSlider';
import { 
  FlashSaleSection 
} from './components/FlashSaleSection';
import { 
  GameGrid 
} from './components/GameGrid';
import { 
  GameDetailView 
} from './components/GameDetailView';
import { 
  PaymentModal 
} from './components/PaymentModal';
import { 
  InvoiceView 
} from './components/InvoiceView';
import { 
  OrderTrackerModal 
} from './components/OrderTrackerModal';
import { 
  CalculatorWRModal 
} from './components/CalculatorWRModal';
import { 
  LiveChatWidget 
} from './components/LiveChatWidget';
import { 
  AdminDashboardModal 
} from './components/AdminDashboardModal';
import { 
  Footer 
} from './components/Footer';
import { 
  GAMES_DATA 
} from './data/games';
import { 
  Game, 
  Denomination, 
  PaymentMethod, 
  Transaction 
} from './types';
import { 
  generateInvoiceId, 
  generateQrisPayload, 
  saveTransaction 
} from './utils/formatters';
import { 
  getCustomizedGames, 
  getCustomizedFlashSales 
} from './utils/products';
import { MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  // Dynamic Games & Flash Sales state (synchronized with Admin price adjustments)
  const [games, setGames] = useState<Game[]>(() => getCustomizedGames(GAMES_DATA));
  const [flashSales, setFlashSales] = useState(() => getCustomizedFlashSales(games));

  // Navigation & View States
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedDenomId, setSelectedDenomId] = useState<string | undefined>(undefined);
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);

  // Modals
  const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refresh dynamic games on products/prices update
  const refreshAppGames = useCallback(() => {
    const updated = getCustomizedGames(GAMES_DATA);
    setGames(updated);
    setFlashSales(getCustomizedFlashSales(updated));
    setSelectedGame((prev) => {
      if (!prev) return null;
      return updated.find((g) => g.id === prev.id) || prev;
    });
  }, []);

  // Listen to centralized product price updates
  useEffect(() => {
    const handleProductsUpdated = () => {
      refreshAppGames();
    };
    window.addEventListener('stecutopup_products_updated', handleProductsUpdated);
    return () => {
      window.removeEventListener('stecutopup_products_updated', handleProductsUpdated);
    };
  }, [refreshAppGames]);

  // Scroll to top watcher
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleSelectGame = (game: Game, itemId?: string) => {
    // Look up latest game version with any pricing overrides
    const latestGame = games.find((g) => g.id === game.id) || game;
    setSelectedGame(latestGame);
    setSelectedDenomId(itemId);
    setActiveInvoice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGameById = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (game) {
      handleSelectGame(game);
    }
  };

  const handleSelectFlashSale = (gameId: string, itemId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (game) {
      handleSelectGame(game, itemId);
    }
  };

  const handleGoHome = () => {
    setSelectedGame(null);
    setSelectedDenomId(undefined);
    setActiveInvoice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create Order & Launch Payment Modal
  const handleCreateOrder = (orderData: {
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
  }) => {
    const invoiceId = generateInvoiceId();
    const qrisPayload = generateQrisPayload(invoiceId, orderData.totalAmount);

    const newTx: Transaction = {
      invoiceId,
      gameId: orderData.game.id,
      gameName: orderData.game.name,
      gameLogo: orderData.game.logo,
      accountData: orderData.accountData,
      accountNickname: orderData.accountNickname,
      itemId: orderData.item.id,
      itemName: orderData.item.name,
      itemPrice: orderData.item.price,
      paymentMethodId: orderData.paymentMethod.id,
      paymentMethodName: orderData.paymentMethod.name,
      paymentFee: orderData.paymentFee,
      discountAmount: orderData.discountAmount,
      promoCode: orderData.promoCode,
      totalAmount: orderData.totalAmount,
      whatsapp: orderData.whatsapp,
      email: orderData.email,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      qrisPayload,
    };

    saveTransaction(newTx);
    setPendingTransaction(newTx);
  };

  // Payment Success Handler
  const handlePaymentSuccess = (updatedTx: Transaction) => {
    setPendingTransaction(null);
    setActiveInvoice(updatedTx);
    setSelectedGame(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-indigo-600 selection:text-white font-sans">
      
      {/* Top Navigation */}
      <Navbar
        games={games}
        onSelectGame={handleSelectGame}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenLiveChat={() => setIsLiveChatOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Main View Router */}
      <main className="pb-12">
        {activeInvoice ? (
          /* View 1: Completed Invoice Receipt */
          <InvoiceView
            transaction={activeInvoice}
            onBackToHome={handleGoHome}
            onTopUpAgain={handleSelectGameById}
          />
        ) : selectedGame ? (
          /* View 2: Dedicated Game Top Up Flow */
          <GameDetailView
            game={selectedGame}
            initialItemId={selectedDenomId}
            onBack={handleGoHome}
            onSubmitOrder={handleCreateOrder}
          />
        ) : (
          /* View 3: Home Catalog Page */
          <>
            {/* Promotional Hero Slider */}
            <BannerSlider
              games={games}
              onSelectGameById={handleSelectGameById}
            />

            {/* Flash Sale Section with Countdown */}
            <FlashSaleSection
              flashSales={flashSales}
              onSelectFlashSale={handleSelectFlashSale}
            />

            {/* Game Catalog Grid & Category Tabs */}
            <GameGrid
              games={games}
              onSelectGame={handleSelectGame}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onOpenLiveChat={() => setIsLiveChatOpen(true)} 
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-white border border-slate-200 hover:border-indigo-500 text-slate-600 hover:text-indigo-600 flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Kembali ke atas"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <button
          id="btn-floating-livechat"
          onClick={() => setIsLiveChatOpen(true)}
          className="px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Bantuan CS 24/7</span>
        </button>
      </div>

      {/* MODALS */}
      {/* 1. QRIS / Payment Checkout Modal */}
      {pendingTransaction && (
        <PaymentModal
          transaction={pendingTransaction}
          onClose={() => setPendingTransaction(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 2. Order Tracker Modal */}
      {isOrderTrackerOpen && (
        <OrderTrackerModal
          onClose={() => setIsOrderTrackerOpen(false)}
          onSelectTransaction={(tx) => {
            setActiveInvoice(tx);
            setSelectedGame(null);
          }}
          onContinuePayment={(tx) => {
            setPendingTransaction(tx);
          }}
        />
      )}

      {/* 3. MLBB Win Rate & Magic Wheel Calculator Modal */}
      {isCalculatorOpen && (
        <CalculatorWRModal
          onClose={() => setIsCalculatorOpen(false)}
          onTopUpMLBB={() => handleSelectGameById('mlbb')}
        />
      )}

      {/* 4. 24/7 Live Chat CS Widget */}
      <LiveChatWidget
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
      />

      {/* 5. Admin Dashboard Modal (Transactions & Product Price Settings) */}
      {isAdminDashboardOpen && (
        <AdminDashboardModal
          games={games}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshData={refreshAppGames}
        />
      )}

    </div>
  );
}
