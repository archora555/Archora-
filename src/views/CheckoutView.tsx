import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Coupon } from '../types';
import { ArchoraLogo } from '../components/ArchoraLogo';
import { useCurrency } from '../hooks/useCurrency';

export const CheckoutView = () => {
  const { cart, clearCart, addOrder, setCurrentView, appliedCoupon, setAppliedCoupon, logoConfig } = useAppContext();
  const { formatPrice } = useCurrency();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'bKash'
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
  
  // Shipping charge based on city (Inside Dhaka: 60, Outside: 120)
  const isDhaka = formData.city.trim().toLowerCase() === 'dhaka';
  const shipping = formData.city ? (isDhaka ? 60 : 120) : 0;
  
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
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, Bangladesh ${formData.zip}`,
        paymentMethod: formData.paymentMethod
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
            {logoConfig.type === 'text' && logoConfig.text && logoConfig.text !== 'ARCHORA' ? (
              <span className="font-display text-2xl tracking-[0.1em] text-[#D4AF37]">{logoConfig.text}</span>
            ) : logoConfig.imageUrl && logoConfig.imageUrl !== '/logo.svg' && logoConfig.imageUrl !== '/1788428927791.png' ? (
              <img src={logoConfig.imageUrl} alt="ARCHORA" className="h-14 w-auto object-contain max-w-full" />
            ) : (
              <ArchoraLogo height={36} className="h-14 w-auto object-contain max-w-full" />
            )}
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
        <h1 className="font-display text-4xl md:text-5xl text-archora-gold">Checkout</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-8">
          
          <section className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-2xl mb-6 text-white">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="email" name="email" placeholder="Email Address" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="tel" name="phone" placeholder="Mobile Number" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
            </div>
          </section>

          <section className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-2xl mb-6 text-white">Delivery Address (Bangladesh)</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="address" placeholder="Address" onChange={handleChange} className="col-span-2 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="city" placeholder="City (e.g. Dhaka)" onChange={handleChange} className="col-span-2 sm:col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
              <input required type="text" name="zip" placeholder="Postal Code" onChange={handleChange} className="col-span-2 sm:col-span-1 frosted-glass-white-input rounded-lg p-4 text-white placeholder:text-gray-400 focus:border-archora-gold focus:outline-none" />
            </div>
          </section>

          <section className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="font-display text-2xl mb-6 text-white">Payment Method</h2>
            <div className="flex flex-col gap-4 p-6 border border-white/15 rounded-xl frosted-glass-white-subtle">
              <label className="flex items-center gap-3 text-white cursor-pointer group">
                <input type="radio" name="paymentMethod" value="bKash" onChange={handleChange} checked={formData.paymentMethod === 'bKash'} className="accent-archora-gold w-5 h-5 cursor-pointer" />
                <span className="font-medium group-hover:text-archora-gold transition-colors">bKash</span>
              </label>
              <label className="flex items-center gap-3 text-white cursor-pointer group">
                <input type="radio" name="paymentMethod" value="Nagad" onChange={handleChange} checked={formData.paymentMethod === 'Nagad'} className="accent-archora-gold w-5 h-5 cursor-pointer" />
                <span className="font-medium group-hover:text-archora-gold transition-colors">Nagad</span>
              </label>
              <label className="flex items-center gap-3 text-white cursor-pointer group">
                <input type="radio" name="paymentMethod" value="Other Online Payment" onChange={handleChange} checked={formData.paymentMethod === 'Other Online Payment'} className="accent-archora-gold w-5 h-5 cursor-pointer" />
                <span className="font-medium group-hover:text-archora-gold transition-colors">Other Local Online Payment</span>
              </label>
            </div>
          </section>

          <button 
            type="submit"
            className="w-full bg-archora-gold text-black font-semibold px-8 py-5 text-sm tracking-widest uppercase hover:bg-[#E5C762] transition-colors rounded-xl shadow-lg cursor-pointer"
          >
            Place Order • {formatPrice(total)}
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
                    <p className="font-medium text-[#DFBA67] mt-2">{formatPrice(item.product.price * item.quantity)}</p>
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
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-4 border-t border-white/10 mt-2">
                <span className="text-white">Total</span>
                <span className="text-[#DFBA67] font-display text-2xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
