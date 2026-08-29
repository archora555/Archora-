import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Coupon } from '../types';
import { ArchoraLogo } from '../components/ArchoraLogo';

export const CheckoutView = () => {
  const { cart, clearCart, addOrder, setCurrentView, appliedCoupon, setAppliedCoupon } = useAppContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    exp: '',
    cvc: ''
  });

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
  
  const total = Math.max(0, subtotal - discountAmount) + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      status: 'Processing' as const,
      customerInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.country} ${formData.zip}`
      }
    };

    addOrder(newOrder);
    setIsSuccess(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isSuccess) {
    return (
      <div className="w-full pt-40 pb-24 px-6 max-w-3xl mx-auto min-h-screen text-center flex flex-col items-center">
        <div className="frosted-glass-white-card rounded-2xl p-10 max-w-xl w-full shadow-2xl">
          <div className="mb-6 flex justify-center">
            <ArchoraLogo height={36} className="h-9 w-auto object-contain" />
          </div>
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <CheckCircle2 className="w-16 h-16 text-archora-gold mb-6 mx-auto" />
          </motion.div>
          <h1 className="font-display text-4xl mb-4 text-white">Order Confirmed</h1>
          <p className="text-gray-300 mb-8 text-base">Thank you for your purchase. Your exquisite pieces are being prepared for delivery. A confirmation email has been sent to {formData.email}.</p>
          <button 
            onClick={() => setCurrentView('home')}
            className="bg-archora-gold text-black font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#E5C762] transition-colors rounded-lg w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    setCurrentView('cart');
    return null;
  }

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h1 className="font-display text-4xl md:text-5xl text-white">Checkout</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-8">
          
          <section className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-2xl mb-6 text-white">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="email" name="email" placeholder="Email Address" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
            </div>
          </section>

          <section className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-2xl mb-6 text-white">Delivery Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="address" placeholder="Address" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="city" placeholder="City" onChange={handleChange} className="col-span-2 sm:col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="zip" placeholder="Postal Code" onChange={handleChange} className="col-span-2 sm:col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <select required name="country" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 focus:border-archora-gold focus:outline-none text-white [&>option]:bg-[#121212] [&>option]:text-white">
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="France">France</option>
              </select>
            </div>
          </section>

          <section className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-2xl mb-6 text-white">Payment Method</h2>
            <div className="grid grid-cols-4 gap-4 p-6 border border-white/15 rounded-xl frosted-glass-white-subtle">
              <input required type="text" name="cardNumber" placeholder="Card Number" onChange={handleChange} className="col-span-4 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="exp" placeholder="MM/YY" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="cvc" placeholder="CVC" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
            </div>
          </section>

          <button 
            type="submit"
            className="w-full bg-archora-gold text-black font-semibold px-8 py-5 text-sm tracking-widest uppercase hover:bg-[#E5C762] transition-colors rounded-xl shadow-lg cursor-pointer"
          >
            Place Order • ${total.toLocaleString()}
          </button>
        </form>

        <div className="w-full lg:w-1/3">
          <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 sticky top-32 shadow-2xl">
            <h3 className="font-display text-2xl mb-6 text-white">Your Order</h3>
            <div className="flex flex-col gap-6 mb-8 border-b border-white/10 pb-8">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-24 bg-white/5 border border-white/15 rounded-lg overflow-hidden shrink-0">
                    <img src={item.product.images[0] || undefined} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-white mb-1">{item.product.name}</p>
                    <p className="text-gray-400 mb-1">Qty: {item.quantity}</p>
                    <p className="text-gray-400 mb-1">Color: {item.selectedColor}</p>
                    <p className="font-medium text-[#DFBA67] mt-2">${(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-4 text-sm mt-8 border-t border-white/10 pt-8">
              
              <div className="mb-4">
                <p className="font-medium text-white mb-2">Discount Code</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code" 
                    className="frosted-glass-white-input rounded-lg p-3 flex-1 text-xs uppercase text-white placeholder-gray-400 focus:outline-none focus:border-archora-gold" 
                    disabled={!!appliedCoupon}
                  />
                  <button type="button" onClick={appliedCoupon ? () => {setAppliedCoupon(null); setCouponCode('')} : handleApplyCoupon} className="bg-archora-gold text-black px-4 text-xs tracking-widest uppercase hover:bg-[#E5C762] transition-colors font-semibold disabled:opacity-50 rounded-lg">
                    {appliedCoupon ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                {appliedCoupon && <p className="text-green-400 text-xs mt-1">Code applied successfully!</p>}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-4 border-t border-white/10 mt-2">
                <span className="text-white">Total</span>
                <span className="text-[#DFBA67] font-display text-2xl">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
