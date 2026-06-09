import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const CheckoutView = () => {
  const { cart, clearCart, addOrder, setCurrentView } = useAppContext();
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

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

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
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <CheckCircle2 className="w-24 h-24 text-archora-gold mb-8 mx-auto" />
        </motion.div>
        <h1 className="font-display text-5xl mb-6">Order Confirmed</h1>
        <p className="text-gray-600 mb-12 text-lg">Thank you for your purchase. Your exquisite pieces are being prepared for delivery. A confirmation email has been sent to {formData.email}.</p>
        <button 
          onClick={() => setCurrentView('home')}
          className="bg-archora-black text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-archora-gold transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    setCurrentView('cart');
    return null;
  }

  return (
    <div className="w-full pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="font-display text-5xl mb-12">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-12">
          
          <section>
            <h2 className="font-display text-2xl mb-6">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="col-span-1 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none placeholder:text-gray-400" />
              <input required type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="col-span-1 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none placeholder:text-gray-400" />
              <input required type="email" name="email" placeholder="Email Address" onChange={handleChange} className="col-span-2 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none placeholder:text-gray-400" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-6">Delivery Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" name="address" placeholder="Address" onChange={handleChange} className="col-span-2 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none placeholder:text-gray-400" />
              <input required type="text" name="city" placeholder="City" onChange={handleChange} className="col-span-2 sm:col-span-1 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none placeholder:text-gray-400" />
              <input required type="text" name="zip" placeholder="Postal Code" onChange={handleChange} className="col-span-2 sm:col-span-1 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none placeholder:text-gray-400" />
              <select required name="country" onChange={handleChange} className="col-span-2 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none bg-white text-archora-black">
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>France</option>
              </select>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-6">Payment Method</h2>
            <div className="grid grid-cols-4 gap-4 p-6 border border-gray-200 bg-gray-50/50">
              <input required type="text" name="cardNumber" placeholder="Card Number" onChange={handleChange} className="col-span-4 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none bg-white placeholder:text-gray-400" />
              <input required type="text" name="exp" placeholder="MM/YY" onChange={handleChange} className="col-span-2 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none bg-white placeholder:text-gray-400" />
              <input required type="text" name="cvc" placeholder="CVC" onChange={handleChange} className="col-span-2 border border-gray-300 p-4 focus:border-archora-gold focus:outline-none bg-white placeholder:text-gray-400" />
            </div>
          </section>

          <button 
            type="submit"
            className="w-full bg-archora-black text-white px-8 py-5 text-sm tracking-widest uppercase hover:bg-archora-gold transition-colors font-medium"
          >
            Place Order • ${total.toLocaleString()}
          </button>
        </form>

        <div className="w-full lg:w-1/3">
          <div className="bg-archora-gray p-8 sticky top-32">
            <h3 className="font-display text-2xl mb-6">Your Order</h3>
            <div className="flex flex-col gap-6 mb-8 border-b border-gray-200 pb-8">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-24 bg-white shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-archora-black mb-1">{item.product.name}</p>
                    <p className="text-gray-500 mb-1">Qty: {item.quantity}</p>
                    <p className="mb-1">Color: {item.selectedColor}</p>
                    <p className="font-medium mt-2">${(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-4 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
