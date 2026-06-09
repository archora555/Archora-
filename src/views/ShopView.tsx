import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { Box } from 'lucide-react';
import { Product } from '../types';

export const ShopView = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  
  const categories = ['All', 'Living', 'Bedroom', 'Dining', 'Office Use Pro', 'New Arrivals', 'Sale', 'Best Seller'];

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
    <div className="w-full pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="font-display text-5xl mb-6">The Collection</h1>
        
        {/* Prominent AR Collection Banner */}
        <div className="bg-archora-gold/10 border-l-4 border-archora-gold p-5 md:p-6 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-r-md">
           <div>
              <h3 className="font-display text-xl text-archora-gold mb-1.5 flex items-center gap-2">
                <Box className="w-5 h-5 text-archora-gold" /> Interactive AR Collection
              </h3>
              <p className="text-sm text-gray-700 max-w-xl">Experience our premium furniture in your own space before you buy. Look for the AR Ready badge and view true-to-scale 3D models.</p>
           </div>
           <button 
             onClick={() => setSelectedCat(selectedCat === 'AR Ready' ? 'All' : 'AR Ready')}
             className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest font-bold transition-all shadow-md w-full md:w-auto ${
               selectedCat === 'AR Ready' 
                 ? 'bg-archora-black text-white hover:bg-gray-800' 
                 : 'bg-archora-gold text-white hover:bg-[#b08d28]'
             }`}
           >
             <span className={`w-2 h-2 rounded-full ${selectedCat === 'AR Ready' ? 'bg-archora-gold' : 'bg-white'} animate-pulse`}></span>
             {selectedCat === 'AR Ready' ? 'View All Designs' : 'View AR Collection'}
           </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex flex-wrap gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-sm uppercase tracking-wider font-medium pb-1 border-b-2 transition-colors ${
                  selectedCat === cat 
                    ? 'border-archora-black text-archora-black' 
                    : 'border-transparent text-gray-400 hover:text-archora-black'
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
              className="w-full border-b border-archora-black/20 pb-2 focus:outline-none focus:border-archora-gold bg-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => setSelectedProduct(product)} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500">
            <p className="text-xl font-display mb-2">No pieces found</p>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};
