import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ViewState } from '../types';
import { initialProducts } from '../data';

interface AppContextType {
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  introFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
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
  const [heroBanners, setHeroBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('archora_banners');
      return saved ? JSON.parse(saved) : [
        { id: 1, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000", title: "Living Room" },
        { id: 2, image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000", title: "Bedroom Oasis" },
        { id: 3, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=2000", title: "Minimalist Office" },
        { id: 4, image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=2000", title: "Elegant Dining" },
        { id: 5, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=2000", title: "Lounge Selection" }
      ];
    } catch {
      return [];
    }
  });
  
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
      localStorage.setItem('archora_banners', JSON.stringify(heroBanners));
    } catch (e) {
      console.error('Failed to save banners to localStorage', e);
    }
  }, [heroBanners]);

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
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      introFinished, setIntroFinished,
      isAdminLoggedIn, setIsAdminLoggedIn
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
