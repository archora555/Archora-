import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CartView } from './views/CartView';
import { WishlistView } from './views/WishlistView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AdminView } from './views/AdminView';
import { AdminLoginView } from './views/AdminLoginView';
import { ProductView } from './views/ProductView';
import { CategoryView } from './views/CategoryView';
import { ProfileView } from './views/ProfileView';
import { IntroSequence } from './components/IntroSequence';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Router component to switch views
const AppRouter = ({ showIntro }: { showIntro: boolean }) => {
  const { currentView } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to react-router from currentView or vice versa if needed
  // For now, we only use routing for /admin and /archora-admin-portal
  // Main site uses currentView.
  
  const isMainSite = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login');

  return (
    <div className={`min-h-screen bg-white ${showIntro && isMainSite ? 'h-screen overflow-hidden' : ''}`}>
      {isMainSite && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={<AdminLoginView />} />
          <Route path="/archora-admin-portal" element={<AdminLoginView />} />
          <Route path="/admin/*" element={<AdminView />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/category/:id" element={<CategoryView />} />
          <Route path="*" element={
            <>
              {currentView === 'home' && <HomeView />}
              {currentView === 'shop' && <ShopView />}
              {currentView === 'cart' && <CartView />}
              {currentView === 'wishlist' && <WishlistView />}
              {currentView === 'checkout' && <CheckoutView />}
              {currentView === 'tracking' && <OrderTrackingView />}
              {currentView === 'profile' && <ProfileView />}
            </>
          } />
        </Routes>
      </main>
      {isMainSite && <WhatsAppButton />}
    </div>
  );
};

function App() {
  const { introFinished, setIntroFinished } = useAppContext();
  const location = useLocation();

  const handleIntroComplete = () => {
    sessionStorage.setItem('archora_intro_seen', 'true');
    setIntroFinished(true);
  };

  const isMainSite = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login');

  return (
    <AnimatePresence>
      {!introFinished && isMainSite && <IntroSequence onComplete={handleIntroComplete} />}
    </AnimatePresence>
  );
}

const AppRoot = () => {
  return (
    <AppProvider>
      <App />
      <AppRouterWrapper />
    </AppProvider>
  )
}

const AppRouterWrapper = () => {
  const { introFinished } = useAppContext();
  return <AppRouter showIntro={!introFinished} />;
}

export { AppRoot as default };
