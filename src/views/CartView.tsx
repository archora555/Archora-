import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { Trash2, ArrowRight } from 'lucide-react';
import { Coupon } from '../types';

export const CartView = () => {
  const { cart, updateCartQuantity, removeFromCart, setCurrentView, appliedCoupon, setAppliedCoupon } = useAppContext();
  
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
        <h2 className="font-display text-4xl mb-4">Your Bag is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Discover our collection of premium furniture and elevate your space.</p>
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
      <h1 className="font-display text-5xl mb-12">Your Bag</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {cart.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={`${item.product.id}-${item.selectedColor}`} 
              className="flex gap-6 pb-8 border-b border-gray-100"
            >
              <div className="w-32 h-40 bg-archora-gray shrink-0">
                <img src={item.product.images[0] || undefined} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-2xl text-archora-black">{item.product.name}</h3>
                    <p className="font-medium">${(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Color: {item.selectedColor}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-50 transition-colors"
                    >-</button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      disabled={item.quantity >= item.product.stockCount}
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-archora-gray p-8 sticky top-32">
            <h3 className="font-display text-2xl mb-6">Order Summary</h3>
            <div className="flex flex-col gap-4 text-sm border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">White Glove Delivery</span>
                <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toLocaleString()}`}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-archora-gold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mb-6 border-b border-gray-200 pb-6">
              <label className="block text-sm uppercase tracking-widest text-gray-500 mb-2">Gift card or discount code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border p-3 text-sm uppercase font-mono" 
                  placeholder="CODE"
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                <button type="button" onClick={appliedCoupon ? () => {setAppliedCoupon(null); setCouponCode('')} : handleApplyCoupon} className="bg-archora-black px-4 text-white text-xs tracking-widest uppercase hover:bg-archora-gold transition-colors font-semibold disabled:opacity-50">
                  {appliedCoupon ? 'Remove' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              {appliedCoupon && <p className="text-green-600 text-xs mt-2">Code applied successfully!</p>}
            </div>

            <div className="flex justify-between text-lg font-medium mb-8">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setCurrentView('checkout')}
              className="w-full bg-archora-black text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-archora-gold transition-colors flex justify-center items-center gap-3"
            >
              Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Taxes calculated at checkout based on delivery address.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
