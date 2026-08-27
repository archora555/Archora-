const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

const newGrid = `
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">
        
        {/* Left Side: Hamburger Menu */}
        <div className="flex items-center justify-start relative z-10 w-full col-span-1">
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
              <Menu className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
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
                      {item.action === 'cart' && cartItemsCount > 0 && \` (\${cartItemsCount})\`}
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
            style={{ transform: \`translate(\${layoutConfig.logoSettings.offsetX || 0}px, \${layoutConfig.logoSettings.offsetY || 0}px)\` }}
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
                className="w-full border-b border-archora-black/20 pb-1 focus:outline-none focus:border-archora-gold bg-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
              />
            </motion.form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-archora-gold transition-colors text-black border-none bg-transparent m-0 p-0 shadow-none">
              <Search className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
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
                  <User className="w-6 h-6 md:w-7 md:h-7 text-archora-gold" strokeWidth={1.5} />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 w-48 bg-white border border-gray-100 shadow-lg py-2 flex flex-col z-50"
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
                <User className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>`;

code = code.replace(/<div className="max-w-7xl mx-auto px-6 grid grid-cols-3 items-center">([\s\S]*?)<\/header>/, newGrid);

// Update Logo font styling inside LogoWrapper if possible, or just add a quick style tweak.
code = code.replace(
  'className="font-display tracking-[0.2em]"',
  'className="font-display tracking-[0.1em] text-[rgb(161,133,52)]"'
);
code = code.replace(
  'style={{ fontSize: `${layoutConfig.logoSettings.fontSize}px` }}',
  'style={{ fontSize: `${layoutConfig.logoSettings.fontSize}px`, textShadow: "0px 1px 1px rgba(0,0,0,0.1)" }}'
);

fs.writeFileSync('src/components/Navbar.tsx', code);
console.log('Navbar updated');
