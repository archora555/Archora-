import React, { useState } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, X, ChevronRight, ChevronLeft, Check, Box } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  const isWishlisted = wishlist.includes(product.id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-archora-gray mb-3 transition-all duration-500 shadow-sm group-hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4),0_0_30px_rgba(212,175,55,0.25)] group-hover:-translate-y-1.5" onClick={onClick}>
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-0"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate`} 
            className={`absolute z-0 inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 relative">
          {product.category !== 'All' && ['Sale', 'New Arrivals', 'Best Seller'].includes(product.category) && (
            <span className="bg-white/90 backdrop-blur text-archora-black text-[9px] md:text-[10px] font-semibold px-2 py-1 uppercase tracking-wider shadow-sm w-fit inline-block">
              {product.category}
            </span>
          )}
          {product.modelUrl && (
            <span className="bg-archora-gold/90 backdrop-blur text-white text-[9px] md:text-[10px] font-semibold px-2 py-1 uppercase tracking-wider shadow-sm flex items-center gap-1 w-fit">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> AR Ready
            </span>
          )}
          {!product.inStock && (
             <span className="bg-archora-black/90 backdrop-blur text-white text-[9px] md:text-[10px] font-semibold px-2 py-1 uppercase tracking-wider shadow-sm w-fit inline-block">
               Out of Stock
             </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-start px-1 gap-2 mb-3" onClick={onClick}>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm md:text-base text-archora-black mb-0.5 group-hover:text-archora-gold transition-colors truncate">{product.name}</h3>
          <p className="text-archora-black font-medium text-xs md:text-sm">${product.price.toLocaleString()}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="p-1 hover:text-archora-gold transition-colors shrink-0 z-10 relative"
        >
          <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isWishlisted ? 'fill-archora-gold text-archora-gold' : ''}`} strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-auto px-1 flex flex-col gap-2 relative z-10">
        {product.modelUrl && (
          <button
             onClick={(e) => { 
               e.stopPropagation();
               onClick(); // Open modal
               setTimeout(() => {
                  const mv = document.getElementById('product-model-viewer') as any;
                  if (mv && mv.activateAR) mv.activateAR();
               }, 600);
             }}
             className="w-full bg-archora-gold hover:bg-[#b08d28] text-white py-2.5 text-[10px] xl:text-xs tracking-wider font-semibold transition-colors uppercase flex items-center justify-center gap-2 border border-archora-gold shadow-sm"
             title="View in Your Room (AR)"
          >
             <Box className="w-3.5 h-3.5" /> View in AR
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product, 1, product.colors[0] || 'Default'); }}
          className="w-full bg-white hover:bg-archora-black hover:text-white text-archora-black py-2.5 text-[10px] xl:text-xs tracking-wider font-medium transition-colors uppercase flex items-center justify-center gap-2 border border-gray-200"
          disabled={!product.inStock}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> <span className="inline">Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};
