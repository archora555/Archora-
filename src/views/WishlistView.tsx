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
        <h2 className="font-display text-4xl mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Save your favorite pieces here to review later.</p>
        <button 
          onClick={() => setCurrentView('shop')}
          className="bg-archora-black text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-archora-gold transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="font-display text-5xl mb-12">Your Wishlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
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
  );
};
