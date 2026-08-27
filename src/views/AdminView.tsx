import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useBuilder } from '../builder/BuilderContext';
import { Package, ShoppingBag, TrendingUp, Users, Copy, Search, Plus, Trash2, Edit2, X, CheckCircle, Image, ImagePlus } from 'lucide-react';
import { Order, Product, QuoteRequest, Coupon } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

const compressImage = (file: File, maxSize: number = 1000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const AdminView = () => {
    const { isVisualEditMode, setIsVisualEditMode } = useAppContext();
  const { setIsEditMode } = useBuilder();
  const { orders, products, setProducts, setOrders, heroBanners, setHeroBanners, subCategories, setSubCategories, homeSections, setHomeSections, logoConfig, setLogoConfig, menuItems, setMenuItems, isAdminLoggedIn, setIsAdminLoggedIn, saveSettingsToFirebase, layoutConfig, setLayoutConfig} = useAppContext();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  const pathParts = location.pathname.split('/');
  const currentTab = pathParts.length > 2 && pathParts[2] ? pathParts[2] : 'dashboard';
  const validTabs = ['dashboard', 'orders', 'products', 'customers', 'banners', 'categories', 'product-rows', 'inquiries', 'coupons', 'settings', 'layout'];
  const activeTab = validTabs.includes(currentTab) ? currentTab : 'dashboard';

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/archora-admin-portal');
    } else {
      setIsAuthChecking(false);
    }
  }, [isAdminLoggedIn, navigate]);

  // Modals for CRUD
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Products
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pCategory, setPCategory] = useState('Best Seller');
  const [pSubCategory, setPSubCategory] = useState('');
  const [pMaterials, setPMaterials] = useState('');
  const [pImages, setPImages] = useState<string[]>(['']);
  const [pModelUrl, setPModelUrl] = useState('');
  const [pDimensions, setPDimensions] = useState('');
  const [pColors, setPColors] = useState<string[]>([]);
  const [pSizes, setPSizes] = useState<string[]>([]);
  const [pInStock, setPInStock] = useState(true);
  const [pStockCount, setPStockCount] = useState(1);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  // Customers data extracted from mock_users combined with orders
  const customers = (() => {
    try {
      const storedStr = localStorage.getItem('mock_users') || '[]';
      const storedUsers = JSON.parse(storedStr);
      return storedUsers.map((u: any) => {
        const custOrders = orders.filter(o => o.customerInfo.email === u.email);
        return {
          id: u.id || u.email,
          name: u.fullName || u.username,
          email: u.email,
          phone: u.phone || 'N/A',
          totalSpent: custOrders.reduce((a, o) => a + o.total, 0),
          orderCount: custOrders.length,
          status: u.status || 'Active',
          createdAt: u.createdAt || Date.now()
        };
      }).sort((a: any, b: any) => b.createdAt - a.createdAt);
    } catch {
      return [];
    }
  })();

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setPublishSuccess(false);
    await saveSettingsToFirebase();
    setIsSavingConfig(false);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPDesc('');
    setPPrice(0);
    setPCategory('New Arrivals');
    setPSubCategory('');
    setPMaterials('');
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
    setPSubCategory(prod.subCategory || '');
    setPMaterials(prod.materials || '');
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
      subCategory: pSubCategory,
      materials: pMaterials,
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

  if (isAuthChecking) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
        <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Verifying secure connection...</p>
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
          onClick={handleLogout}
          className="text-xs font-semibold uppercase tracking-widest hover:text-archora-gold transition-colors self-start md:self-auto"
        >
          Secure Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8 pb-1">
        {['dashboard', 'layout', 'products', 'orders', 'customers', 'banners', 'categories', 'product-rows', 'inquiries', 'coupons', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => navigate(`/admin/${tab === 'dashboard' ? '' : tab}`)}
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
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-archora-gray/50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                <th className="p-4 font-medium pl-6">Name</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Date Registered</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                 customers.map((c, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-sm">{c.name}</td>
                      <td className="p-4 text-sm">
                        <div className="text-gray-900">{c.email}</div>
                        <div className="text-gray-500 text-xs mt-1">{c.phone}</div>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 font-medium">${c.totalSpent.toLocaleString()}</td>
                      <td className="p-4 text-sm">{c.orderCount}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(c.email);
                            alert(`Copied ${c.email} to clipboard!`);
                          }}
                          className="flex items-center gap-2 text-xs font-semibold text-archora-gold hover:text-archora-black transition-colors"
                          title="Copy Email"
                        >
                          <Copy className="w-4 h-4" /> Copy Email
                        </button>
                      </td>
                    </tr>
                 ))
              ) : (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-8">
          <div className="flex justify-end p-4 bg-white border border-gray-100 shadow-sm sticky top-[100px] z-20">
            <button 
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="bg-archora-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> {isSavingConfig ? 'Saving...' : publishSuccess ? 'Saved!' : 'Publish Content Changes'}
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-3"><Image className="text-archora-gold w-6 h-6"/> Homepage Hero Banners</h2>
            <div className="space-y-4">
              {heroBanners.map((banner, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 border border-gray-200">
                  <img src={banner.image || undefined} className="w-24 h-16 object-cover border border-gray-300" alt="Banner" />
                  <div className="flex-1 space-y-2">
                     <input 
                       type="text" 
                       value={banner.title} 
                       onChange={e => {
                         const nb = [...heroBanners];
                         nb[i] = { ...nb[i], title: e.target.value };
                         setHeroBanners(nb);
                       }}
                       placeholder="Banner Title" 
                       className="w-full text-sm border p-2" 
                     />
                     <input 
                       type="file" 
                       accept="image/*"
                       onChange={async e => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const compressed = await compressImage(file);
                           const nb = [...heroBanners];
                           nb[i] = { ...nb[i], image: compressed };
                           setHeroBanners(nb);
                         }
                       }}
                       className="w-full text-xs border p-2 bg-white" 
                     />
                  </div>
                  <button onClick={() => setHeroBanners(heroBanners.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setHeroBanners([...heroBanners, { id: Date.now(), image: '', title: 'New Banner' }])}
                className="text-xs uppercase tracking-widest font-semibold p-4 border border-dashed border-gray-300 w-full hover:bg-gray-50 text-gray-600">
                + Add Hero Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="flex justify-end p-4 bg-white border border-gray-100 shadow-sm sticky top-[100px] z-20">
            <button 
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="bg-archora-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> {isSavingConfig ? 'Saving...' : publishSuccess ? 'Saved!' : 'Publish Content Changes'}
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-3"><Plus className="text-archora-gold w-6 h-6"/> Homepage Sub-Categories</h2>
            <p className="text-xs text-gray-500 mb-4">Icon names must match Lucide-React icon names (e.g., 'Sofa', 'BedDouble', 'Lamp')</p>
            <div className="space-y-4">
              {subCategories.map((cat, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 border border-gray-200">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <input 
                       type="text" 
                       value={cat.name} 
                       onChange={e => {
                         const n = [...subCategories];
                         n[i] = { ...n[i], name: e.target.value };
                         setSubCategories(n);
                       }}
                       placeholder="Category Name" 
                       className="w-full text-sm border p-2" 
                     />
                     <input 
                       type="text" 
                       value={cat.iconName} 
                       onChange={e => {
                         const n = [...subCategories];
                         n[i] = { ...n[i], iconName: e.target.value };
                         setSubCategories(n);
                       }}
                       placeholder="Icon Name (e.g. Sofa)" 
                       className="w-full text-sm border p-2" 
                     />
                     <div className="flex flex-col gap-2">
                       {cat.image && <img src={cat.image} className="h-10 w-10 object-cover border border-gray-300" alt="Preview" />}
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={async e => {
                           const file = e.target.files?.[0];
                           if (file) {
                             const compressed = await compressImage(file);
                             const n = [...subCategories];
                             n[i] = { ...n[i], image: compressed };
                             setSubCategories(n);
                           }
                         }}
                         className="w-full text-xs border p-2 bg-white" 
                       />
                     </div>
                  </div>
                  <button onClick={() => setSubCategories(subCategories.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setSubCategories([...subCategories, { id: `cat_${Date.now()}`, name: 'New Cat', iconName: 'HelpCircle' }])}
                className="text-xs uppercase tracking-widest font-semibold p-4 border border-dashed border-gray-300 w-full hover:bg-gray-50 text-gray-600">
                + Add Sub-Category
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'product-rows' && (
        <div className="space-y-8">
          <div className="flex justify-end p-4 bg-white border border-gray-100 shadow-sm sticky top-[100px] z-20">
            <button 
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="bg-archora-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> {isSavingConfig ? 'Saving...' : publishSuccess ? 'Saved!' : 'Publish Content Changes'}
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-3"><Plus className="text-archora-gold w-6 h-6"/> Homepage Row Names</h2>
            <div className="space-y-4">
              {homeSections.map((sec, i) => (
                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 border border-gray-200">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                     <input 
                       type="text" 
                       value={sec.title} 
                       onChange={e => {
                         const n = [...homeSections];
                         n[i] = { ...n[i], title: e.target.value };
                         setHomeSections(n);
                       }}
                       placeholder="Section Title" 
                       className="w-full text-sm border p-2" 
                     />
                     <input 
                       type="text" 
                       value={sec.filter} 
                       onChange={e => {
                         const n = [...homeSections];
                         n[i] = { ...n[i], filter: e.target.value };
                         setHomeSections(n);
                       }}
                       placeholder="Filter by Category" 
                       className="w-full text-sm border p-2" 
                     />
                  </div>
                  <button onClick={() => setHomeSections(homeSections.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setHomeSections([...homeSections, { title: 'New Row', filter: '' }])}
                className="text-xs uppercase tracking-widest font-semibold p-4 border border-dashed border-gray-300 w-full hover:bg-gray-50 text-gray-600">
                + Add Row
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <QuotesAdminTab />
      )}

      {activeTab === 'coupons' && (
        <CouponsAdminTab />
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="flex justify-end p-4 bg-white border border-gray-100 shadow-sm sticky top-[100px] z-20">
            <button 
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="bg-archora-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2 rounded-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> {isSavingConfig ? 'Saving...' : publishSuccess ? 'Saved!' : 'Publish Content Changes'}
            </button>
          </div>

          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="font-display text-2xl mb-6">Logo Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm mb-2">Logo Type</label>
                <select 
                  value={logoConfig.type} 
                  onChange={e => setLogoConfig({...logoConfig, type: e.target.value as 'text' | 'image'})}
                  className="w-full border p-2 text-sm max-w-xs"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              {logoConfig.type === 'text' && (
                <div>
                  <label className="block text-sm mb-2">Logo Text</label>
                  <input 
                    type="text" 
                    value={logoConfig.text} 
                    onChange={e => setLogoConfig({...logoConfig, text: e.target.value})}
                    className="w-full border p-2 text-sm"
                  />
                </div>
              )}

              {logoConfig.type === 'image' && (
                <div>
                  <label className="block text-sm mb-2">Logo Image</label>
                  <div className="flex flex-col gap-2">
                    {logoConfig.imageUrl && <img src={logoConfig.imageUrl} className="h-12 w-auto object-contain bg-gray-100 p-2 border" alt="Logo Preview" />}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const compressed = await compressImage(file, 400);
                          setLogoConfig({...logoConfig, imageUrl: compressed});
                        }
                      }}
                      className="w-full border p-2 text-sm bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="font-display text-2xl mb-6">Menu Items (Hamburger)</h2>
            <div className="space-y-4">
              {menuItems.map((item, i) => (
                <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-4 border border-gray-200">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input 
                       type="text" 
                       value={item.label} 
                       onChange={e => {
                         const n = [...menuItems];
                         n[i] = { ...n[i], label: e.target.value };
                         setMenuItems(n);
                       }}
                       placeholder="Menu Label" 
                       className="w-full text-sm border p-2" 
                     />
                     <select 
                       value={item.action} 
                       onChange={e => {
                         const n = [...menuItems];
                         n[i] = { ...n[i], action: e.target.value };
                         setMenuItems(n);
                       }}
                       className="w-full text-sm border p-2 bg-white" 
                     >
                       <option value="home">Home</option>
                       <option value="shop">Shop</option>
                       <option value="cart">Cart</option>
                       <option value="wishlist">Wishlist</option>
                       <option value="tracking">Track Order</option>
                     </select>
                  </div>
                  <button onClick={() => setMenuItems(menuItems.filter(m => m.id !== item.id))} className="text-red-500 hover:bg-red-50 p-2 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setMenuItems([...menuItems, { id: Date.now().toString(), label: 'New Menu', action: 'shop' }])}
                className="text-xs uppercase tracking-widest font-semibold p-4 border border-dashed border-gray-300 w-full hover:bg-gray-50 text-gray-600">
                + Add Menu Item
              </button>
            </div>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Sub Category (Optional)</label>
                      <input type="text" value={pSubCategory} onChange={e=>setPSubCategory(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" placeholder="e.g. Chairs" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Materials (Optional)</label>
                      <input type="text" value={pMaterials} onChange={e=>setPMaterials(e.target.value)} className="w-full border border-gray-200 px-3 py-2 text-sm focus:border-archora-black outline-none" placeholder="e.g. Oak Wood, Leather" />
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
                      onChange={async (e) => {
                         const files = Array.from(e.target.files || []) as File[];
                         const base64Images = await Promise.all(files.map(f => compressImage(f, 800)));
                         setPImages(prev => {
                            const currentUrls = prev.filter(img => img.trim() !== '');
                            return [...base64Images, ...currentUrls];
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

      {activeTab === 'layout' && ( <>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-blue-900 mb-1">Visual Site Builder</h3>
          <p className="text-sm text-blue-700">Enter full-site drag-and-drop edit mode to design your storefront structure, typography, buttons, and layout.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditMode(true);
            setIsVisualEditMode(true); // legacy compat
            navigate('/');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium whitespace-nowrap transition-colors shadow-sm"
        >
          Launch Visual Builder
        </button>
      </div>
  
        <div className="space-y-8 animate-fade-in pb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-medium tracking-wide">Layout & Header Customizer</h2>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsVisualEditMode(true);
                  navigate('/');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-archora-black px-4 py-2 rounded-md font-medium transition-colors text-sm uppercase tracking-wider flex items-center gap-2 border border-gray-300"
              >
                Visual Edit Mode
              </button>
              <button 
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className={`text-white px-6 py-2 rounded-md font-medium transition-colors text-sm uppercase tracking-wider flex items-center gap-2 ${publishSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-archora-gold hover:bg-black'} disabled:opacity-50`}
              >
                {isSavingConfig ? 'Publishing...' : publishSuccess ? 'Saved!' : 'Publish Layout Changes'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Header & Navigation */}
            <div className="bg-white p-6 border rounded-sm shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 border-b pb-2">1. Header & Navigation</h3>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <input 
                    type="checkbox" 
                    checked={layoutConfig.announcementBar.show}
                    onChange={e => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, show: e.target.checked}})}
                  /> 
                  Show Announcement Bar
                </label>
              </div>
              
              {layoutConfig.announcementBar.show && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Bar Text</label>
                    <input 
                      type="text" 
                      value={layoutConfig.announcementBar.text}
                      onChange={e => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, text: e.target.value}})}
                      className="w-full border p-2 text-sm bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Background Color</label>
                      <input 
                        type="color" 
                        value={layoutConfig.announcementBar.bgColor}
                        onChange={e => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, bgColor: e.target.value}})}
                        className="w-full h-8 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Text Color</label>
                      <input 
                        type="color" 
                        value={layoutConfig.announcementBar.textColor}
                        onChange={e => setLayoutConfig({...layoutConfig, announcementBar: {...layoutConfig.announcementBar, textColor: e.target.value}})}
                        className="w-full h-8 cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="pt-4 border-t">
                <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Header Background Color</label>
                <input 
                  type="color" 
                  value={layoutConfig.header.bgColor}
                  onChange={e => setLayoutConfig({...layoutConfig, header: {...layoutConfig.header, bgColor: e.target.value}})}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </div>

            {/* 2. Logo Configuration */}
            <div className="bg-white p-6 border rounded-sm shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 border-b pb-2">2. Logo Configuration</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input 
                    type="radio" 
                    name="logoType"
                    checked={layoutConfig.logoSettings.type === 'text'}
                    onChange={() => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, type: 'text'}})}
                  /> 
                  Text Logo
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input 
                    type="radio" 
                    name="logoType"
                    checked={layoutConfig.logoSettings.type === 'image'}
                    onChange={() => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, type: 'image'}})}
                  /> 
                  Image Logo
                </label>
              </div>

              {layoutConfig.logoSettings.type === 'text' ? (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Logo Text</label>
                  <input 
                    type="text" 
                    value={layoutConfig.logoSettings.text}
                    onChange={e => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, text: e.target.value}})}
                    className="w-full border p-2 text-sm bg-gray-50"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Image URL</label>
                    <input 
                      type="text" 
                      value={layoutConfig.logoSettings.imageUrl}
                      onChange={e => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, imageUrl: e.target.value}})}
                      className="w-full border p-2 text-sm bg-gray-50"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Mobile Height (px)</label>
                      <input 
                        type="range" 
                        min="20" max="80" 
                        value={layoutConfig.logoSettings.mobileHeight}
                        onChange={e => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, mobileHeight: Number(e.target.value)}})}
                        className="w-full"
                      />
                      <div className="text-xs text-center">{layoutConfig.logoSettings.mobileHeight}px</div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Desktop Height (px)</label>
                      <input 
                        type="range" 
                        min="24" max="100" 
                        value={layoutConfig.logoSettings.desktopHeight}
                        onChange={e => setLayoutConfig({...layoutConfig, logoSettings: {...layoutConfig.logoSettings, desktopHeight: Number(e.target.value)}})}
                        className="w-full"
                      />
                      <div className="text-xs text-center">{layoutConfig.logoSettings.desktopHeight}px</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 3. Category Section Title Editor */}
            <div className="bg-white p-6 border rounded-sm shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 border-b pb-2">3. Category Section Title Editor</h3>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Heading Text</label>
                <input 
                  type="text" 
                  value={layoutConfig.categorySection.title}
                  onChange={e => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, title: e.target.value}})}
                  className="w-full border p-2 text-sm bg-gray-50 mb-3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Font Size (px)</label>
                  <input 
                    type="range" 
                    min="10" max="36" 
                    value={layoutConfig.categorySection.fontSize}
                    onChange={e => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, fontSize: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categorySection.fontSize}px</div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Letter Spacing (px)</label>
                  <input 
                    type="range" 
                    min="0" max="10" step="0.5"
                    value={layoutConfig.categorySection.letterSpacing}
                    onChange={e => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, letterSpacing: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categorySection.letterSpacing}px</div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Margin Top (px)</label>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={layoutConfig.categorySection.marginTop}
                    onChange={e => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, marginTop: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categorySection.marginTop}px</div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Margin Bottom (px)</label>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={layoutConfig.categorySection.marginBottom}
                    onChange={e => setLayoutConfig({...layoutConfig, categorySection: {...layoutConfig.categorySection, marginBottom: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categorySection.marginBottom}px</div>
                </div>
              </div>
            </div>

            {/* 4. Dynamic Category Cards Manager */}
            <div className="bg-white p-6 border rounded-sm shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 border-b pb-2">4. Dynamic Category Cards Layout</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Card Width (px)</label>
                  <input 
                    type="range" 
                    min="60" max="300" 
                    value={layoutConfig.categoryCards.width}
                    onChange={e => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, width: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categoryCards.width}px</div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Card Height (px)</label>
                  <input 
                    type="range" 
                    min="60" max="300" 
                    value={layoutConfig.categoryCards.height}
                    onChange={e => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, height: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categoryCards.height}px</div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Corner Radius (px)</label>
                  <input 
                    type="range" 
                    min="0" max="150" 
                    value={layoutConfig.categoryCards.cornerRadius}
                    onChange={e => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, cornerRadius: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categoryCards.cornerRadius}px</div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Grid Gap (px)</label>
                  <input 
                    type="range" 
                    min="0" max="64" 
                    value={layoutConfig.categoryCards.gap}
                    onChange={e => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, gap: Number(e.target.value)}})}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{layoutConfig.categoryCards.gap}px</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Aspect Ratio</label>
                  <select 
                    value={layoutConfig.categoryCards.aspectRatio}
                    onChange={e => setLayoutConfig({...layoutConfig, categoryCards: {...layoutConfig.categoryCards, aspectRatio: e.target.value}})}
                    className="w-full border p-2 text-sm bg-gray-50"
                  >
                    <option value="1/1">1:1 (Square)</option>
                    <option value="4/3">4:3 (Landscape)</option>
                    <option value="16/9">16:9 (Wide)</option>
                    <option value="3/4">3:4 (Portrait)</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500 italic mb-2">Note: You can add/remove category items in the "Categories" tab.</p>
                <button 
                  onClick={() => navigate('/admin/categories')}
                  className="text-archora-gold hover:underline text-sm font-medium"
                >
                  Manage Category Items →
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </>
      )}

    </div>
  );
};

