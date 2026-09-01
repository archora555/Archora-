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
      <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h1 className="font-display text-4xl md:text-5xl mb-6 text-white">The Collection</h1>
        
        {/* Prominent AR Collection Banner */}
        <div className="frosted-glass-white-subtle border-l-4 border-l-archora-gold p-5 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-xl border border-white/15">
           <div>
              <h3 className="font-display text-xl text-archora-gold mb-1.5 flex items-center gap-2">
                <Box className="w-5 h-5 text-archora-gold" /> Interactive AR Collection
              </h3>
              <p className="text-sm text-gray-300 max-w-xl">Experience our premium furniture in your own space before you buy. Look for the AR Ready badge and view true-to-scale 3D models.</p>
           </div>
           <button 
             onClick={() => setSelectedCat(selectedCat === 'AR Ready' ? 'All' : 'AR Ready')}
             className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest font-bold transition-all shadow-md w-full md:w-auto rounded-lg cursor-pointer ${
               selectedCat === 'AR Ready' 
                 ? 'frosted-glass-white-btn text-white hover:bg-white/15 border border-white/30' 
                 : 'bg-archora-gold text-black hover:bg-[#E5C762]'
             }`}
           >
             <span className={`w-2 h-2 rounded-full ${selectedCat === 'AR Ready' ? 'bg-archora-gold' : 'bg-black'} animate-pulse`}></span>
             {selectedCat === 'AR Ready' ? 'View All Designs' : 'View AR Collection'}
           </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/10">
          <div className="flex flex-wrap gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-sm uppercase tracking-wider font-medium pb-2 border-b-2 transition-colors ${
                  selectedCat === cat 
                    ? 'border-archora-gold text-archora-gold' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-white/20 pb-2 focus:outline-none focus:border-archora-gold bg-transparent text-sm text-white placeholder-gray-400"
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
