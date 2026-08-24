import React, { useState } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Box, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
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
        className="group relative flex flex-col cursor-pointer h-full transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] bg-white p-2 rounded-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8] mb-4 transition-all duration-500 group-hover:shadow-inner" onClick={onClick}>
          <img 
            src={product.images[0] || undefined} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0 drop-shadow-xl mix-blend-multiply"
          />
          {product.images[1] && (
            <img 
              src={product.images[1] || undefined} 
              alt={`${product.name} alternate`} 
              className={`absolute z-0 inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out drop-shadow-xl mix-blend-multiply ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Ambient shadow underneath item */}
          <div className="absolute bottom-0 left-[10%] right-[10%] h-[15%] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.12)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-30 mix-blend-multiply"></div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.category !== 'All' && ['Sale', 'New Arrivals', 'Best Seller'].includes(product.category) && (
              <span className="bg-white/95 backdrop-blur text-archora-black text-[9px] md:text-[10px] font-semibold px-2.5 py-1 uppercase tracking-widest shadow-sm w-fit inline-block">
                {product.category}
              </span>
            )}
            {!product.inStock && (
               <span className="bg-archora-black/95 backdrop-blur text-white text-[9px] md:text-[10px] font-semibold px-2.5 py-1 uppercase tracking-widest shadow-sm w-fit inline-block">
                 Waitlist
               </span>
            )}
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            className="absolute top-2 right-2 p-2 hover:bg-white/50 rounded-full transition-colors z-20"
          >
            <Heart className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isWishlisted ? 'fill-archora-gold text-archora-gold' : 'text-gray-400'}`} strokeWidth={1.5} />
          </button>

          {/* Action Icons */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 md:gap-3 z-20 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
              className="w-10 h-10 md:w-11 md:h-11 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-archora-black hover:text-white text-archora-black shadow-lg transition-colors group/btn relative"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-archora-black text-white text-[9px] uppercase font-medium tracking-widest px-2 py-1 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded-sm">Quick View</span>
            </button>
            <button 
               onClick={(e) => { e.stopPropagation(); addToCart(product, 1, product.colors[0] || 'Default'); }}
               className="w-10 h-10 md:w-11 md:h-11 bg-white/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-archora-black hover:text-white text-archora-black shadow-lg transition-colors group/btn relative"
               disabled={!product.inStock}
               aria-label="Add to Cart"
            >
               <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
               <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-archora-black text-white text-[9px] uppercase font-medium tracking-widest px-2 py-1 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded-sm">Add to Cart</span>
            </button>
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
                 className="w-10 h-10 md:w-11 md:h-11 bg-archora-gold/95 backdrop-blur rounded-full flex items-center justify-center hover:bg-[#b08d28] text-white shadow-lg transition-colors group/btn relative"
                 aria-label="View in AR"
              >
                 <Box className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={1.5} />
                 <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-archora-black text-white text-[9px] uppercase font-medium tracking-widest px-2 py-1 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none rounded-sm">View in AR</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center text-center px-2 mt-2" onClick={onClick}>
          <h3 className="font-display text-sm md:text-base text-archora-black mb-1.5 group-hover:text-archora-gold transition-colors">{product.name}</h3>
          <p className="text-gray-500 font-medium text-xs md:text-sm tracking-wide">${product.price.toLocaleString()}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {isQuickViewOpen && (
          <ProductModal product={product} onClose={() => setIsQuickViewOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