const QuotesAdminTab = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedQuotes: QuoteRequest[] = [];
        querySnapshot.forEach((doc) => {
          const d = doc.data();
          fetchedQuotes.push({
            id: doc.id,
            productId: d.productId,
            productName: d.productName,
            customerName: d.customerName,
            customerEmail: d.customerEmail,
            size: d.size,
            color: d.color,
            material: d.material,
            notes: d.notes,
            status: d.status,
            date: d.createdAt ? new Date(d.createdAt.toMillis()).toLocaleString() : 'N/A'
          });
        });
        setQuotes(fetchedQuotes);
      } catch (err) {
        console.error('Failed to fetch quotes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const updateStatus = async (quoteId: string, newStatus: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await updateDoc(doc(db, 'quotes', quoteId), { status: newStatus });
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus as any } : q));
    } catch (err) {
      alert('Update failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading quotes...</div>;
  if (quotes.length === 0) return <div className="p-8 text-center text-gray-500">No quotes received yet.</div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl mb-6">Custom Quote Requests</h2>
      {quotes.map(quote => (
        <div key={quote.id} className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">{quote.productName}</h3>
              <span className="text-xs text-gray-400">{quote.date}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-4">
              <div><span className="text-gray-500 text-sm block">Customer</span><strong className="text-sm block">{quote.customerName}</strong><a href={`mailto:${quote.customerEmail}`} className="text-xs text-blue-600 hover:underline">{quote.customerEmail}</a></div>
              <div><span className="text-gray-500 text-sm block">Requested Size</span><span className="text-sm block">{quote.size || 'N/A'}</span></div>
              <div><span className="text-gray-500 text-sm block">Color/Finish</span><span className="text-sm block">{quote.color || 'N/A'}</span></div>
              <div><span className="text-gray-500 text-sm block">Material</span><span className="text-sm block">{quote.material || 'N/A'}</span></div>
            </div>
            
            {quote.notes && (
              <div className="bg-gray-50 p-4 text-sm text-gray-700 italic border-l-2 border-archora-gold">
                "{quote.notes}"
              </div>
            )}
          </div>
          
          <div className="md:w-48 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 justify-center">
             <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 text-center block mb-2">Status</span>
             <select 
               value={quote.status} 
               onChange={(e) => updateStatus(quote.id, e.target.value)}
               className={`w-full p-2 text-sm text-center border font-semibold outline-none ${
                 quote.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                 quote.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                 'bg-green-50 text-green-700 border-green-200'
               }`}
             >
               <option value="Pending">Pending</option>
               <option value="Reviewed">Reviewed</option>
               <option value="Responded">Responded</option>
             </select>
          </div>
        </div>
      ))}
    </div>
  );
};

