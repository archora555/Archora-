import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShopView = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const navigate = useNavigate();
  
  const categories = ['All', 'Living', 'Bedroom', 'Dining', 'Office Use Pro', 'New Arrivals', 'Sale'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
                          
    let matchesCategory = false;
    if (selectedCat === 'All') {
      matchesCategory = true;
    } else if (selectedCat === 'AR Ready') {
      matchesCategory = !!p.modelUrl;
    } else {
      matchesCategory = p.category === selectedCat;
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="frosted-glass-white-card rounded-2xl p-5 md:p-6 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 pb-6 border-b border-white/10">
           <div className="flex-1 max-w-2xl">
              <h1 className="font-display text-3xl md:text-4xl mb-2 text-white">The Collection</h1>
              <p className="text-sm text-gray-300">
                Explore our curated selection. Look for the <strong className="text-archora-gold font-normal border-b border-archora-gold/50">AR Ready</strong> badge to view true-to-scale 3D models in your own space before you buy.
              </p>
           </div>
           <button 
             onClick={() => setSelectedCat(selectedCat === 'AR Ready' ? 'All' : 'AR Ready')}
             className={`shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-bold transition-all shadow-md w-full md:w-auto rounded-lg cursor-pointer ${
               selectedCat === 'AR Ready' 
                 ? 'frosted-glass-white-btn text-white hover:bg-white/15 border border-white/30' 
                 : 'bg-archora-gold text-black hover:bg-[#E5C762]'
             }`}
           >
             <Box className={`w-4 h-4 ${selectedCat === 'AR Ready' ? 'text-white' : 'text-black'}`} />
             {selectedCat === 'AR Ready' ? 'View All Designs' : 'View AR Collection'}
           </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-[10px] md:text-xs uppercase tracking-wider font-bold px-4 py-2.5 rounded-full transition-all border ${
                  selectedCat === cat 
                    ? 'bg-archora-gold border-archora-gold text-black shadow-[0_0_15px_rgba(223,186,103,0.4)]' 
                    : 'bg-black/40 border-white/15 text-gray-200 hover:bg-black/60 hover:text-white hover:border-[#DFBA67]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="w-full lg:w-64 shrink-0">
            <input 
              type="text" 
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-white/20 rounded-full px-4 py-2.5 focus:outline-none focus:border-archora-gold focus:ring-1 focus:ring-archora-gold/50 bg-black/40 text-sm text-white placeholder-gray-400 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => navigate(`/product/${product.id}`)} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              <p className="text-xl font-display mb-2 text-white">No pieces found</p>
              <p>Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
