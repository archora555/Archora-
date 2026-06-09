import React, { useState } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Map, ChevronLeft, ChevronRight, Check, Box } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '@google/model-viewer';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { wishlist, toggleWishlist, addToCart, setCurrentView } = useAppContext();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
    onClose();
    setCurrentView('checkout');
  };

  const [showARViewer, setShowARViewer] = useState(!!product.modelUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 py-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-6xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[85vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-archora-gold hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Images / AR */}
          <div className="w-full md:w-1/2 relative bg-[#F9F9F9] h-[300px] md:h-auto overflow-hidden">
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
                    id="product-model-viewer"
                    src={product.modelUrl}
                    alt={product.name}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    environment-image="neutral"
                    style={{ width: '100%', height: '100%', backgroundColor: '#F9F9F9' }}
                  >
                    <button 
                      slot="ar-button" 
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-archora-black text-white px-6 py-3 uppercase text-xs font-semibold tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2"
                    >
                      <Box className="w-4 h-4" /> View in your space
                    </button>
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold shadow-sm">
                      Interactive 3D | {product.dimensions}
                    </div>
                  </model-viewer>
                </motion.div>
              ) : (
                <motion.img 
                  key={`img-${currentImageIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[currentImageIdx]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </AnimatePresence>
            
            {!showARViewer && product.images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white transition-colors shadow-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 hover:bg-white transition-colors shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {product.modelUrl && (
              <button 
                onClick={() => setShowARViewer(!showARViewer)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full hover:bg-archora-gold hover:text-white transition-all shadow-md group flex items-center gap-2"
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
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
              <span className="text-archora-gold text-xs font-semibold uppercase tracking-widest">{product.category}</span>
              <button onClick={() => toggleWishlist(product.id)} className="text-gray-400 hover:text-archora-gold transition-colors">
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-archora-gold text-archora-gold' : ''}`} />
              </button>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-medium text-archora-black mb-4 leading-tight">{product.name}</h2>
            <p className="text-2xl font-light mb-6">${product.price.toLocaleString()}</p>
            
            <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8 pt-6 border-t border-gray-100">
              <div>
                <div className="flex items-center gap-2 text-archora-black mb-2">
                  <Map className="w-4 h-4 text-archora-gold" />
                  <span className="font-medium text-sm">Dimensions</span>
                </div>
                <p className="text-sm text-gray-500">{product.dimensions}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-archora-black mb-2">
                  <div className="w-4 h-4 border border-archora-gold rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 bg-archora-gold rounded-full"></span>
                  </div>
                  <span className="font-medium text-sm">Stock</span>
                </div>
                <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? `${product.stockCount} Available` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Colors */}
            {product.colors.length > 0 && product.colors[0] !== 'Default' && (
              <div className="mb-8">
                <span className="block text-sm font-medium mb-3">Color Finish</span>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-archora-gold scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.modelUrl && (
              <button 
                onClick={() => {
                  if (!showARViewer) {
                    setShowARViewer(true);
                    setTimeout(() => {
                      const mv = document.getElementById('product-model-viewer') as any;
                      if (mv && mv.activateAR) mv.activateAR();
                    }, 300);
                  } else {
                    const mv = document.getElementById('product-model-viewer') as any;
                    if (mv && mv.activateAR) mv.activateAR();
                  }
                }}
                className="mb-8 w-full border border-archora-gold text-archora-gold hover:bg-archora-gold hover:text-white transition-colors py-3 px-6 uppercase tracking-widest text-sm font-medium flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" /> View in Your Room
              </button>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= product.stockCount}
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 uppercase tracking-widest text-sm font-medium transition-all ${
                  added ? 'bg-green-600 text-white' : 'bg-archora-gray text-archora-black hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {added ? <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4"/> Added</span> : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-archora-black text-white hover:bg-archora-gold transition-colors py-3 px-6 uppercase tracking-widest text-sm font-medium disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
