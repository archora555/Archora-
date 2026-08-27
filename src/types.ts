export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  materials?: string;
  images: string[];
  modelUrl?: string;
  dimensions?: string;
  colors: string[];
  sizes?: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
}

export interface QuoteRequest {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  size: string;
  color: string;
  material: string;
  notes: string;
  date: string;
  status: 'Pending' | 'Reviewed' | 'Responded';
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  isActive: boolean;
}

export interface LayoutConfig {
  header: {
    bgColor: string;
  };
  announcementBar: {
    text: string;
    fontSize: number;
    height: number;
    padding: number;
    show: boolean;
    bgColor: string;
    textColor: string;
  };
  logoSettings: {
    type: 'text' | 'image';
    text: string;
    imageUrl: string;
    width: number;
    mobileHeight: number;
    desktopHeight: number;
    align?: 'left' | 'center' | 'right';
    offsetX?: number;
    offsetY?: number;
  };
  categorySection: {
    title: string;
    fontSize: number;
    letterSpacing: number;
    marginTop: number;
    marginBottom: number;
  };
  categoryCards: {
    width: number;
    height: number;
    aspectRatio: string;
    cornerRadius: number;
    gap: number;
  };
  heroSettings: {
    title: string;
    subtitle: string;
    buttonText: string;
    height: number;
    bgColor: string;
    textColor: string;
    overlayOpacity: number;
    buttonWidth?: number;
    buttonHeight?: number;
    buttonFontSize?: number;
  };
  footerSettings: {
    bgColor: string;
    textColor: string;
    title: string;
    description: string;
  };
  sectionOrder: string[];
}

export type ViewState = 'home' | 'shop' | 'cart' | 'wishlist' | 'checkout' | 'admin' | 'account' | 'tracking' | 'profile';
