import { BuilderProvider } from './builder/BuilderContext';
import { BuilderToolbar } from './builder/Toolbar';
import { BuilderPalette } from './builder/Palette';
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
import { SilkShaderBackground } from './components/SilkShaderBackground';

// Router component to switch views
const AppRouter = ({ showIntro }: { showIntro: boolean }) => {
  const { currentView, isVisualEditMode, setIsVisualEditMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to react-router from currentView or vice versa if needed
  // For now, we only use routing for /admin and /archora-admin-portal
  // Main site uses currentView.
  
  const isMainSite = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login');

  return (
    <div className={`min-h-screen relative bg-[#070707] text-white selection:bg-archora-gold/30 selection:text-white ${showIntro && isMainSite ? 'h-screen overflow-hidden' : ''}`}>
      {/* High-Performance WebGL/Three.js Liquid Wave Shader Background */}
      <SilkShaderBackground />

      {/* Relative Foreground App Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {isVisualEditMode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 frosted-glass-white-header text-white px-6 py-3 rounded-full shadow-2xl z-[9999] flex items-center gap-4">
            <span className="text-sm font-medium tracking-wide">Visual Edit Mode Active</span>
            <button 
              onClick={() => setIsVisualEditMode(false)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              Exit Mode
            </button>
          </div>
        )}
        {isMainSite && <Navbar />}
        <main className="flex-1">
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
        <BuilderToolbar />
        <BuilderPalette />
      </div>
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
    <AppProvider><BuilderProvider>
      <App />
      <AppRouterWrapper />
    </BuilderProvider></AppProvider>
  )
}

const AppRouterWrapper = () => {
  const { introFinished } = useAppContext();
  return <AppRouter showIntro={!introFinished} />;
}

export { AppRoot as default };