const CouponsAdminTab = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: 10, expiryDate: '' });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { collection, getDocs, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        const unsub = onSnapshot(collection(db, 'coupons'), (snapshot) => {
          const list: Coupon[] = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...doc.data() } as Coupon);
          });
          setCoupons(list);
          setLoading(false);
        }, (error) => {
          console.error("Failed to fetch coupons", error);
          setLoading(false);
        });
        return () => unsub();
      } catch (e) {
        console.error(e);
      }
    };
    fetchCoupons();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { collection, setDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      const code = newCoupon.code.toUpperCase().trim();
      if (!code) return alert('Invalid code');
      await setDoc(doc(db, 'coupons', code), {
        code,
        type: newCoupon.type,
        value: Number(newCoupon.value),
        expiryDate: newCoupon.expiryDate,
        isActive: true
      });
      setShowAdd(false);
      setNewCoupon({ code: '', type: 'percentage', value: 10, expiryDate: '' });
    } catch(e) {
      alert('Failed to add coupon');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await updateDoc(doc(db, 'coupons', id), { isActive: !currentStatus });
    } catch(e) {
      alert('Update failed');
    }
  }
  
  const handleDelete = async (id: string) => {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e) {
      alert('Delete failed');
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading coupons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl">Coupons & Discounts</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-archora-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors flex items-center gap-2 rounded-sm relative z-20">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end mb-8 relative z-10">
           <div className="flex-1 w-full">
             <label className="text-sm block mb-1">Coupon Code</label>
             <input required type="text" className="w-full border p-2 text-sm uppercase" value={newCoupon.code} onChange={e=>setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" />
           </div>
           <div className="w-full md:w-32">
             <label className="text-sm block mb-1">Type</label>
             <select className="w-full border p-2 text-sm bg-white" value={newCoupon.type} onChange={e=>setNewCoupon({...newCoupon, type: e.target.value})}>
               <option value="percentage">Percentage %</option>
               <option value="fixed">Fixed Amount $</option>
             </select>
           </div>
           <div className="w-full md:w-32">
             <label className="text-sm block mb-1">Value</label>
             <input required type="number" min="1" className="w-full border p-2 text-sm" value={newCoupon.value} onChange={e=>setNewCoupon({...newCoupon, value: e.target.value as any})} />
           </div>
           <div className="w-full md:w-48">
             <label className="text-sm block mb-1">Expiry Date (Optional)</label>
             <input type="date" className="w-full border p-2 text-sm" value={newCoupon.expiryDate} onChange={e=>setNewCoupon({...newCoupon, expiryDate: e.target.value})} />
           </div>
           <button type="submit" className="bg-archora-black text-white px-6 py-2 h-[38px] text-xs font-bold uppercase tracking-widest hover:bg-archora-gold transition-colors">
             Save
           </button>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white border border-gray-100">No coupons active.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.id} className={`bg-white p-6 border-2 transition-all ${coupon.isActive ? 'border-archora-gold/20' : 'border-gray-100 opacity-60'}`}>
               <div className="flex justify-between items-start mb-4">
                 <h3 className="font-mono text-xl font-bold tracking-wider">{coupon.code}</h3>
                 <div className="flex gap-2">
                   <button onClick={() => toggleActive(coupon.id, coupon.isActive)} className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-archora-black">
                     {coupon.isActive ? 'Disable' : 'Enable'}
                   </button>
                   <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Discount</span>
                   <strong className="text-archora-black">{coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}</strong>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Expiry</span>
                   <span className="text-archora-black">{coupon.expiryDate || 'Never'}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Status</span>
                   <span className={coupon.isActive ? 'text-green-600 font-medium' : 'text-gray-400'}>
                     {coupon.isActive ? 'Active' : 'Inactive'}
                   </span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
