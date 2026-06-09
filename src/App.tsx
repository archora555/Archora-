import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CartView } from './views/CartView';
import { WishlistView } from './views/WishlistView';
import { CheckoutView } from './views/CheckoutView';
import { AdminView } from './views/AdminView';
import { IntroSequence } from './components/IntroSequence';
import { AnimatePresence } from 'motion/react';

// Router component to switch views
const AppRouter = ({ showIntro }: { showIntro: boolean }) => {
  const { currentView } = useAppContext();

  return (
    <div className={`min-h-screen bg-white ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
      <Navbar />
      <main>
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'admin' && <AdminView />}
      </main>
    </div>
  );
};

function App() {
  const { introFinished, setIntroFinished } = useAppContext();

  const handleIntroComplete = () => {
    sessionStorage.setItem('archora_intro_seen', 'true');
    setIntroFinished(true);
  };

  return (
    <AnimatePresence>
      {!introFinished && <IntroSequence onComplete={handleIntroComplete} />}
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
