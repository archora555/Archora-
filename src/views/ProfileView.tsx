import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Package, Heart, LogOut } from 'lucide-react';

export const ProfileView = () => {
  const { currentUser, setCurrentUser, orders, wishlist, setCurrentView } = useAppContext();

  if (!currentUser) {
    return (
      <div className="pt-32 pb-16 min-h-screen max-w-7xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl mb-4">Not Logged In</h1>
        <p className="text-archora-black/70">Please log in to view your profile.</p>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.customerInfo.email === currentUser.email);

  return (
    <div className="pt-32 pb-16 min-h-screen max-w-7xl mx-auto px-6">
      <h1 className="font-display text-4xl mb-12">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-archora-cream p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-archora-gold/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-archora-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl">{currentUser.fullName}</h2>
                <p className="text-archora-black/70 text-sm">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-archora-black/50 mb-1">Phone Number</p>
                <p className="font-medium">{currentUser.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-archora-black/50 mb-1">Member Since</p>
                <p className="font-medium">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-archora-black/50 mb-1">Account Status</p>
                <p className="font-medium text-green-600">{currentUser.status || 'Active'}</p>
              </div>
            </div>
            
            <button 
              onClick={() => { 
                sessionStorage.removeItem('archora_customer_auth');
                localStorage.removeItem('archora_current_user');
                if (setCurrentUser) setCurrentUser(null);
                setCurrentView('home');
              }}
              className="mt-12 flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats & Recent Orders */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div 
              onClick={() => setCurrentView('tracking')}
              className="bg-white border border-gray-100 p-6 flex items-center gap-4 cursor-pointer hover:border-archora-gold transition-colors"
            >
              <div className="w-12 h-12 bg-archora-gold/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-archora-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-display">{userOrders.length}</h3>
                <p className="text-archora-black/70 text-sm">Total Orders</p>
              </div>
            </div>
            <div 
              onClick={() => setCurrentView('wishlist')}
              className="bg-white border border-gray-100 p-6 flex items-center gap-4 cursor-pointer hover:border-archora-gold transition-colors"
            >
              <div className="w-12 h-12 bg-archora-gold/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-archora-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-display">{wishlist.length}</h3>
                <p className="text-archora-black/70 text-sm">Wishlist Items</p>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-2xl">Recent Orders</h2>
              <button 
                onClick={() => setCurrentView('tracking')}
                className="text-archora-gold hover:text-black transition-colors text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            {userOrders.length === 0 ? (
              <div className="bg-gray-50 p-8 text-center border border-gray-100">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-archora-black/70">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium mb-1">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-archora-black/70">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-medium">${order.total.toLocaleString()}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
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
