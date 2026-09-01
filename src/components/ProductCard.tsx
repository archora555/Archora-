import React, { useState } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Box, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ProductQuickView } from './ProductQuickView';
import { useCurrency } from '../hooks/useCurrency';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  const { formatPrice } = useCurrency();
  const isWishlisted = wishlist.includes(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group relative flex flex-col cursor-pointer h-full transition-all duration-500 ease-out bg-transparent border-0 p-0 shadow-none"
        style={{ background: 'transparent' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="relative aspect-square overflow-hidden rounded-2xl mb-3.5 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] border border-white/15"
          style={{ 
            boxShadow: isHovered 
              ? '0 28px 50px rgba(0, 0, 0, 0.75)' 
              : '0 20px 40px rgba(0, 0, 0, 0.6)',
            backgroundColor: '#121214'
          }} 
          onClick={onClick}
        >
          <img 
            src={product.images[0] || undefined} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
          />
          {product.images[1] && (
            <img 
              src={product.images[1] || undefined} 
              alt={`${product.name} alternate`} 
              className={`absolute z-0 inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {!product.inStock && (
              <span 
                className="inline-flex items-center gap-1.5 bg-[#0e0e11]/95 text-[#DFBA67] border border-[#DFBA67]/70 text-[9px] md:text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest shadow-[0_4px_16px_rgba(0,0,0,0.6)] rounded-md backdrop-blur-md"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA67] animate-pulse shadow-[0_0_8px_#DFBA67] shrink-0" />
                Waitlist
              </span>
            )}
          </div>

          {/* Top ambient gradient for unified luxury depth and ensuring all badges/buttons have supreme legibility on white photos */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none z-[5]" />

          {/* Top right buttons: Wishlist & AR */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
            {product.modelUrl && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                  setTimeout(() => {
                     const mv = document.getElementById(`product-model-viewer-${product.id}`) as any || document.getElementById('product-model-viewer') as any;
                     if (mv && mv.activateAR) mv.activateAR();
                  }, 600);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#D4AF37] text-black hover:bg-[#E5C762] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 group/btn relative cursor-pointer"
                aria-label="View in AR"
              >
                <Box className="w-3.5 h-3.5 text-black" strokeWidth={1.5} />
                <span className="absolute -top-8 right-0 bg-[#0e0e11]/95 border border-white/20 text-white text-[9px] uppercase font-medium tracking-widest px-2 py-0.5 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded shadow-lg">AR 3D</span>
              </button>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#0e0e11]/85 hover:bg-[#1c1c22] border border-white/25 rounded-full flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isWishlisted ? 'fill-archora-gold text-archora-gold' : 'text-gray-200'}`} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center text-center px-1 mt-1.5 w-full" onClick={onClick}>
          <h3 className="font-display text-sm md:text-base text-white mb-2 group-hover:text-archora-gold transition-colors line-clamp-1 drop-shadow-md w-full">
            {product.name}
          </h3>

          {/* Bottom Action Row: Left Eye Icon, Center Price, Right Bag Icon */}
          <div className="flex items-center justify-between w-full px-0.5" onClick={(e) => e.stopPropagation()}>
            {/* Left: Quick View / Eye */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
              className="w-8 h-8 sm:w-9 sm:h-9 frosted-glass-white-btn hover:text-archora-gold text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group/btn relative active:scale-95 shrink-0 cursor-pointer"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0e0e11]/95 border border-white/20 text-white text-[9px] uppercase font-medium tracking-widest px-2 py-0.5 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded shadow-lg">Quick View</span>
            </button>

            {/* Center: Price */}
            <p className="text-[#DFBA67] font-medium text-xs sm:text-sm md:text-base tracking-wide drop-shadow-sm px-1">
              {formatPrice(product.price)}
            </p>

            {/* Right: Add to Cart / Bag */}
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(product, 1, product.colors[0] || 'Default'); }}
              className="w-8 h-8 sm:w-9 sm:h-9 frosted-glass-white-btn hover:text-archora-gold text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group/btn relative active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0 cursor-pointer"
              disabled={!product.inStock}
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0e0e11]/95 border border-white/20 text-white text-[9px] uppercase font-medium tracking-widest px-2 py-0.5 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded shadow-lg">Add to Cart</span>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isQuickViewOpen && (
          <ProductQuickView product={product} onClose={() => setIsQuickViewOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
