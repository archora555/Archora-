import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Heart, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { EditableWrapper } from './VisualEditor/EditableWrapper';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { id: 1, label: 'Shop', action: 'shop' },
  { id: 2, label: 'Lookbook', action: 'shop' },
  { id: 3, label: 'Journal', action: 'shop' },
  { id: 4, label: 'Cart', action: 'cart' }
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cart, wishlist, currentUser, setCurrentUser, layoutConfig, setLayoutConfig, setCurrentView } = useAppContext();
  const navigate = useNavigate();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoConfig = layoutConfig.logoSettings;

  const LogoWrapper = () => (
    <EditableWrapper 
      id="logo" 
      type="logo"
      currentWidth={layoutConfig.logoSettings.width}
      onResize={(w) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, width: w}})}
      isTextEditable={logoConfig.type === 'text' || !logoConfig.imageUrl}
      onTextChange={(t) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, text: t}})}
      currentAlign={layoutConfig.logoSettings.align || 'right'}
      onAlignChange={(a) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, align: a}})}
      currentOffsetX={layoutConfig.logoSettings.offsetX}
      onOffsetXChange={(x) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, offsetX: x}})}
      currentOffsetY={layoutConfig.logoSettings.offsetY}
      onOffsetYChange={(y) => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, offsetY: y}})}
    >
      {logoConfig.type === 'text' && logoConfig.text && logoConfig.text !== 'ARCHORA' ? (
        <span className="font-display text-3xl md:text-4xl tracking-[0.1em] text-[#D4AF37]" style={{ textShadow: "0px 1px 1px rgba(0,0,0,0.1)" }}>{logoConfig.text}</span>
      ) : (
        <img 
          src={logoConfig.imageUrl || '/1787550151155-removebg-preview.png'} 
          alt={logoConfig.text || 'ARCHORA'} 
          className="object-contain transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:opacity-95 cursor-pointer" 
          style={{ 
            width: layoutConfig.logoSettings.width ? `${layoutConfig.logoSettings.width}px` : 'auto', 
            height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${layoutConfig.logoSettings.mobileHeight || 36}px` : `${layoutConfig.logoSettings.desktopHeight || 44}px` 
          }}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.endsWith('1787550151155-removebg-preview.png')) {
              target.src = '/logo.png';
            } else if (target.src.endsWith('logo.png')) {
              target.src = '/logo.svg';
            }
          }}
        />
      )}
    </EditableWrapper>
  );

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <AnimatePresence>
        {layoutConfig.announcementBar.show && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <EditableWrapper 
              id="announcement-bar" 
              type="announcement"
              isTextEditable
              onTextChange={(t) => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, text: t}})}
              onColorChange={(c) => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, bgColor: c}})}
              onHide={() => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, show: false}})}
              currentFontSize={layoutConfig.announcementBar.fontSize}
              onFontSizeChange={(f) => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, fontSize: f}})}
            >
              <div 
                className="w-full flex items-center justify-center text-center tracking-widest font-medium uppercase frosted-glass-white-subtle border-b border-white/20"
                style={{
                  backgroundColor: layoutConfig.announcementBar.bgColor && layoutConfig.announcementBar.bgColor !== '#000000' ? layoutConfig.announcementBar.bgColor : undefined,
                  color: layoutConfig.announcementBar.textColor || '#ffffff',
                  fontSize: `\${layoutConfig.announcementBar.fontSize}px`,
                  minHeight: `\${layoutConfig.announcementBar.height}px`,
                  padding: `\${layoutConfig.announcementBar.padding}px`,
                }}
              >
                {layoutConfig.announcementBar.text}
              </div>
            </EditableWrapper>
          </motion.div>
        )}
      </AnimatePresence>

      <header 
        className={`w-full transition-all duration-300 ${isScrolled ? 'frosted-glass-white-header py-4' : 'bg-transparent py-6'}`}
        style={isScrolled && layoutConfig.header?.bgColor && layoutConfig.header.bgColor !== '#ffffff' && layoutConfig.header.bgColor !== '#070D09' ? { backgroundColor: layoutConfig.header.bgColor } : {}}
      >
        
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">
        
        {/* Left Side: Hamburger Menu */}
        <div className="flex items-center justify-start relative z-10 w-full col-span-1">
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:text-archora-gold transition-colors text-white border-none bg-transparent m-0 p-0 shadow-none">
              <Menu className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-4 w-56 frosted-glass-white-dropdown py-2 flex flex-col z-50 rounded-2xl text-white overflow-hidden shadow-2xl"
                >
                  <div className="px-4 py-2 mb-1 border-b border-white/10 flex items-center">
                    <img 
                      src={logoConfig.imageUrl || '/1787550151155-removebg-preview.png'} 
                      alt="ARCHORA" 
                      className="h-6 w-auto object-contain opacity-90"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.svg';
                      }}
                    />
                  </div>
                  {menuItems.map(item => (
                    <button key={item.id} onClick={() => { navigate('/'); setCurrentView(item.action as any); setIsMenuOpen(false); }} className="px-4 py-2.5 text-left text-sm hover:bg-white/20 flex items-center gap-3 text-white transition-colors">
                      <span>{item.label}</span>
                      {item.action === 'cart' && cartItemsCount > 0 && ` (${cartItemsCount})`}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Center: Logo */}
        <div className="flex order-2 col-span-1 items-center justify-center">
          <div 
            className="cursor-pointer flex items-center justify-center"
            onClick={() => { navigate('/'); setCurrentView('home'); }}
            style={{ transform: `translate(${layoutConfig.logoSettings.offsetX || 0}px, ${layoutConfig.logoSettings.offsetY || 0}px)` }}
          >
            <LogoWrapper />
          </div>
        </div>
        
        {/* Right Side: Search and User */}
        <div className="flex items-center justify-end order-3 col-span-1 gap-4 md:gap-6">
          {isSearchOpen ? (
            <motion.form 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '150px', opacity: 1 }}
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
                placeholder="Search..."
                className="w-full border-b border-white/30 pb-1 focus:outline-none focus:border-archora-gold bg-transparent text-sm text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
            </motion.form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-archora-gold transition-colors text-white border-none bg-transparent m-0 p-0 shadow-none">
              <Search className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </button>
          )}

          {/* User Profile / Login */}
          <div className="relative">
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hover:text-archora-gold transition-colors text-white border-none bg-transparent m-0 p-0 shadow-none flex items-center gap-1" 
                  title="My Profile"
                >
                  <User className="w-6 h-6 md:w-7 md:h-7 text-archora-gold" strokeWidth={1.5} />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 w-56 frosted-glass-white-dropdown py-2 flex flex-col z-50 rounded-2xl text-white overflow-hidden shadow-2xl"
                    >
                      <button onClick={() => { navigate('/'); setCurrentView('profile'); setIsProfileOpen(false); }} className="px-4 py-2.5 text-left text-sm hover:bg-white/20 text-white transition-colors">
                        My Profile
                      </button>
                      <button onClick={() => { navigate('/'); setCurrentView('tracking'); setIsProfileOpen(false); }} className="px-4 py-2.5 text-left text-sm hover:bg-white/20 text-white transition-colors">
                        My Orders
                      </button>
                      <button onClick={() => { navigate('/'); setCurrentView('wishlist'); setIsProfileOpen(false); }} className="px-4 py-2.5 text-left text-sm hover:bg-white/20 text-white transition-colors">
                        Wishlist
                      </button>
                      <button onClick={() => { navigate('/'); setCurrentView('cart'); setIsProfileOpen(false); }} className="px-4 py-2.5 text-left text-sm hover:bg-white/20 text-white transition-colors">
                        Cart
                      </button>
                      <div className="h-[1px] bg-white/10 my-1"></div>
                      <button onClick={() => { 
                        sessionStorage.removeItem('archora_customer_auth');
                        localStorage.removeItem('archora_current_user');
                        if (setCurrentUser) setCurrentUser(null);
                        setIsProfileOpen(false);
                        navigate('/');
                        setCurrentView('home');
                      }} className="px-4 py-2.5 text-left text-sm hover:bg-red-500/20 text-red-400 transition-colors">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="hover:text-archora-gold transition-colors text-white border-none bg-transparent m-0 p-0 shadow-none" title="Sign In">
                <User className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
    </div>
  );
};
