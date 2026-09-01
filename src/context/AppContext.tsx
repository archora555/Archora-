import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ViewState } from '../types';
import { initialProducts } from '../data';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AppContextType {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addOrder: (order: Order) => void;
  heroBanners: {id: number, image: string, title: string}[];
  setHeroBanners: React.Dispatch<React.SetStateAction<{id: number, image: string, title: string}[]>>;
  subCategories: { id: string, name: string, iconName: string, image?: string }[];
  setSubCategories: React.Dispatch<React.SetStateAction<{ id: string, name: string, iconName: string, image?: string }[]>>;
  homeSections: { title: string, filter: string }[];
  setHomeSections: React.Dispatch<React.SetStateAction<{ title: string, filter: string }[]>>;
  logoConfig: { type: 'text' | 'image', text: string, imageUrl: string };
  setLogoConfig: React.Dispatch<React.SetStateAction<{ type: 'text' | 'image', text: string, imageUrl: string }>>;
  menuItems: { id: string, label: string, action: string }[];
  setMenuItems: React.Dispatch<React.SetStateAction<{ id: string, label: string, action: string }[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  introFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
  saveSettingsToFirebase: () => Promise<void>;
  appliedCoupon: import('../types').Coupon | null;
  setAppliedCoupon: (coupon: import('../types').Coupon | null) => void;
  layoutConfig: import("../types").LayoutConfig;
  setLayoutConfig: React.Dispatch<React.SetStateAction<import("../types").LayoutConfig>>;
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
  isVisualEditMode: boolean;
  setIsVisualEditMode: (mode: boolean) => void;
  currencyConfig: import('../types').CurrencyConfig;
  setCurrencyConfig: React.Dispatch<React.SetStateAction<import('../types').CurrencyConfig>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [appliedCoupon, setAppliedCoupon] = useState<import('../types').Coupon | null>(null);
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);

  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    try {
      const savedUser = localStorage.getItem('archora_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return !!sessionStorage.getItem('archora_admin_auth');
  });

  useEffect(() => {
    if (isAdminLoggedIn) {
      sessionStorage.setItem('archora_admin_auth', 'true');
    } else {
      sessionStorage.removeItem('archora_admin_auth');
    }
  }, [isAdminLoggedIn]);
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('archora_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('archora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('archora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('archora_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Default values
  const defaultBanners = [
    { id: 1, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000", title: "The Burl & Jade Collection" },
    { id: 2, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000", title: "Bedroom Oasis" },
    { id: 3, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=2000", title: "Minimalist Office" },
    { id: 4, image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=2000", title: "Elegant Dining" },
    { id: 5, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=2000", title: "Lounge Selection" }
  ];
  const defaultCats = [
    { id: 'sofa', name: 'Sofa', iconName: 'Sofa' },
    { id: 'bed', name: 'Bed', iconName: 'BedDouble' },
    { id: 'dining', name: 'Dining', iconName: 'Utensils' },
    { id: 'office', name: 'Office', iconName: 'Briefcase' },
    { id: 'decor', name: 'Decor', iconName: 'Lamp' }
  ];
  const defaultSections = [
    { title: 'New Arrivals', filter: 'New Arrivals' },
    { title: 'Office Use Pro', filter: 'Office Use Pro' },
    { title: 'Living Room', filter: 'Living' },
    { title: 'Bedroom', filter: 'Bedroom' },
    { title: 'Dining', filter: 'Dining' }
  ];

  const defaultLogo = { type: 'image' as const, text: 'ARCHORA', imageUrl: '/1787550151155-removebg-preview.png' };
  
  const defaultLayoutConfig: import('../types').LayoutConfig = {
    header: {
      bgColor: '#ffffff'
    },
    announcementBar: {
      text: 'COMPLIMENTARY WHITE GLOVE DELIVERY ON ORDERS OVER $5,000',
      fontSize: 10,
      height: 40,
      padding: 16,
      show: true,
      bgColor: '#000000',
      textColor: '#ffffff'
    },
    logoSettings: {
      type: 'image',
      text: 'ARCHORA',
      imageUrl: '/1787550151155-removebg-preview.png',
      width: 170,
      mobileHeight: 36,
      desktopHeight: 44
    },
    categorySection: {
      title: '',
      fontSize: 28,
      letterSpacing: 4,
      marginTop: 32,
      marginBottom: 32
    },
    categoryCards: {
      width: 150,
      height: 150,
      aspectRatio: '1/1',
      cornerRadius: 16,
      gap: 16
    },
    heroSettings: {
      title: 'ELEVATE YOUR EVERYDAY',
      subtitle: 'Discover the intersection of timeless design and modern comfort.',
      buttonText: 'SHOP THE COLLECTION',
      height: 90,
      bgColor: '#E6E6E6',
      textColor: '#FFFFFF',
      overlayOpacity: 0.1
    },
    footerSettings: {
      bgColor: '#111111',
      textColor: '#FFFFFF',
      title: 'ARCHORA',
      description: 'Redefining modern luxury. Our pieces are crafted with precision, blending timeless elegance with contemporary design.'
    },
    sectionOrder: ['hero', 'categories', 'featured', 'newArrivals', 'footer']
  };
  const defaultMenu = [
    { id: 'm1', label: 'Home', action: 'home' },
    { id: 'm2', label: 'Shop', action: 'shop' },
    { id: 'm3', label: 'Collections', action: 'shop' },
    { id: 'm4', label: 'Lookbook', action: 'shop' },
    { id: 'm5', label: 'Journal', action: 'home' },
    { id: 'm6', label: 'Wishlist', action: 'wishlist' },
    { id: 'm7', label: 'Cart', action: 'cart' },
    { id: 'm8', label: 'My Account', action: 'profile' },
    { id: 'm9', label: 'Contact us', action: 'contact' },
    { id: 'm10', label: 'Language', action: 'language' },
    { id: 'm11', label: 'Currency', action: 'currency' }
  ];

  const defaultCurrencyConfig: import('../types').CurrencyConfig = {
    activeCurrency: 'BDT',
    defaultCurrency: 'BDT',
    rates: {
      USD: 1,
      BDT: 120,
      BTC: 0.000015, // Approx BTC rate placeholder
    },
    cryptoSettings: {
      code: 'BTC',
      name: 'Bitcoin',
      symbol: '₿',
      decimals: 5,
      usdPerCrypto: 65000,
      walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    bdtSettings: {
      symbol: '৳',
      symbolPosition: 'prefix'
    },
    usdSettings: {
      symbol: '$'
    }
  };

  const [heroBanners, setHeroBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('archora_heroBanners');
      return saved ? JSON.parse(saved) : defaultBanners;
    } catch { return defaultBanners; }
  });
  const [subCategories, setSubCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('archora_subCategories');
      return saved ? JSON.parse(saved) : defaultCats;
    } catch { return defaultCats; }
  });
  const [homeSections, setHomeSections] = useState(() => {
    try {
      const saved = localStorage.getItem('archora_homeSections');
      return saved ? JSON.parse(saved) : defaultSections;
    } catch { return defaultSections; }
  });
  const [logoConfig, setLogoConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('archora_logoConfig');
      return saved ? JSON.parse(saved) : defaultLogo;
    } catch { return defaultLogo; }
  });
  
  const [layoutConfig, setLayoutConfig] = useState<import('../types').LayoutConfig>(() => {
    try {
      const saved = localStorage.getItem('archora_layoutConfig');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultLayoutConfig,
          ...parsed,
          header: { ...defaultLayoutConfig.header, ...(parsed.header || {}) },
          announcementBar: { ...defaultLayoutConfig.announcementBar, ...(parsed.announcementBar || {}) },
          logoSettings: { 
            ...defaultLayoutConfig.logoSettings, 
            ...(parsed.logoSettings || {}),
            imageUrl: (parsed.logoSettings && parsed.logoSettings.imageUrl) ? parsed.logoSettings.imageUrl : '/1787550151155-removebg-preview.png',
            type: (parsed.logoSettings && parsed.logoSettings.type) ? parsed.logoSettings.type : 'image'
          },
          categorySection: { ...defaultLayoutConfig.categorySection, ...(parsed.categorySection || {}) },
          categoryCards: { ...defaultLayoutConfig.categoryCards, ...(parsed.categoryCards || {}) },
          heroSettings: { ...defaultLayoutConfig.heroSettings, ...(parsed.heroSettings || {}) },
          footerSettings: { ...defaultLayoutConfig.footerSettings, ...(parsed.footerSettings || {}) },
          sectionOrder: parsed.sectionOrder || defaultLayoutConfig.sectionOrder,
        };
      }
      return defaultLayoutConfig;
    } catch { return defaultLayoutConfig; }
  });
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('archora_menuItems_v2');
      return saved ? JSON.parse(saved) : defaultMenu;
    } catch { return defaultMenu; }
  });

  const [currencyConfig, setCurrencyConfig] = useState<import('../types').CurrencyConfig>(() => {
    try {
      const saved = localStorage.getItem('archora_currencyConfig');
      return saved ? JSON.parse(saved) : defaultCurrencyConfig;
    } catch { return defaultCurrencyConfig; }
  });

  useEffect(() => {
    // Load from Firebase
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'frontendConfig');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroBanners) setHeroBanners(data.heroBanners);
          if (data.subCategories) setSubCategories(data.subCategories);
          if (data.homeSections) setHomeSections(data.homeSections);
          if (data.logoConfig) setLogoConfig(data.logoConfig);
          if (data.menuItems) {
            if (data.menuItems.length < 11) {
              setMenuItems(defaultMenu);
            } else {
              setMenuItems(data.menuItems);
            }
          }
          if (data.currencyConfig) setCurrencyConfig(data.currencyConfig);
          if (data.layoutConfig) {
            setLayoutConfig(prev => ({
              ...defaultLayoutConfig,
              ...data.layoutConfig,
              header: { ...defaultLayoutConfig.header, ...(data.layoutConfig.header || {}) },
              announcementBar: { ...defaultLayoutConfig.announcementBar, ...(data.layoutConfig.announcementBar || {}) },
              logoSettings: { ...defaultLayoutConfig.logoSettings, ...(data.layoutConfig.logoSettings || {}) },
              categorySection: { ...defaultLayoutConfig.categorySection, ...(data.layoutConfig.categorySection || {}) },
              categoryCards: { ...defaultLayoutConfig.categoryCards, ...(data.layoutConfig.categoryCards || {}) },
              heroSettings: { ...defaultLayoutConfig.heroSettings, ...(data.layoutConfig.heroSettings || {}) },
              footerSettings: { ...defaultLayoutConfig.footerSettings, ...(data.layoutConfig.footerSettings || {}) },
              sectionOrder: data.layoutConfig.sectionOrder || defaultLayoutConfig.sectionOrder,
            }));
          }
        }
      } catch (err: any) {
        if (err?.code === 'permission-denied') {
          console.error("Firestore permission denied loading settings:", err);
        } else {
          console.warn("Using local configuration while Firestore connects:", err?.message || err);
        }
      }
    };
    loadConfig();
  }, []);

  const saveSettingsToFirebase = async () => {
    try {
      try {
        localStorage.setItem('archora_heroBanners', JSON.stringify(heroBanners));
        localStorage.setItem('archora_subCategories', JSON.stringify(subCategories));
        localStorage.setItem('archora_homeSections', JSON.stringify(homeSections));
        localStorage.setItem('archora_logoConfig', JSON.stringify(logoConfig));
        localStorage.setItem('archora_menuItems_v2', JSON.stringify(menuItems));
        localStorage.setItem('archora_currencyConfig', JSON.stringify(currencyConfig));
        localStorage.setItem('archora_layoutConfig', JSON.stringify(layoutConfig));
      } catch (storageError) {
        console.warn('Could not save all settings to localStorage (quota exceeded).', storageError);
      }

      const docRef = doc(db, 'settings', 'frontendConfig');
      await setDoc(docRef, {
         heroBanners,
         subCategories,
         homeSections,
         logoConfig,
         menuItems,
         currencyConfig,
         layoutConfig
      }, { merge: true });
      // alert('Settings saved successfully!');
    } catch (e: any) {
      console.error("Failed to save to firebase", e);
      // alert('Failed to save settings to database: ' + e.message);
    }
  };


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [introFinished, setIntroFinished] = useState(() => {
    return !!sessionStorage.getItem('archora_intro_seen');
  });

  useEffect(() => {
    try {
      localStorage.setItem('archora_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('archora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('archora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('archora_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const addToCart = (product: Product, quantity: number, color: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === color);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      products, setProducts,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      wishlist, toggleWishlist,
      orders, setOrders, addOrder,
      heroBanners, setHeroBanners,
      subCategories, setSubCategories,
      homeSections, setHomeSections,
      logoConfig, setLogoConfig,      layoutConfig, setLayoutConfig,
      menuItems, setMenuItems,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      introFinished, setIntroFinished,
      isAdminLoggedIn, setIsAdminLoggedIn,
      saveSettingsToFirebase,
      appliedCoupon, setAppliedCoupon,
      currentUser, setCurrentUser,
      isVisualEditMode, setIsVisualEditMode,
      currencyConfig, setCurrencyConfig
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
