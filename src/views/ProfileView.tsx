import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Package, Heart, LogOut, Crown, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';

export const ProfileView = () => {
  const { currentUser, setCurrentUser, orders, wishlist, setCurrentView } = useAppContext();
  const { formatPrice } = useCurrency();

  if (!currentUser) {
    return (
      <div className="pt-40 pb-16 min-h-screen max-w-7xl mx-auto px-6 text-center">
        <div className="frosted-glass-white-card rounded-2xl p-10 max-w-md mx-auto shadow-2xl">
          <h1 className="font-display text-4xl mb-4 text-white">Not Logged In</h1>
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.customerInfo.email === currentUser.email);

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const loyaltyPoints = Math.floor(totalSpent / 100);
  const GOLD_THRESHOLD = 150000;
  const progress = Math.min((totalSpent / GOLD_THRESHOLD) * 100, 100);
  const isGold = totalSpent >= GOLD_THRESHOLD;
  const amountToGold = Math.max(0, GOLD_THRESHOLD - totalSpent);

  return (
    <div className="pt-32 pb-16 min-h-screen max-w-7xl mx-auto px-4 md:px-6">
      <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
        <h1 className="font-display text-4xl md:text-5xl text-white">My Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-archora-gold/20 border border-archora-gold/30 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-archora-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-white">{currentUser.fullName}</h2>
                <p className="text-gray-400 text-sm">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="space-y-6 border-t border-white/10 pt-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                <p className="font-medium text-white">{currentUser.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Member Since</p>
                <p className="font-medium text-white">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Account Status</p>
                <p className="font-medium text-green-400">{currentUser.status || 'Active'}</p>
              </div>
            </div>
            
            <button 
              onClick={() => { 
                sessionStorage.removeItem('archora_customer_auth');
                localStorage.removeItem('archora_current_user');
                if (setCurrentUser) setCurrentUser(null);
                setCurrentView('home');
              }}
              className="mt-8 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats & Recent Orders */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Luxury Rewards Module */}
          <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-archora-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors ${isGold ? 'bg-archora-gold/20 border-archora-gold' : 'bg-white/5 border-white/20'}`}>
                  <Crown className={`w-8 h-8 ${isGold ? 'text-archora-gold' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="text-sm text-archora-gold uppercase tracking-widest font-semibold mb-1">Luxury Rewards</p>
                  <h2 className="font-display text-2xl md:text-3xl text-white">
                    {isGold ? 'Gold Member' : 'Silver Member'}
                  </h2>
                </div>
              </div>
              <div className="flex gap-8 text-left md:text-right w-full md:w-auto">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Loyalty Points</p>
                  <p className="font-display text-3xl text-archora-gold">{loyaltyPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Lifetime Spent</p>
                  <p className="font-display text-3xl text-white">{formatPrice(totalSpent)}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 relative z-10">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 font-medium">Status Progress</span>
                <span className={isGold ? 'text-archora-gold font-medium' : 'text-gray-400'}>
                  {isGold ? 'Goal Reached' : `${formatPrice(amountToGold)} to Gold`}
                </span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-[#CFA344]/50 to-[#CFA344] rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-white/50 blur-[2px]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8 relative z-10">
              <div className="flex flex-col items-center text-center p-4 rounded-xl frosted-glass-white-subtle border border-white/5">
                <CheckCircle2 className={`w-6 h-6 mb-3 ${isGold ? 'text-archora-gold' : 'text-gray-500'}`} />
                <h4 className={`text-sm font-semibold mb-1 ${isGold ? 'text-white' : 'text-gray-400'}`}>White-Glove Delivery</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Free premium delivery & assembly on all orders.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl frosted-glass-white-subtle border border-white/5">
                <CheckCircle2 className={`w-6 h-6 mb-3 ${isGold ? 'text-archora-gold' : 'text-gray-500'}`} />
                <h4 className={`text-sm font-semibold mb-1 ${isGold ? 'text-white' : 'text-gray-400'}`}>Exclusive Pre-Sales</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Early access to limited collections and private events.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl frosted-glass-white-subtle border border-white/5">
                <CheckCircle2 className={`w-6 h-6 mb-3 ${isGold ? 'text-archora-gold' : 'text-gray-500'}`} />
                <h4 className={`text-sm font-semibold mb-1 ${isGold ? 'text-white' : 'text-gray-400'}`}>Dedicated Concierge</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Priority 24/7 access to our interior design specialists.</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div 
              onClick={() => setCurrentView('tracking')}
              className="frosted-glass-white-card rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:border-archora-gold transition-colors shadow-2xl"
            >
              <div className="w-12 h-12 bg-archora-gold/10 border border-archora-gold/30 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-archora-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-display text-white">{userOrders.length}</h3>
                <p className="text-gray-400 text-sm">Total Orders</p>
              </div>
            </div>
            <div 
              onClick={() => setCurrentView('wishlist')}
              className="frosted-glass-white-card rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:border-archora-gold transition-colors shadow-2xl"
            >
              <div className="w-12 h-12 bg-archora-gold/10 border border-archora-gold/30 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-archora-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-display text-white">{wishlist.length}</h3>
                <p className="text-gray-400 text-sm">Wishlist Items</p>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="frosted-glass-white-card rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-2xl text-white">Recent Orders</h2>
              <button 
                onClick={() => setCurrentView('tracking')}
                className="text-archora-gold hover:text-white transition-colors text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            {userOrders.length === 0 ? (
              <div className="frosted-glass-white-subtle p-8 text-center border border-white/10 rounded-xl">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="frosted-glass-white-subtle rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
                    <div>
                      <p className="font-medium text-white mb-1">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-medium text-[#DFBA67]">{formatPrice(order.total)}</span>
                      <span className={`text-xs px-3 py-1 rounded-full border ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
