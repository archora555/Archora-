import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Box, 
  MessageCircle, 
  Star, 
  ChevronDown, 
  Ruler, 
  Layers, 
  Truck 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '@google/model-viewer';

export interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { wishlist, toggleWishlist, addToCart, setCurrentView } = useAppContext();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteData, setQuoteData] = useState({ name: '', email: '', size: '', color: '', material: '', notes: '' });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);

  // Expandable accordions state for Dimensions, Materials, and Shipping
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    dimensions: true,
    materials: false,
    shipping: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const submitQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await addDoc(collection(db, 'quotes'), {
        productId: product.id,
        productName: product.name,
        customerName: quoteData.name,
        customerEmail: quoteData.email,
        size: quoteData.size,
        color: quoteData.color,
        material: quoteData.material,
        notes: quoteData.notes,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      alert('Custom quote request submitted successfully!');
      setShowQuoteForm(false);
    } catch (err: any) {
      alert('Failed to submit quote request: ' + err.message);
    } finally {
      setSubmittingQuote(false);
    }
  };

  const isWishlisted = wishlist.includes(product.id);

  const nextImg = () => {
    setShowARViewer(false);
    setCurrentImageIdx((p) => (p + 1) % product.images.length);
  };
  const prevImg = () => {
    setShowARViewer(false);
    setCurrentImageIdx((p) => (p - 1 + product.images.length) % product.images.length);
  };

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-[100] px-3 py-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 frosted-glass-white-backdrop"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-5xl frosted-glass-white-card shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden max-h-[92vh] md:max-h-[88vh] rounded-2xl border border-white/20 text-white"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 frosted-glass-white-btn p-2 rounded-full hover:bg-archora-gold hover:text-black text-gray-200 transition-colors shadow-sm cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Main View & Clickable Thumbnails */}
          <div className="w-full md:w-1/2 flex flex-col bg-white/5 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/15">
            {/* Main Display Area */}
            <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden bg-white/5">
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
                      id={`quickview-model-viewer-${product.id}`}
                      src={product.modelUrl || undefined}
                      alt={product.name}
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      camera-controls
                      auto-rotate
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}
                    >
                      <button 
                        slot="ar-button" 
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-archora-gold text-black px-5 py-2.5 uppercase text-xs font-semibold tracking-widest hover:bg-[#E5C762] transition-colors flex items-center gap-2 shadow-lg rounded-lg"
                      >
                        <Box className="w-4 h-4 text-black" /> View in space
                      </button>
                      <div className="absolute top-4 left-4 bg-[#0e0e11]/92 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] uppercase tracking-wider font-semibold shadow-md text-white rounded">
                        Interactive 3D | {product.dimensions || 'Custom Fit'}
                      </div>
                    </model-viewer>
                  </motion.div>
                ) : (
                  <motion.img 
                    key={`img-${currentImageIdx}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    src={product.images[currentImageIdx] || undefined} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </AnimatePresence>
              
              {/* Prev / Next Arrows for Main Photo */}
              {!showARViewer && product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImg} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#0e0e11]/85 hover:bg-[#1a1a1f] text-white p-2 rounded-full transition-all shadow-md cursor-pointer hover:scale-105 border border-white/20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={nextImg} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#0e0e11]/85 hover:bg-[#1a1a1f] text-white p-2 rounded-full transition-all shadow-md cursor-pointer hover:scale-105 border border-white/20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              {/* 3D AR Toggle Floating Badge if available */}
              {product.modelUrl && (
                <button 
                  onClick={() => setShowARViewer(!showARViewer)}
                  className="absolute bottom-4 right-4 bg-[#0e0e11]/85 hover:bg-[#1a1a1f] border border-white/20 px-3 py-2 rounded-full hover:text-archora-gold transition-all shadow-md flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
                  title={showARViewer ? "View high-res photos" : "Inspect in 3D & AR"}
                >
                  {showARViewer ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Photos</span>
                    </>
                  ) : (
                    <>
                      <Box className="w-4 h-4 text-archora-gold" />
                      <span>3D View</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Clickable Thumbnails Row */}
            {product.images && product.images.length > 0 && (
              <div className="p-3 frosted-glass-white-subtle border-t border-white/15 flex items-center gap-2.5 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentImageIdx(idx);
                      setShowARViewer(false);
                    }}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      !showARViewer && currentImageIdx === idx 
                        ? 'border-[#CFA344] ring-1 ring-[#CFA344]/50 shadow-sm scale-105 opacity-100' 
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                    }`}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}

                {product.modelUrl && (
                  <button
                    type="button"
                    onClick={() => setShowARViewer(true)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 flex flex-col items-center justify-center bg-white/10 cursor-pointer ${
                      showARViewer 
                        ? 'border-[#CFA344] ring-1 ring-[#CFA344]/50 shadow-sm scale-105 text-[#CFA344]' 
                        : 'border-white/20 opacity-65 text-gray-400 hover:opacity-100 hover:border-white/40'
                    }`}
                    aria-label="View 3D Model"
                  >
                    <Box className="w-5 h-5" />
                    <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">3D AR</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Details, Accordions, Actions */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex-1 flex flex-col md:overflow-y-auto min-h-0">
            {/* Category & Wishlist */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-[#CFA344] text-xs font-semibold uppercase tracking-widest">
                {product.category}
              </span>
              <button 
                onClick={() => toggleWishlist(product.id)} 
                className="text-gray-400 hover:text-[#CFA344] transition-colors p-1"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#CFA344] text-[#CFA344]' : ''}`} />
              </button>
            </div>
            
            {/* Title & Price */}
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mb-2 leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <p className="text-2xl font-light text-[#DFBA67]">
                ${product.price.toLocaleString()}
              </p>
              <span className={`text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-sm ${
                product.inStock ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {product.inStock ? `${product.stockCount} Available` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Colors Selection */}
            {product.colors.length > 0 && product.colors[0] !== 'Default' && (
              <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Finish: <span className="text-white">{selectedColor}</span>
                </span>
                <div className="flex gap-2.5">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === color ? 'border-[#CFA344] scale-110 shadow-sm' : 'border-white/30 hover:border-white/60'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Expandable Accordions: Dimensions, Materials, Shipping */}
            <div className="mb-6 border-t border-b border-white/10 divide-y divide-white/10">
              {/* 1. Dimensions Accordion */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('dimensions')}
                  className="w-full flex items-center justify-between text-left py-1 text-white hover:text-[#CFA344] transition-colors cursor-pointer group"
                  aria-expanded={openSections.dimensions}
                >
                  <div className="flex items-center gap-2.5">
                    <Ruler className="w-4 h-4 text-[#CFA344]" />
                    <span className="font-serif text-sm font-medium tracking-wide">Dimensions & Fit</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:text-[#CFA344] ${
                    openSections.dimensions ? 'rotate-180 text-[#CFA344]' : ''
                  }`} />
                </button>
                <AnimatePresence initial={false}>
                  {openSections.dimensions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2.5 pb-2 text-xs text-gray-300 space-y-1.5 pl-6">
                        <p><strong className="text-white font-medium">Specifications:</strong> {product.dimensions || '120 cm (W) × 80 cm (D) × 75 cm (H)'}</p>
                        <p><strong className="text-white font-medium">Clearance:</strong> Optimized architectural elevation with floor protector glides.</p>
                        <p><strong className="text-white font-medium">Fit Note:</strong> Designed to integrate seamlessly with residential and executive spaces.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Materials Accordion */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('materials')}
                  className="w-full flex items-center justify-between text-left py-1 text-white hover:text-[#CFA344] transition-colors cursor-pointer group"
                  aria-expanded={openSections.materials}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[#CFA344]" />
                    <span className="font-serif text-sm font-medium tracking-wide">Materials & Craftsmanship</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:text-[#CFA344] ${
                    openSections.materials ? 'rotate-180 text-[#CFA344]' : ''
                  }`} />
                </button>
                <AnimatePresence initial={false}>
                  {openSections.materials && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2.5 pb-2 text-xs text-gray-300 space-y-1.5 pl-6">
                        <p><strong className="text-white font-medium">Composition:</strong> {product.materials || 'Sustainably sourced premium hardwood, brushed brass alloy hardware, and organic protective matte sealant.'}</p>
                        <p><strong className="text-white font-medium">Artisanal Finish:</strong> Hand-inspected and hand-polished with micro-textured natural grain preservation.</p>
                        <p><strong className="text-white font-medium">Care:</strong> Wipe gently with a soft dry cloth. Avoid abrasive solvents or harsh chemicals.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Shipping Accordion */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between text-left py-1 text-white hover:text-[#CFA344] transition-colors cursor-pointer group"
                  aria-expanded={openSections.shipping}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#CFA344]" />
                    <span className="font-serif text-sm font-medium tracking-wide">Shipping & White-Glove Delivery</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:text-[#CFA344] ${
                    openSections.shipping ? 'rotate-180 text-[#CFA344]' : ''
                  }`} />
                </button>
                <AnimatePresence initial={false}>
                  {openSections.shipping && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2.5 pb-2 text-xs text-gray-300 space-y-1.5 pl-6">
                        <p><strong className="text-white font-medium">Delivery:</strong> Complimentary insured white-glove delivery on all bespoke luxury orders.</p>
                        <p><strong className="text-white font-medium">Timeline:</strong> Dispatched in 3–5 business days with scheduled room-of-choice placement and debris removal.</p>
                        <p><strong className="text-white font-medium">Guarantee:</strong> 30-day architectural satisfaction guarantee with insured return service.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quantity and Primary Cart Buttons */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center border border-white/20 rounded-lg frosted-glass-white-input">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 hover:bg-white/10 transition-colors text-sm text-white"
                  aria-label="Decrease quantity"
                >-</button>
                <span className="w-10 text-center font-medium text-sm text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3.5 py-2.5 hover:bg-white/10 transition-colors text-sm text-white"
                  disabled={quantity >= product.stockCount}
                  aria-label="Increase quantity"
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-2.5 px-5 uppercase tracking-widest text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  added ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                } disabled:opacity-50`}
              >
                {added ? <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4"/> Added to Cart</span> : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-archora-gold text-black hover:bg-[#E5C762] transition-colors py-2.5 px-5 uppercase tracking-widest text-xs font-semibold rounded-lg disabled:opacity-50 cursor-pointer shadow-md"
              >
                Buy Now
              </button>
            </div>

            {/* WhatsApp Order & Custom Quote */}
            <div className="mt-3 flex flex-col gap-2.5">
              <button 
                onClick={() => {
                  const message = encodeURIComponent(`Hi, I want to order ${product.name} for $${product.price}. Link: ${window.location.origin}/shop?productId=${product.id}`);
                  window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
                }}
                className="w-full border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 hover:text-emerald-200 py-2.5 px-5 uppercase tracking-widest text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                <span>Order on WhatsApp</span>
              </button>

              <button 
                onClick={() => setShowQuoteForm(true)}
                className="w-full border border-white/15 bg-white/5 text-gray-300 py-2.5 px-5 uppercase tracking-widest text-xs font-semibold hover:border-archora-gold hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Request Custom Quote
              </button>
            </div>

            {/* Customer Reviews Accordion / Section */}
            <hr className="my-6 border-white/10" />
            <div className="mt-auto">
               <h3 className="text-lg font-display font-medium mb-4 text-white">Customer Reviews</h3>
               <ReviewsSection productId={product.id} />
            </div>

          </div>
        </motion.div>

        {/* Custom Quote Request Modal */}
        {showQuoteForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 frosted-glass-white-backdrop" onClick={() => setShowQuoteForm(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative frosted-glass-white-card border border-white/20 p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] text-white"
            >
              <button 
                onClick={() => setShowQuoteForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
                aria-label="Close quote dialog"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-display text-2xl mb-2 text-white">Request Custom Quote</h3>
              <p className="text-xs text-gray-300 mb-6">Specify bespoke dimensions, custom wood finishes, or upholstery requirements for {product.name}.</p>
              
              <form onSubmit={submitQuoteRequest} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Your Name</label>
                  <input required type="text" className="w-full frosted-glass-white-input text-white p-2.5 text-sm rounded-lg focus:border-archora-gold outline-none" value={quoteData.name} onChange={e => setQuoteData({...quoteData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Your Email</label>
                  <input required type="email" className="w-full frosted-glass-white-input text-white p-2.5 text-sm rounded-lg focus:border-archora-gold outline-none" value={quoteData.email} onChange={e => setQuoteData({...quoteData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Custom Size Request</label>
                  <input type="text" placeholder="e.g. 220cm × 100cm × 76cm" className="w-full frosted-glass-white-input text-white placeholder-gray-400 p-2.5 text-sm rounded-lg focus:border-archora-gold outline-none" value={quoteData.size} onChange={e => setQuoteData({...quoteData, size: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Color / Finish Request</label>
                  <input type="text" placeholder="e.g. Smoked Oak, Brushed Brass, Matte Charcoal" className="w-full frosted-glass-white-input text-white placeholder-gray-400 p-2.5 text-sm rounded-lg focus:border-archora-gold outline-none" value={quoteData.color} onChange={e => setQuoteData({...quoteData, color: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Material Preference</label>
                  <input type="text" placeholder="e.g. Full-grain Cognac Leather, Italian Travertine" className="w-full frosted-glass-white-input text-white placeholder-gray-400 p-2.5 text-sm rounded-lg focus:border-archora-gold outline-none" value={quoteData.material} onChange={e => setQuoteData({...quoteData, material: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">Additional Notes</label>
                  <textarea className="w-full frosted-glass-white-input text-white placeholder-gray-400 p-2.5 h-20 text-sm rounded-lg focus:border-archora-gold outline-none" value={quoteData.notes} onChange={e => setQuoteData({...quoteData, notes: e.target.value})} />
                </div>
                <button type="submit" disabled={submittingQuote} className="w-full bg-archora-gold text-black hover:bg-[#E5C762] transition-colors py-3 uppercase text-xs tracking-widest font-semibold rounded-lg disabled:opacity-50 cursor-pointer shadow-md">
                  {submittingQuote ? 'Submitting...' : 'Submit Bespoke Request'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

// Also export as ProductModal for backward compatibility
export const ProductModal = ProductQuickView;

const ReviewsSection = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
         const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
         const { db } = await import('../firebase');
         const q = query(collection(db, 'reviews'), where('productId', '==', productId), orderBy('createdAt', 'desc'));
         const unsub = onSnapshot(q, (snapshot) => {
           const revs: any[] = [];
           snapshot.forEach(doc => revs.push({ id: doc.id, ...doc.data() }));
           setReviews(revs);
           setLoading(false);
         }, (error) => {
           console.error("Failed to fetch reviews", error);
           setLoading(false);
         });
         return () => unsub();
      } catch (e) {
         console.error(e);
         setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await addDoc(collection(db, 'reviews'), {
        productId,
        customerName: name,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      setShowForm(false);
      setName('');
      setComment('');
      setRating(5);
    } catch(err: any) {
      alert("Failed to submit review: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const average = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;

  if (loading) return <div className="text-xs text-gray-400 py-2">Loading reviews...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <div className="flex">
             {[1,2,3,4,5].map(star => (
               <Star key={star} className={`w-4 h-4 ${star <= Number(average) ? 'fill-archora-gold text-archora-gold' : 'text-gray-600'}`} />
             ))}
           </div>
           <span className="font-semibold text-sm text-white">{average}</span>
           <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
         </div>
         <button onClick={() => setShowForm(!showForm)} className="text-xs font-semibold uppercase tracking-widest text-[#CFA344] hover:text-white transition-colors cursor-pointer">
           {showForm ? 'Cancel' : 'Write Review'}
         </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="frosted-glass-white-card p-4 rounded-xl space-y-3">
           <div>
             <label className="block text-xs font-medium text-gray-300 mb-1">Your Name</label>
             <input required type="text" className="w-full frosted-glass-white-input text-white p-2 text-sm rounded-lg" value={name} onChange={e=>setName(e.target.value)} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-300 mb-1">Rating</label>
             <div className="flex gap-1">
               {[1,2,3,4,5].map(star => (
                 <Star 
                   key={star} 
                   onClick={() => setRating(star)}
                   className={`w-5 h-5 cursor-pointer hover:scale-110 transition-transform ${star <= rating ? 'fill-archora-gold text-archora-gold' : 'text-gray-600'}`} 
                 />
               ))}
             </div>
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-300 mb-1">Your Feedback</label>
             <textarea required className="w-full frosted-glass-white-input text-white p-2 text-sm h-20 rounded-lg" value={comment} onChange={e=>setComment(e.target.value)} />
           </div>
           <button type="submit" disabled={submitting} className="bg-archora-gold text-black px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#E5C762] transition-colors disabled:opacity-50 rounded-lg cursor-pointer">
             {submitting ? 'Submitting...' : 'Submit Review'}
           </button>
        </form>
      )}

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No reviews yet for this piece.</p>
        ) : (
          reviews.map(rev => (
            <div key={rev.id} className="border-b border-white/10 pb-3">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-xs font-display text-white">{rev.customerName}</strong>
                <span className="text-[10px] text-gray-400">{rev.createdAt ? new Date(rev.createdAt.toMillis()).toLocaleDateString() : 'Recent'}</span>
              </div>
              <div className="flex mb-1.5">
                 {[1,2,3,4,5].map(star => (
                   <Star key={star} className={`w-3 h-3 ${star <= rev.rating ? 'fill-archora-gold text-archora-gold' : 'text-gray-600'}`} />
                 ))}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
