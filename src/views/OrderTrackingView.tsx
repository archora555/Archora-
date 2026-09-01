import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, Search, MapPin, Truck, CheckCircle } from 'lucide-react';
import { Order } from '../types';
import { useCurrency } from '../hooks/useCurrency';

export const OrderTrackingView = () => {
  const { orders } = useAppContext();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const order = orders.find(o => o.id === searchTerm.trim() || o.id === `ORD-${searchTerm.trim()}`);
    if (order) {
      setTrackedOrder(order);
    } else {
      setTrackedOrder(null);
      setError('Order not found. Please check your order number.');
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Processing': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto min-h-screen">
       <div className="frosted-glass-white-card rounded-2xl p-8 mb-8 text-center shadow-2xl">
         <h1 className="font-display text-4xl md:text-5xl mb-4 text-white">Track Your Order</h1>
         <p className="text-gray-400 max-w-md mx-auto">Enter your order number to see the current status and tracking details of your shipment.</p>
       
         <form onSubmit={handleTrack} className="max-w-md mx-auto flex gap-2 mt-8">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="e.g. ORD-1234..."
               className="w-full frosted-glass-white-input p-4 pl-12 text-sm text-white focus:outline-none focus:border-archora-gold transition-colors font-mono rounded-lg placeholder:text-gray-400"
               required
             />
           </div>
           <button type="submit" className="bg-archora-gold text-black px-8 uppercase tracking-widest text-xs font-bold hover:bg-[#E5C762] transition-colors rounded-lg cursor-pointer">
             Track
           </button>
         </form>

         {error && (
           <div className="bg-red-500/20 text-red-300 p-4 text-center text-sm border-l-4 border-red-500 max-w-md mx-auto mt-6 rounded-r-lg">
             {error}
           </div>
         )}
       </div>

       {trackedOrder && (
         <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
           <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
             <div>
               <h2 className="font-mono text-xl font-bold mb-1 text-white">{trackedOrder.id}</h2>
               <p className="text-sm text-gray-400">Ordered on {new Date(trackedOrder.date).toLocaleDateString()}</p>
             </div>
             <div className="text-right">
               <span className="inline-block bg-archora-gold/20 border border-archora-gold/40 text-archora-gold px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                 {trackedOrder.status}
               </span>
             </div>
           </div>

           {trackedOrder.status !== 'Cancelled' ? (
             <div className="relative mb-12 hidden md:block">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>
               <div 
                 className="absolute top-1/2 left-0 h-1 bg-archora-gold -translate-y-1/2 z-0 transition-all duration-1000"
                 style={{ width: `${(getStatusStep(trackedOrder.status) - 1) * 25}%` }}
               ></div>

               <div className="relative z-10 flex justify-between">
                 {[
                   { label: 'Pending', icon: Package },
                   { label: 'Confirmed', icon: CheckCircle },
                   { label: 'Processing', icon: Package },
                   { label: 'Shipped', icon: Truck },
                   { label: 'Delivered', icon: MapPin }
                 ].map((step, idx) => {
                   const stepNum = idx + 1;
                   const active = getStatusStep(trackedOrder.status) >= stepNum;
                   const Icon = step.icon;
                   return (
                     <div key={step.label} className="flex flex-col items-center">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${active ? 'bg-archora-gold text-black font-bold' : 'frosted-glass-white-subtle border-2 border-white/20 text-gray-400'}`}>
                         <Icon className="w-5 h-5" />
                       </div>
                       <span className={`text-xs uppercase tracking-wider font-semibold ${active ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
           ) : (
              <div className="bg-red-500/20 text-red-300 p-4 text-center text-sm border-l-4 border-red-500 mb-12 rounded-r-lg">
                This order has been cancelled.
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
             <div>
               <h3 className="font-display text-lg mb-4 text-white">Order Items</h3>
               <div className="space-y-4">
                 {trackedOrder.items.map((item, i) => (
                   <div key={i} className="flex gap-4 items-center frosted-glass-white-subtle border border-white/10 p-3 rounded-xl">
                     <img src={item.product.images[0] || undefined} alt={item.product.name} className="w-16 h-16 object-cover bg-white/5 rounded-lg border border-white/10" />
                     <div>
                       <p className="font-semibold text-sm text-white">{item.product.name}</p>
                       <p className="text-xs text-gray-400">Qty: {item.quantity} | {item.selectedColor}</p>
                      <p className="text-sm font-medium text-[#DFBA67] mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             <div>
               <h3 className="font-display text-lg mb-4 text-white">Shipping Details</h3>
               <div className="frosted-glass-white-subtle border border-white/10 rounded-xl p-6">
                 <p className="font-medium mb-1 text-white">{trackedOrder.customerInfo.name}</p>
                 <p className="text-sm text-gray-400 mb-4">{trackedOrder.customerInfo.email}</p>
                 <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                   {trackedOrder.customerInfo.address}
                 </p>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};
