import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Trash2, ArrowRight } from 'lucide-react';
import { Coupon } from '../types';
import { useCurrency } from '../hooks/useCurrency';

export const CartView = () => {
  const { cart, updateCartQuantity, removeFromCart, setCurrentView, appliedCoupon, setAppliedCoupon } = useAppContext();
  const { formatPrice } = useCurrency();
  
  const [couponCode, setCouponCode] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      const d = await getDoc(doc(db, 'coupons', couponCode.toUpperCase()));
      if (d.exists()) {
        const c = d.data() as Coupon;
        if (!c.isActive) {
          setCouponError('This coupon is no longer active.');
          return;
        }
        if (c.expiryDate && new Date(c.expiryDate) < new Date()) {
          setCouponError('This coupon has expired.');
          return;
        }
        setAppliedCoupon(c);
      } else {
        setCouponError('Invalid coupon code.');
      }
    } catch(e) {
      setCouponError('Error applying coupon.');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = subtotal * (appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const total = subtotal - discountAmount + (cart.length > 0 ? shipping : 0);

  if (cart.length === 0) {
    return (
      <div className="w-full pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
        <div className="frosted-glass-white-card rounded-2xl p-10 max-w-md w-full shadow-2xl">
          <h2 className="font-display text-4xl mb-4 text-white">Your Bag is Empty</h2>
          <p className="text-gray-400 mb-8">Discover our collection of premium furniture and elevate your space.</p>
          <button 
            onClick={() => setCurrentView('shop')}
            className="bg-archora-gold text-black font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#E5C762] transition-colors rounded-lg w-full"
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
        <h1 className="font-display text-4xl md:text-5xl text-white">Your Bag</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 flex flex-col gap-6 frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
          {cart.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={`${item.product.id}-${item.selectedColor}`} 
              className="flex gap-6 pb-6 border-b border-white/10 last:border-0"
            >
              <div className="w-28 h-36 bg-white/5 border border-white/15 rounded-lg overflow-hidden shrink-0">
                <img src={item.product.images[0] || undefined} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl md:text-2xl text-white">{item.product.name}</h3>
                    <p className="font-medium text-[#DFBA67]">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">Color: {item.selectedColor}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-white/20 rounded-lg overflow-hidden frosted-glass-white-input">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-white/10 text-white transition-colors"
                    >-</button>
                    <span className="w-10 text-center text-sm font-medium text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-white/10 text-white transition-colors"
                      disabled={item.quantity >= item.product.stockCount}
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 sticky top-32 shadow-2xl">
            <h3 className="font-display text-2xl mb-6 text-white">Order Summary</h3>
            <div className="flex flex-col gap-4 text-sm border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">White Glove Delivery</span>
                <span className="text-white">{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-archora-gold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="mb-6 border-b border-white/10 pb-6">
              <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Gift card or discount code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 frosted-glass-white-input rounded-lg p-3 text-sm uppercase font-mono text-white placeholder-gray-400 focus:outline-none focus:border-archora-gold" 
                  placeholder="CODE"
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                <button type="button" onClick={appliedCoupon ? () => {setAppliedCoupon(null); setCouponCode('')} : handleApplyCoupon} className="bg-archora-gold text-black px-4 text-xs tracking-widest uppercase hover:bg-[#E5C762] transition-colors font-semibold disabled:opacity-50 rounded-lg">
                  {appliedCoupon ? 'Remove' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
              {appliedCoupon && <p className="text-green-400 text-xs mt-2">Code applied successfully!</p>}
            </div>

            <div className="flex justify-between text-lg font-medium mb-8">
              <span className="text-white">Total</span>
              <span className="text-[#DFBA67] font-display text-2xl">{formatPrice(total)}</span>
            </div>
            <button 
              onClick={() => setCurrentView('checkout')}
              className="w-full bg-archora-gold text-black font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#E5C762] transition-colors flex justify-center items-center gap-3 rounded-lg shadow-lg"
            >
              Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">Taxes calculated at checkout based on delivery address.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
