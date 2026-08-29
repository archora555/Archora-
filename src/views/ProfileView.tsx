import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Package, Heart, LogOut } from 'lucide-react';

export const ProfileView = () => {
  const { currentUser, setCurrentUser, orders, wishlist, setCurrentView } = useAppContext();

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
                      <span className="font-medium text-[#DFBA67]">${order.total.toLocaleString()}</span>
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
