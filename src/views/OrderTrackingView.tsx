import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, Search, MapPin, Truck, CheckCircle } from 'lucide-react';
import { Order } from '../types';

export const OrderTrackingView = () => {
  const { orders } = useAppContext();
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
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
       <div className="text-center mb-12">
         <h1 className="font-display text-4xl mb-4">Track Your Order</h1>
         <p className="text-gray-500 max-w-md mx-auto">Enter your order number to see the current status and tracking details of your shipment.</p>
       </div>

       <form onSubmit={handleTrack} className="max-w-md mx-auto flex gap-2 mb-12">
         <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
           <input 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             placeholder="e.g. ORD-1234..."
             className="w-full border border-gray-200 p-4 pl-12 text-sm focus:outline-none focus:border-archora-gold transition-colors font-mono"
             required
           />
         </div>
         <button type="submit" className="bg-archora-black text-white px-8 uppercase tracking-widest text-xs font-bold hover:bg-archora-gold transition-colors">
           Track
         </button>
       </form>

       {error && (
         <div className="bg-red-50 text-red-600 p-4 text-center text-sm border-l-4 border-red-500 max-w-md mx-auto mb-12">
           {error}
         </div>
       )}

       {trackedOrder && (
         <div className="bg-white border border-gray-100 p-8 shadow-sm">
           <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
             <div>
               <h2 className="font-mono text-xl font-bold mb-1">{trackedOrder.id}</h2>
               <p className="text-sm text-gray-500">Ordered on {new Date(trackedOrder.date).toLocaleDateString()}</p>
             </div>
             <div className="text-right">
               <span className="inline-block bg-archora-gold/10 text-archora-gold px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                 {trackedOrder.status}
               </span>
             </div>
           </div>

           {trackedOrder.status !== 'Cancelled' ? (
             <div className="relative mb-12 hidden md:block">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
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
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${active ? 'bg-archora-gold text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                         <Icon className="w-5 h-5" />
                       </div>
                       <span className={`text-xs uppercase tracking-wider font-semibold ${active ? 'text-archora-black' : 'text-gray-400'}`}>{step.label}</span>
                     </div>
                   );
                 })}
               </div>
             </div>
           ) : (
              <div className="bg-red-50 text-red-600 p-4 text-center text-sm border-l-4 border-red-500 mb-12">
                This order has been cancelled.
              </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div>
               <h3 className="font-display text-lg mb-4">Order Items</h3>
               <div className="space-y-4">
                 {trackedOrder.items.map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <img src={item.product.images[0] || undefined} alt={item.product.name} className="w-16 h-16 object-cover bg-gray-50" />
                     <div>
                       <p className="font-semibold text-sm">{item.product.name}</p>
                       <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.selectedColor}</p>
                       <p className="text-sm font-medium mt-1">${(item.product.price * item.quantity).toLocaleString()}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             <div>
               <h3 className="font-display text-lg mb-4">Shipping Details</h3>
               <div className="bg-gray-50 p-6">
                 <p className="font-medium mb-1">{trackedOrder.customerInfo.name}</p>
                 <p className="text-sm text-gray-600 mb-4">{trackedOrder.customerInfo.email}</p>
                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
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
