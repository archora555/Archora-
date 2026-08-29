import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Map, ChevronLeft, ChevronRight, Check, Box, MessageCircle, Star } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import '@google/model-viewer';

export const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist, addToCart, setCurrentView } = useAppContext();
  
  const product = products.find(p => p.id === id);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Default');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);

  useEffect(() => {
    if (product) {
      setCurrentImageIdx(0);
      setSelectedColor(product.colors[0] || 'Default');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
      setQuantity(1);
      setShowARViewer(!!product.modelUrl);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="w-full pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen text-center">
        <h1 className="font-display text-4xl mb-6">Product Not Found</h1>
        <button onClick={() => navigate('/')} className="bg-archora-black text-white px-6 py-3 uppercase tracking-widest text-xs font-semibold">Return Home</button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const nextImg = () => setCurrentImageIdx((p) => (p + 1) % product.images.length);
  const prevImg = () => setCurrentImageIdx((p) => (p - 1 + product.images.length) % product.images.length);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/');
    setCurrentView('checkout');
  };

  // Find related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || (p.subCategory && p.subCategory === product.subCategory)))
    .slice(0, 4);

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="frosted-glass-white-card rounded-2xl p-6 md:p-10 shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          
          {/* Left: Images / AR */}
          <div className="w-full md:w-1/2 relative bg-white/5 border border-white/15 rounded-xl overflow-hidden aspect-square flex-shrink-0">
            <AnimatePresence mode="wait">
              {showARViewer && product.modelUrl ? (
                <motion.div 
                  key="ar-viewer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative"
                >
                  <model-viewer
                    id={`product-model-viewer-${product.id}`}
                    src={product.modelUrl || undefined}
                    alt={product.name}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  >
                    <button 
                      slot="ar-button" 
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-archora-gold text-black px-6 py-3 uppercase text-xs font-semibold tracking-widest hover:bg-[#E5C762] transition-colors flex items-center gap-2 rounded-lg shadow-lg cursor-pointer"
                    >
                      <Box className="w-4 h-4" /> View in your space
                    </button>
                    <div className="absolute top-4 left-4 bg-[#0e0e11]/92 backdrop-blur-md text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded shadow-md border border-white/20">
                      Interactive 3D | {product.dimensions}
                    </div>
                  </model-viewer>
                </motion.div>
              ) : (
                <motion.img 
                  key={`img-${currentImageIdx}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[currentImageIdx] || undefined} 
                  alt={product.name} 
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    if (swipe < -50) nextImg();
                    else if (swipe > 50) prevImg();
                  }}
                />
              )}
            </AnimatePresence>
            
            {!showARViewer && product.images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0e0e11]/85 hover:bg-[#1a1a1f] text-white p-2 transition-colors shadow-md rounded-full border border-white/20 cursor-pointer" aria-label="Previous image">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0e0e11]/85 hover:bg-[#1a1a1f] text-white p-2 transition-colors shadow-md rounded-full border border-white/20 cursor-pointer" aria-label="Next image">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {product.modelUrl && (
              <button 
                onClick={() => setShowARViewer(!showARViewer)}
                className="absolute bottom-4 right-4 bg-[#0e0e11]/85 hover:bg-[#1a1a1f] text-white p-3 rounded-full hover:text-archora-gold transition-all shadow-md group flex items-center gap-2 border border-white/30 cursor-pointer"
                title={showARViewer ? "View Photos" : "View in 3D & AR"}
              >
                {showARViewer ? (
                  <X className="w-5 h-5" />
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-archora-gold animate-pulse"></span>
                    <Box className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 flex flex-col min-h-0">
            <div className="flex justify-between items-start mb-2">
              <span className="text-archora-gold text-xs font-semibold uppercase tracking-widest">{product.subCategory || product.category}</span>
              <button onClick={() => toggleWishlist(product.id)} className="text-gray-400 hover:text-archora-gold transition-colors">
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-archora-gold text-archora-gold' : ''}`} />
              </button>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-medium text-white mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-light text-[#DFBA67] mb-6">${product.price.toLocaleString()}</p>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pt-6 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 text-white mb-2">
                  <Map className="w-4 h-4 text-archora-gold" />
                  <span className="font-medium text-sm">Dimensions</span>
                </div>
                <p className="text-sm text-gray-400">{product.dimensions || 'Standard'}</p>
              </div>
              {product.materials && (
                <div>
                  <div className="flex items-center gap-2 text-white mb-2">
                    <Box className="w-4 h-4 text-archora-gold" />
                    <span className="font-medium text-sm">Materials</span>
                  </div>
                  <p className="text-sm text-gray-400">{product.materials}</p>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-white mb-2">
                  <div className="w-4 h-4 border border-archora-gold rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-archora-gold rounded-full"></span>
                  </div>
                  <span className="font-medium text-sm">Stock</span>
                </div>
                <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? `${product.stockCount} Available` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && product.colors[0] !== 'Default' && (
              <div className="mb-8">
                <span className="block text-sm font-medium mb-3 text-white">Color Finish</span>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-archora-gold scale-110' : 'border-white/20'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'Standard' && (
              <div className="mb-8">
                <span className="block text-sm font-medium mb-3 text-white">Size Options</span>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border px-4 py-2 text-sm rounded-lg transition-colors ${selectedSize === size ? 'border-archora-gold bg-archora-gold text-black font-semibold' : 'border-white/20 hover:border-white/40 text-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4 sticky bottom-4 z-50 frosted-glass-white-header md:static md:bg-transparent md:backdrop-blur-none md:border-none rounded-xl p-2 md:p-0">
              <div className="flex items-center border border-white/20 frosted-glass-white-input rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-white/10 text-white transition-colors"
                >-</button>
                <span className="w-12 text-center font-medium text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-4 py-3 hover:bg-white/10 text-white transition-colors"
                  disabled={quantity >= product.stockCount}
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 uppercase tracking-widest text-sm font-medium rounded-lg transition-all ${
                  added ? 'bg-green-600 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                } disabled:opacity-50`}
              >
                {added ? <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4"/> Added</span> : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-archora-gold text-black hover:bg-[#E5C762] transition-colors py-3 px-6 uppercase tracking-widest text-sm font-semibold rounded-lg disabled:opacity-50 shadow-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 w-full">
          <h2 className="font-display text-3xl mb-8 text-white">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onClick={() => navigate(`/product/${p.id}`)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
