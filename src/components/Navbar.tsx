import React from 'react';
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export const Navbar = () => {
  const { cart, wishlist, setCurrentView, currentView, setSearchQuery, searchQuery } = useAppContext();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <button className="hover:text-archora-gold transition-colors">
            <Menu className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>

          {isSearchOpen ? (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '200px', opacity: 1 }}
              onSubmit={handleSearch}
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

          <button onClick={() => setCurrentView('wishlist')} className="relative hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
            <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-archora-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </button>
          
          <button onClick={() => setCurrentView('cart')} className="relative hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-archora-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button onClick={() => setCurrentView('admin')} className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
            <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Center Empty Space to maintain grid balance */}
        <div className="hidden md:block order-2 col-span-1"></div>

        {/* Logo (Right Corner) */}
        <div 
          className="cursor-pointer flex items-center justify-end order-1 md:order-3 col-span-1"
          onClick={() => setCurrentView('home')}
        >
          <span className="font-display text-3xl font-bold tracking-tight">ARCHORA</span>
        </div>

      </div>
    </header>
  );
};
