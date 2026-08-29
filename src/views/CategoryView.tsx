import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const CategoryView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, subCategories } = useAppContext();

  // Find the subcategory using the id param
  const subCat = subCategories.find(s => s.id === id);

  if (!subCat) {
    return (
      <div className="w-full pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen text-center">
        <h1 className="font-display text-4xl mb-6">Category Not Found</h1>
        <button onClick={() => navigate('/')} className="bg-archora-black text-white px-6 py-3 uppercase tracking-widest text-xs font-semibold">Return Home</button>
      </div>
    );
  }

  // Find products that belong to this subCategory
  const categoryProducts = products.filter(p => p.subCategory?.toLowerCase() === subCat.name.toLowerCase() || p.category.toLowerCase() === subCat.name.toLowerCase());

  return (
    <div className="w-full pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen text-white">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl mb-4 text-white">{subCat.name}</h1>
        <p className="text-gray-300 uppercase tracking-widest text-sm">Explore our {subCat.name} collection</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {categoryProducts.length > 0 ? (
          categoryProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => navigate(`/product/${product.id}`)} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            <p className="text-xl font-display mb-2 text-white">No pieces found in this category</p>
            <p>Check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
};
