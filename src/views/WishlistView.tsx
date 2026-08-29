import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

export const WishlistView = () => {
  const { wishlist, products, setCurrentView } = useAppContext();
  const navigate = useNavigate();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="w-full pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="frosted-glass-white-card rounded-2xl p-10 max-w-md w-full shadow-2xl">
          <h2 className="font-display text-4xl mb-4 text-white">Your Wishlist is Empty</h2>
          <p className="text-gray-400 mb-8">Save your favorite pieces here to review later.</p>
          <button 
            onClick={() => setCurrentView('shop')}
            className="bg-archora-gold text-black font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#E5C762] transition-colors rounded-lg w-full cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h1 className="font-display text-4xl md:text-5xl text-white">Your Wishlist</h1>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {wishlistedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard 
                product={product} 
                onClick={() => navigate(`/product/${product.id}`)} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
