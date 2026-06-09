import React from 'react';
import { Hero } from '../components/Hero';
import { CategorySelector } from '../components/CategorySelector';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

export const HomeView = () => {
  const { products } = useAppContext();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const sections = [
    { title: 'New Arrivals', filter: 'New Arrivals' },
    { title: 'Best Seller', filter: 'Best Seller' },
    { title: 'Office Use Pro', filter: 'Office Use Pro' },
    { title: 'Living Room', filter: 'Living' },
    { title: 'Bedroom', filter: 'Bedroom' },
    { title: 'Dining', filter: 'Dining' }
  ];

  return (
    <div className="w-full">
      <Hero />
      
      <CategorySelector />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-12 md:gap-16 overflow-hidden">
        {sections.map((section) => {
          // Fill with section products first, then pad with others to ensure the carousel has enough items
          const exactProducts = products.filter(p => p.category === section.filter);
          const otherProducts = products.filter(p => p.category !== section.filter);
          const sectionProducts = [...exactProducts, ...otherProducts, ...exactProducts, ...otherProducts].slice(0, 8);
          
          if (sectionProducts.length === 0) return null;
          
          return (
            <div key={section.title}>
              <div className="flex items-end justify-between mb-6 md:mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-archora-black">{section.title}</h2>
                <button className="text-archora-black border-b border-archora-black pb-0.5 hover:text-archora-gold hover:border-archora-gold transition-colors uppercase tracking-wider text-[10px] md:text-xs font-medium">
                  View All
                </button>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 md:gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {sectionProducts.map((product, idx) => (
                  <div 
                    key={`${product.id}-${idx}`} 
                    className="shrink-0 snap-start w-[calc((100%-36px)/3.5)] md:w-[calc((100%-64px)/4.5)] lg:w-[calc((100%-80px)/5.5)] xl:w-[calc((100%-80px)/6.5)]"
                  >
                    <ProductCard 
                      product={product} 
                      onClick={() => setSelectedProduct(product)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="bg-archora-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-4xl mb-6">ARCHORA</h3>
            <p className="text-gray-400 max-w-md">Redefining modern luxury. Our pieces are crafted with precision, blending timeless elegance with contemporary design.</p>
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-archora-gold transition-colors">Living Room</a></li>
              <li><a href="#" className="hover:text-archora-gold transition-colors">Bedroom</a></li>
              <li><a href="#" className="hover:text-archora-gold transition-colors">Dining Room</a></li>
              <li><a href="#" className="hover:text-archora-gold transition-colors">Office Use Pro</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li>concierge@archora.com</li>
              <li>+1 (800) 123-4567</li>
              <li>123 Luxury Ave, NY 10001</li>
            </ul>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};
