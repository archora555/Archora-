import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, ShoppingBag, TrendingUp, Users, Copy, Search, Plus, Trash2, Edit2, X, CheckCircle, Image, ImagePlus } from 'lucide-react';
import { Order, Product } from '../types';

export const AdminView = () => {
  const { orders, products, setProducts, isAdminLoggedIn, setIsAdminLoggedIn, setOrders } = useAppContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers' | 'content'>('dashboard');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Modals for CRUD
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Products
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pCategory, setPCategory] = useState('Best Seller');
  const [pImages, setPImages] = useState<string[]>(['']);
  const [pModelUrl, setPModelUrl] = useState('');
  const [pDimensions, setPDimensions] = useState('');
  const [pColors, setPColors] = useState<string[]>([]);
  const [pSizes, setPSizes] = useState<string[]>([]);
  const [pInStock, setPInStock] = useState(true);
  const [pStockCount, setPStockCount] = useState(1);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  // Customers data extracted from orders
  const customers = Array.from(new Set(orders.map(o => o.customerInfo.email))).map(email => {
    const custOrders = orders.filter(o => o.customerInfo.email === email);
    return {
      name: custOrders[0]?.customerInfo.name || 'Unknown',
      email,
      totalSpent: custOrders.reduce((a, o) => a + o.total, 0),
      orderCount: custOrders.length
    };
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPDesc('');
    setPPrice(0);
    setPCategory('New Arrivals');
    setPImages(['', '']);
    setPModelUrl('');
    setPDimensions('');
    setPColors(['#FFFFFF', '#111111']);
    setPSizes(['Standard']);
    setPInStock(true);
    setPStockCount(10);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPDesc(prod.description);
    setPPrice(prod.price);
    setPCategory(prod.category);
    setPImages([...prod.images]);
    setPModelUrl(prod.modelUrl || '');
    setPDimensions(prod.dimensions || '');
    setPColors([...prod.colors]);
    setPSizes(prod.sizes || []);
    setPInStock(prod.inStock);
    setPStockCount(prod.stockCount);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `p_${Date.now()}`,
      name: pName,
      description: pDesc,
      price: Number(pPrice),
      category: pCategory,
      images: pImages.filter(img => img.trim() !== ''),
      modelUrl: pModelUrl,
      dimensions: pDimensions,
      colors: pColors.filter(c => c.trim() !== ''),
      sizes: pSizes.filter(s => s.trim() !== ''),
      inStock: pInStock,
      stockCount: Number(pStockCount),
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviews: editingProduct ? editingProduct.reviews : 0
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
        <div className="bg-white p-8 md:p-12 border border-gray-200 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">ARCHORA</h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Admin Access Portal</p>
          </div>
          {loginError && <p className="text-red-600 text-sm mb-4 text-center">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Username</label>
              <input 
                type="text" 
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-archora-black outline-none transition-colors"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
              <input 
                type="password" 
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-archora-black outline-none transition-colors"
                placeholder="admin123"
                required
              />
            </div>
            <button type="submit" className="w-full bg-archora-black text-white hover:bg-archora-gold transition-colors py-4 text-xs uppercase tracking-widest font-semibold flex justify-center items-center gap-2">
              Authenticate
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Hint: admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="bg-white p-6 border border-gray-100 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{title}</p>
        <p className="font-display text-3xl font-medium">{value}</p>
      </div>
      <div className="w-12 h-12 bg-archora-gray flex items-center justify-center rounded-full text-archora-gold">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
    </div>
  );

  return (
    <div className="w-full pt-32 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto min-h-screen bg-gray-50/30">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="font-display text-4xl mb-2">Command Center</h1>
          <p className="text-gray-500 tracking-wide">Manage your luxury boutique operations directly connected to the live catalog.</p>
        </div>
        <button 
          onClick={() => setIsAdminLoggedIn(false)}
          className="text-xs font-semibold uppercase tracking-widest hover:text-archora-gold transition-colors self-start md:self-auto"
        >
          Secure Logout
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 border-b border-gray-200 mb-8 pb-1 scrollbar-hide">
        {['dashboard', 'products', 'orders', 'customers', 'content'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 px-4 uppercase tracking-widest text-xs font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-archora-gold text-archora-black bg-archora-gold/5' : 'border-transparent text-gray-400 hover:text-archora-black'}`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={TrendingUp} />
            <StatCard title="Orders" value={orders.length} icon={ShoppingBag} />
            <StatCard title="Total Customers" value={customers.length} icon={Users} />
            <StatCard title="Catalog Size" value={products.length} icon={Package} />
          </div>
          
          <div className="bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="font-display text-xl mb-6">Recent Activity</h3>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-sm">Order #{order.id} by {order.customerInfo.name}</p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString()} • {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${order.total.toLocaleString()}</p>
                      <span className="text-[10px] uppercase tracking-widest bg-gray-100 px-2 py-0.5 mt-1 inline-block">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent activity found.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start md:items-center gap-4 bg-archora-gray/30">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search product catalog..." className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:border-archora-gold focus:outline-none bg-white rounded-sm" />
            </div>
            <button 
              onClick={openAddProduct}
              className="bg-archora-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center rounded-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-full lg:min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500 bg-archora-gray/50">
                  <th className="p-4 font-medium pl-4 md:pl-6">Product Item</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Category</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Price</th>
                  <th className="p-4 font-medium hidden md:table-cell">Stock Level</th>
                  <th className="p-4 font-medium text-right pr-4 md:pr-6 hidden sm:table-cell">Management</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-4 md:pl-6 flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden relative group">
                        {product.images[0] ? (
                           <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                           <Image className="w-5 h-5 md:w-6 md:h-6 m-3.5 md:m-4 text-gray-300" />
                        )}
                        {product.modelUrl && <span className="absolute bottom-0 right-0 bg-archora-gold w-2 h-2 md:w-3 md:h-3 block" title="Has AR Model"></span>}
                      </div>
                      <div>
                        <span className="font-display font-medium text-sm md:text-base block">{product.name}</span>
                        <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest block mb-1">{product.id.substring(0,8)}</span>
                        
                        {/* Mobile Actions and Details */}
                        <div className="sm:hidden flex flex-wrap gap-x-3 gap-y-1 mt-1">
                          <span className="text-xs font-bold w-full">${product.price.toLocaleString()}</span>
                          <button onClick={() => openEditProduct(product)} className="text-xs text-archora-gold font-bold uppercase tracking-wider">Edit</button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-xs text-red-500 font-bold uppercase tracking-wider">Remove</button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm hidden lg:table-cell">{product.category}</td>
                    <td className="p-4 font-medium hidden sm:table-cell">${product.price.toLocaleString()}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.inStock && product.stockCount > 5 ? 'bg-green-500' : product.inStock ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm">{product.stockCount} units</span>
                      </div>
                    </td>
                    <td className="p-4 pr-4 md:pr-6 text-right space-x-3 hidden sm:table-cell">
                      <button onClick={() => openEditProduct(product)} className="text-gray-500 hover:text-archora-gold transition-colors inline-block p-1" title="Edit">
                        <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-500 hover:text-red-500 transition-colors inline-block p-1" title="Delete">
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found in the catalog.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-archora-gray/50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                <th className="p-4 font-medium pl-6">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-sm">{order.id}</td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm">
                      <p className="font-medium">{order.customerInfo.name}</p>
                      <p className="text-xs text-gray-500">{order.customerInfo.email}</p>
                    </td>
                    <td className="p-4 font-medium">${order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => {
                           setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: e.target.value as any} : o));
                        }}
                        className="bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold border border-gray-200 outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button className="text-archora-gold hover:text-archora-black text-xs font-bold uppercase tracking-wider transition-colors">Manage</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No orders placed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-archora-gray/50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                <th className="p-4 font-medium pl-6">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                 customers.map((c, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-sm">{c.name}</td>
                      <td className="p-4 text-gray-500 text-sm">{c.email}</td>
                      <td className="p-4 font-medium">${c.totalSpent.toLocaleString()}</td>
                      <td className="p-4 text-sm">{c.orderCount}</td>
                    </tr>
                 ))
              ) : (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
           <h2 className="font-display text-2xl mb-6 flex items-center gap-3"><Image className="text-archora-gold"/> Homepage Media Manager</h2>
           <div className="border border-dashed border-gray-300 p-12 text-center rounded bg-gray-50">
              <ImagePlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Drag and drop new hero banners here</p>
              <button className="text-xs uppercase tracking-widest font-semibold text-archora-gold hover:text-archora-black transition-colors">Select Files</button>
           </div>
        </div>
      )}

      {/* Product Management Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="font-display text-2xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveProduct} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Primary Details</h3>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Product Name *</label>
                    <input type="text" value={pName} onChange={e=>setPName(e.target.value)} required className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Price ($) *</label>
                      <input type="number" value={pPrice} onChange={e=>setPPrice(Number(e.target.value))} required className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" min="0" step="0.01" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Category *</label>
                      <select value={pCategory} onChange={e=>setPCategory(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none">
                        <option value="New Arrivals">New Arrivals</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Sale">Sale</option>
                        <option value="Office Use Pro">Office Use Pro</option>
                        <option value="Decor">Decor</option>
                        <option value="Dining">Dining</option>
                        <option value="Living">Living</option>
                        <option value="Bedroom">Bedroom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Description *</label>
                    <textarea value={pDesc} onChange={e=>setPDesc(e.target.value)} required rows={4} className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Dimensions</label>
                    <input type="text" value={pDimensions} onChange={e=>setPDimensions(e.target.value)} placeholder="e.g. 88W x 38D x 34H" className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1 flex items-center gap-2">
                        <input type="checkbox" checked={pInStock} onChange={e=>setPInStock(e.target.checked)} className="rounded-none accent-archora-black" />
                        In Stock
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Stock Count</label>
                      <input type="number" value={pStockCount} onChange={e=>setPStockCount(Number(e.target.value))} required className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" min="0" />
                    </div>
                  </div>
                </div>

                {/* Right Column: Media & Variants */}
                <div className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Media & Variants</h3>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Product Images</label>
                    <p className="text-[10px] text-gray-500 mb-2">Upload directly from device or enter URLs below</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                         const files = Array.from(e.target.files || []);
                         Promise.all(files.map(file => {
                             return new Promise<string>((resolve) => {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                     const img = new window.Image();
                                     img.onload = () => {
                                         const canvas = document.createElement('canvas');
                                         let width = img.width;
                                         let height = img.height;
                                         const max_size = 800;
                                         
                                         if (width > height) {
                                             if (width > max_size) {
                                                 height *= max_size / width;
                                                 width = max_size;
                                             }
                                         } else {
                                             if (height > max_size) {
                                                 width *= max_size / height;
                                                 height = max_size;
                                             }
                                         }
                                         
                                         canvas.width = width;
                                         canvas.height = height;
                                         const ctx = canvas.getContext('2d');
                                         ctx?.drawImage(img, 0, 0, width, height);
                                         resolve(canvas.toDataURL('image/jpeg', 0.7));
                                     };
                                     img.src = reader.result as string;
                                 };
                                 reader.readAsDataURL(file);
                             });
                         })).then(base64Images => {
                             setPImages(prev => {
                                const currentUrls = prev.filter(img => img.trim() !== '');
                                return [...base64Images, ...currentUrls];
                             });
                         });
                         e.target.value = '';
                      }}
                      className="w-full text-sm mb-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                    />
                    <textarea 
                      value={pImages.map(img => img.startsWith('data:image') ? '[Uploaded Image]' : img).join(',\n')} 
                      onChange={e => {
                         const lines = e.target.value.split(',');
                         let base64Index = 0;
                         const base64s = pImages.filter(img => img.startsWith('data:image'));
                         const newUrls = lines.map(s => {
                            const trimmed = s.trim();
                            if (trimmed === '[Uploaded Image]') {
                               const b64 = base64s[base64Index++];
                               return b64 || '';
                            }
                            return trimmed;
                         });
                         setPImages(newUrls);
                      }} 
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none font-mono text-xs" 
                      rows={3} 
                      placeholder="https://image1.jpg, https://image2.jpg"
                    />
                    {pImages.length > 0 && pImages[0] !== "" && (
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2 items-center">
                        {pImages.filter(img => img.trim() !== '').map((img, i, arr) => (
                           <div key={i} className="relative w-20 h-20 flex-shrink-0 border border-gray-200 group">
                             <img src={img} alt="" className="w-full h-full object-cover" />
                             <button type="button" onClick={() => setPImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center shadow">×</button>
                             
                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                {i > 0 && (
                                  <button type="button" onClick={() => setPImages(prev => {
                                    const newArr = prev.filter(p => p.trim() !== '');
                                    const temp = newArr[i];
                                    newArr[i] = newArr[i-1];
                                    newArr[i-1] = temp;
                                    return newArr;
                                  })} className="bg-white border border-gray-300 rounded shadow text-gray-700 w-5 h-5 flex items-center justify-center font-bold text-xs">←</button>
                                )}
                                {i < arr.length - 1 && (
                                  <button type="button" onClick={() => setPImages(prev => {
                                    const newArr = prev.filter(p => p.trim() !== '');
                                    const temp = newArr[i];
                                    newArr[i] = newArr[i+1];
                                    newArr[i+1] = temp;
                                    return newArr;
                                  })} className="bg-white border border-gray-300 rounded shadow text-gray-700 w-5 h-5 flex items-center justify-center font-bold text-xs">→</button>
                                )}
                             </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">AR Model URL (.glb file) - Optional</label>
                    <input type="url" value={pModelUrl} onChange={e=>setPModelUrl(e.target.value)} placeholder="https://..." className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Color Variants (HEX codes, comma separated)</label>
                    <input type="text" value={pColors.join(', ')} onChange={e=>setPColors(e.target.value.split(',').map(s=>s.trim()))} placeholder="#FFFFFF, #000000" className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none font-mono" />
                    {pColors.length > 0 && pColors[0] !== "" && (
                      <div className="flex gap-2 mt-2">
                        {pColors.map((c, i) => (
                           <div key={i} className="w-6 h-6 border border-gray-300 rounded-full" style={{backgroundColor: c}}></div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Size Variants (comma separated)</label>
                    <input type="text" value={pSizes.join(', ')} onChange={e=>setPSizes(e.target.value.split(',').map(s=>s.trim()))} placeholder="Standard, Large, King" className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" />
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50 -mx-6 px-6 pb-2">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-archora-black transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-3 bg-archora-black text-white hover:bg-archora-gold transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm shadow-md">
                  <CheckCircle className="w-4 h-4" /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
