import React, { useState } from 'react';
import { Search, Heart, User, Menu, ShoppingBag, Truck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { cart, wishlist, setCurrentView, currentView, setSearchQuery, searchQuery, logoConfig, menuItems, currentUser, setCurrentUser, layoutConfig } = useAppContext();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('shop');
    setIsSearchOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">
        
        {/* Icons Navigation (Left Corner) */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-start order-1 relative z-10 w-full col-span-2 md:col-span-1 border-gray-400">
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
              <Menu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-4 w-48 bg-white border border-gray-100 shadow-lg py-2 flex flex-col z-50"
                >
                  {menuItems.map(item => (
                    <button key={item.id} onClick={() => { navigate('/'); setCurrentView(item.action as any); setIsMenuOpen(false); }} className="px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                      <span>{item.label}</span>
                      {item.action === 'cart' && cartItemsCount > 0 && ` (${cartItemsCount})`}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => { navigate('/'); setCurrentView('wishlist'); }} className="relative hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
            <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-archora-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {isSearchOpen ? (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '200px', opacity: 1 }}
              onSubmit={(e) => {
                e.preventDefault();
                navigate('/');
                setCurrentView('shop');
                setIsSearchOpen(false);
              }}
              className="relative hidden md:block"
            >
              <input 
                autoFocus
                type="text" 
                placeholder="Search pieces..."
                className="w-full border-b border-archora-black/20 pb-1 focus:outline-none focus:border-archora-gold bg-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
            </motion.form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
              <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
          )}

          {/* User Profile / Login */}
          <div className="relative">
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none flex items-center gap-1" 
                  title="My Profile"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6 text-archora-gold" strokeWidth={1.5} />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 md:left-auto md:right-0 mt-4 w-48 bg-white border border-gray-100 shadow-lg py-2 flex flex-col z-50"
                    >
                      <button onClick={() => { navigate('/'); setCurrentView('profile'); setIsProfileOpen(false); }} className="px-4 py-2 text-left text-sm hover:bg-gray-50">
                        My Profile
                      </button>
                      <button onClick={() => { navigate('/'); setCurrentView('tracking'); setIsProfileOpen(false); }} className="px-4 py-2 text-left text-sm hover:bg-gray-50">
                        My Orders
                      </button>
                      <button onClick={() => { navigate('/'); setCurrentView('wishlist'); setIsProfileOpen(false); }} className="px-4 py-2 text-left text-sm hover:bg-gray-50">
                        Wishlist
                      </button>
                      <button onClick={() => { navigate('/'); setCurrentView('cart'); setIsProfileOpen(false); }} className="px-4 py-2 text-left text-sm hover:bg-gray-50">
                        Cart
                      </button>
                      <div className="h-[1px] bg-gray-100 my-1"></div>
                      <button onClick={() => { 
                        sessionStorage.removeItem('archora_customer_auth');
                        localStorage.removeItem('archora_current_user');
                        if (setCurrentUser) setCurrentUser(null);
                        setIsProfileOpen(false);
                        navigate('/');
                        setCurrentView('home');
                      }} className="px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none" title="Sign In">
                <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Center Empty Space to maintain grid balance */}
        <div className="hidden md:block order-2 col-span-1"></div>

        {/* Logo (Right Corner) */}
        <div 
          className="cursor-pointer flex items-center justify-end order-1 md:order-3 col-span-1"
          onClick={() => { navigate('/'); setCurrentView('home'); }}
        >
          {logoConfig.type === 'text' || !logoConfig.imageUrl ? (
            <span className="font-display text-3xl font-bold tracking-tight">{logoConfig.text || 'ARCHORA'}</span>
          ) : (
            <img 
              src={logoConfig.imageUrl} 
              alt={logoConfig.text || 'ARCHORA'} 
              className="object-contain" style={{ 
                width: `${layoutConfig.logoSettings.width}px`, 
                height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${layoutConfig.logoSettings.mobileHeight}px` : `${layoutConfig.logoSettings.desktopHeight}px` 
              }}
            />
          )}
          {logoConfig.type === 'image' && logoConfig.imageUrl && (
            <span className="hidden font-display text-3xl font-bold tracking-tight">{logoConfig.text || 'ARCHORA'}</span>
          )}
        </div>

      </div>
    </header>
  );
};
