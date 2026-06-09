export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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

export type ViewState = 'home' | 'shop' | 'cart' | 'wishlist' | 'checkout' | 'admin';
