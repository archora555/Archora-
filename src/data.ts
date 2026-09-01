import { Product } from './types';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Aurelia Velvet Sofa',
    description: 'Experience unparalleled luxury with the Aurelia Velvet Sofa. Upholstered in premium Italian velvet, this masterpiece features a sleek silhouette, deep-seated comfort, and polished metallic gold legs. Perfect for modern and classic interiors equally.',
    price: 3499,
    category: 'Living',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=1000'
    ],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '88"W x 38"D x 34"H',
    colors: ['#FFFFFF', '#111111', '#2C3E50'],
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviews: 128
  },
  {
    id: 'p2',
    name: 'Luminary Marble Dining Table',
    description: 'A striking statement piece. The Luminary dining table features a 2-inch thick genuine Carrara marble top resting elegantly on a geometric brushed gold steel base. Seats up to 8 guests comfortably.',
    price: 5200,
    category: 'New Arrivals',
    images: [
      'https://images.unsplash.com/photo-1581428982868-e410dd147a90?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&q=80&w=1000'
    ],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '96"W x 42"D x 30"H',
    colors: ['#FFFFFF', '#111111'],
    inStock: true,
    stockCount: 5,
    rating: 5.0,
    reviews: 45
  },
  {
    id: 'p3',
    name: 'Executive Ergonomic Chair Pro',
    description: 'Designed for the modern professional. This high-end office chair combines ergonomic excellence with luxury aesthetics. Features genuine top-grain leather, adaptive lumbar support, and gold-plated casters.',
    price: 1250,
    category: 'Office Use Pro',
    images: [
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595514535415-ebad07b539a2?auto=format&fit=crop&q=80&w=1000'
    ],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '28"W x 28"D x 44-48"H',
    colors: ['#111111', '#8B4513', '#F5F5DC'],
    inStock: true,
    stockCount: 20,
    rating: 4.8,
    reviews: 312
  },
  {
    id: 'p4',
    name: 'Celeste Bouclé Armchair',
    description: 'Embrace the curves. The Celeste Armchair is draped in soft, textural ivory bouclé fabric. Its sculptural presence and low profile make it a stunning conversational piece for any luxury living room.',
    price: 1850,
    category: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000'
    ],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '34"W x 34"D x 28"H',
    colors: ['#F5F5DC', '#E0E0E0'],
    inStock: true,
    stockCount: 8,
    rating: 4.7,
    reviews: 89
  },
  {
    id: 'p5',
    name: 'Nocturne Walnut Bed Frame',
    description: 'The Nocturne bed frame is a masterclass in minimalist design. Crafted from solid American walnut, it features a low-profile platform and an oversized floating headboard with integrated brass reading lights.',
    price: 4100,
    category: 'Living',
    images: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000'
    ],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '84"W x 88"D x 42"H',
    colors: ['#3E2723'],
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviews: 210
  },
  {
    id: 'p6',
    name: 'Atlas Minimalist Desk',
    description: 'Redefine your workspace with the Atlas desk. A monolithic design featuring a matte black nanotech surface that resists fingerprints, supported by elegant satin gold legs. Includes hidden cable management.',
    price: 2200,
    category: 'Office Use Pro',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&q=80&w=1000'
    ],
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '60"W x 30"D x 29"H',
    colors: ['#111111', '#FFFFFF'],
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    reviews: 54
  }
];
