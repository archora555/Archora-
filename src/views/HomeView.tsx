import React from 'react';
import { Hero } from '../components/Hero';
import { CategorySelector } from '../components/CategorySelector';
import { ProductCard } from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const HomeView = () => {
  const { products, homeSections, logoConfig } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Hero />
      
      <CategorySelector />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-12 md:gap-16 overflow-hidden">
        {homeSections.map((section) => {
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
                    className="shrink-0 snap-start w-[calc(100%/2.2)] sm:w-[calc(100%/3.2)] lg:w-[calc(100%/4.2)]"
                  >
                    <ProductCard 
                      product={product} 
                      onClick={() => navigate(`/product/${product.id}`)} 
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
            {logoConfig.type === 'text' || !logoConfig.imageUrl ? (
              <h3 className="font-display text-4xl mb-6">{logoConfig.text || 'ARCHORA'}</h3>
            ) : (
              <img 
                src={logoConfig.imageUrl} 
                alt={logoConfig.text || 'ARCHORA'} 
                className="h-10 object-contain mb-6 invert"
              />
            )}
            {logoConfig.type === 'image' && logoConfig.imageUrl && (
              <h3 className="hidden font-display text-4xl mb-6">{logoConfig.text || 'ARCHORA'}</h3>
            )}
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
    </div>
  );
};
