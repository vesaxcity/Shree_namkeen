import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Menu, X, Search, Phone, Mail, MapPin,
  Heart, Star, Plus, Minus, Package, Truck,
  Shield, Clock, User, LogOut, Home as HomeIcon,
  MessageCircle
} from 'lucide-react';

const ShreesNamkeenEcommerce = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Product categories
  const categories = [
    { id: 'all', name: 'All Products', icon: '🥘', count: 52 },
    { id: 'sev', name: 'Sev Varieties', icon: '🌾', count: 18 },
    { id: 'mixture', name: 'Mixture', icon: '🥗', count: 22 },
    { id: 'seasonal', name: 'Seasonal Specials', icon: '⭐', count: 12 }
  ];

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Ratlami Sev',
      category: 'sev',
      price: 95,
      originalPrice: 120,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Authentic spicy sev with traditional Ratlami flavors, made fresh daily',
      rating: 4.8,
      reviews: 124,
      variants: [
        { id: '1-250', weight: '250g', price: 95, stock: 50 },
        { id: '1-500', weight: '500g', price: 190, stock: 30 },
        { id: '1-1kg', weight: '1kg', price: 370, stock: 20 }
      ],
      bestseller: true,
      new: false,
      ingredients: 'Gram flour, Edible oil, Spices',
      shelfLife: '60 days'
    },
    {
      id: 2,
      name: 'Aloo Bhujia',
      category: 'sev',
      price: 85,
      originalPrice: 100,
      image: 'https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Crispy potato-based sev with perfect spice blend',
      rating: 4.7,
      reviews: 98,
      variants: [
        { id: '2-250', weight: '250g', price: 85, stock: 45 },
        { id: '2-500', weight: '500g', price: 170, stock: 35 },
        { id: '2-1kg', weight: '1kg', price: 330, stock: 25 }
      ],
      bestseller: true,
      new: false,
      ingredients: 'Potato, Gram flour, Spices',
      shelfLife: '60 days'
    },
    {
      id: 3,
      name: 'Khatta Meetha',
      category: 'mixture',
      price: 110,
      originalPrice: 140,
      image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Perfect balance of sweet and tangy flavors in every bite',
      rating: 4.9,
      reviews: 156,
      variants: [
        { id: '3-250', weight: '250g', price: 110, stock: 40 },
        { id: '3-500', weight: '500g', price: 220, stock: 28 },
        { id: '3-1kg', weight: '1kg', price: 425, stock: 18 }
      ],
      bestseller: true,
      new: false,
      ingredients: 'Mixed lentils, Sugar, Spices, Raisins',
      shelfLife: '90 days'
    },
    {
      id: 4,
      name: 'Punjabi Tadka Mix',
      category: 'mixture',
      price: 105,
      originalPrice: 130,
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Rich and flavorful Punjabi-style mixture',
      rating: 4.6,
      reviews: 87,
      variants: [
        { id: '4-250', weight: '250g', price: 105, stock: 35 },
        { id: '4-500', weight: '500g', price: 210, stock: 25 },
        { id: '4-1kg', weight: '1kg', price: 405, stock: 15 }
      ],
      bestseller: false,
      new: true,
      ingredients: 'Mixed namkeen, Spices, Dried fruits',
      shelfLife: '60 days'
    },
    {
      id: 5,
      name: 'Moong Dal Namkeen',
      category: 'sev',
      price: 95,
      originalPrice: 115,
      image: 'https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Crunchy roasted moong dal with mild spices',
      rating: 4.5,
      reviews: 72,
      variants: [
        { id: '5-250', weight: '250g', price: 95, stock: 42 },
        { id: '5-500', weight: '500g', price: 190, stock: 30 },
        { id: '5-1kg', weight: '1kg', price: 365, stock: 20 }
      ],
      bestseller: false,
      new: false,
      ingredients: 'Moong dal, Edible oil, Salt, Spices',
      shelfLife: '60 days'
    },
    {
      id: 6,
      name: 'Masala Peanuts',
      category: 'mixture',
      price: 80,
      originalPrice: 95,
      image: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Roasted peanuts coated with spicy masala',
      rating: 4.7,
      reviews: 143,
      variants: [
        { id: '6-250', weight: '250g', price: 80, stock: 55 },
        { id: '6-500', weight: '500g', price: 160, stock: 40 },
        { id: '6-1kg', weight: '1kg', price: 310, stock: 28 }
      ],
      bestseller: false,
      new: false,
      ingredients: 'Peanuts, Gram flour, Spices',
      shelfLife: '90 days'
    },
    {
      id: 7,
      name: 'Festival Special Box',
      category: 'seasonal',
      price: 135,
      originalPrice: 160,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Limited edition festive assortment perfect for celebrations',
      rating: 4.9,
      reviews: 134,
      variants: [
        { id: '7-500', weight: '500g', price: 135, stock: 25 },
        { id: '7-1kg', weight: '1kg', price: 265, stock: 15 }
      ],
      bestseller: true,
      new: true,
      ingredients: 'Assorted namkeen varieties',
      shelfLife: '60 days'
    },
    {
      id: 8,
      name: 'Diwali Combo Pack',
      category: 'seasonal',
      price: 299,
      originalPrice: 380,
      image: 'https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Assorted namkeen perfect for Diwali celebrations',
      rating: 5.0,
      reviews: 201,
      variants: [
        { id: '8-1kg', weight: '1kg', price: 299, stock: 20 },
        { id: '8-2kg', weight: '2kg', price: 580, stock: 12 }
      ],
      bestseller: true,
      new: true,
      ingredients: 'Premium assorted namkeen collection',
      shelfLife: '60 days'
    },
    {
      id: 9,
      name: 'Laung Sev',
      category: 'sev',
      price: 105,
      originalPrice: 125,
      image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Aromatic clove-flavored sev with unique taste',
      rating: 4.6,
      reviews: 89,
      variants: [
        { id: '9-250', weight: '250g', price: 105, stock: 38 },
        { id: '9-500', weight: '500g', price: 210, stock: 26 }
      ],
      bestseller: false,
      new: false,
      ingredients: 'Gram flour, Cloves, Spices',
      shelfLife: '60 days'
    },
    {
      id: 10,
      name: 'Navratan Mix',
      category: 'mixture',
      price: 120,
      originalPrice: 145,
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Nine varieties of delicious namkeen in one pack',
      rating: 4.8,
      reviews: 167,
      variants: [
        { id: '10-250', weight: '250g', price: 120, stock: 33 },
        { id: '10-500', weight: '500g', price: 240, stock: 22 },
        { id: '10-1kg', weight: '1kg', price: 465, stock: 14 }
      ],
      bestseller: true,
      new: false,
      ingredients: 'Nine varieties of premium namkeen',
      shelfLife: '60 days'
    },
    {
      id: 11,
      name: 'Ujjaini Sev',
      category: 'sev',
      price: 95,
      originalPrice: 115,
      image: 'https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Classic Ujjain-style sev with traditional recipe',
      rating: 4.7,
      reviews: 112,
      variants: [
        { id: '11-250', weight: '250g', price: 95, stock: 46 },
        { id: '11-500', weight: '500g', price: 190, stock: 32 },
        { id: '11-1kg', weight: '1kg', price: 370, stock: 21 }
      ],
      bestseller: false,
      new: false,
      ingredients: 'Gram flour, Edible oil, Traditional spices',
      shelfLife: '60 days'
    },
    {
      id: 12,
      name: 'Chakli Special',
      category: 'seasonal',
      price: 90,
      originalPrice: 110,
      image: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Traditional spiral-shaped savory snack',
      rating: 4.8,
      reviews: 95,
      variants: [
        { id: '12-200', weight: '200g', price: 90, stock: 35 },
        { id: '12-400', weight: '400g', price: 180, stock: 24 }
      ],
      bestseller: false,
      new: true,
      ingredients: 'Rice flour, Gram flour, Sesame seeds',
      shelfLife: '45 days'
    }
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart functions
  const addToCart = (product, variant) => {
    const cartId = `${product.id}-${variant.id}`;
    const cartItem = {
      cartId,
      product,
      variant,
      quantity: 1
    };

    const existingItem = cart.find(item => item.cartId === cartId);

    if (existingItem) {
      setCart(cart.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showNotificationMessage('Quantity updated in cart!');
    } else {
      setCart([...cart, cartItem]);
      showNotificationMessage('Added to cart!');
    }
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
    showNotificationMessage('Removed from cart');
  };

  const updateQuantity = (cartId, change) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showNotificationMessage('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showNotificationMessage('Added to wishlist!');
    }
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = cartTotal >= 999 ? 0 : 50;
  const finalTotal = cartTotal + shippingCost;

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@400;600;700&display=swap');
          
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>

        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-slide-in">
            ✓ {notificationMessage}
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white shadow-2xl">
          <div className="container mx-auto px-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-2 text-sm border-b border-orange-500/30">
              <div className="flex items-center gap-6">
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-orange-200 transition-colors">
                  <Phone size={14} />
                  <span className="hidden md:inline">+91 98765 43210</span>
                </a>
                <a href="mailto:info@shreesnamkeen.com" className="flex items-center gap-2 hover:text-orange-200 transition-colors">
                  <Mail size={14} />
                  <span className="hidden md:inline">info@shreesnamkeen.com</span>
                </a>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-orange-200">Free Shipping on Orders Above ₹999</span>
              </div>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-orange-700 rounded-lg transition-colors">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div
                  onClick={() => setCurrentPage('home')}
                  className="text-3xl md:text-4xl font-bold tracking-tight cursor-pointer">
                  <span className="text-yellow-300">SHREE'S</span>
                  <span className="text-white"> NAMKEEN</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300" size={20} />
                  <input
                    type="text"
                    placeholder="Search for delicious namkeen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-orange-400/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Cart & Account */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                      <User size={24} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-t-lg">My Account</a>
                      <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-orange-50">My Orders</a>
                      <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthenticated(true)}
                    className="hidden md:block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all text-sm font-semibold">
                    Login
                  </button>
                )}

                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-orange-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-8 pb-4 text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/20 ${currentPage === 'home' ? 'bg-white/30 font-bold' : ''
                  }`}>
                <HomeIcon size={18} />
                <span>Home</span>
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage('products');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/20 ${selectedCategory === category.id && currentPage === 'products' ? 'bg-white/30 font-bold' : ''
                    }`}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-orange-700 border-t border-orange-500/30">
              <div className="container mx-auto px-4 py-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300" size={20} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-orange-400/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCurrentPage('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors">
                    <HomeIcon size={18} />
                    <span>Home</span>
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage('products');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${selectedCategory === category.id ? 'bg-white/30 font-bold' : 'hover:bg-white/20'
                        }`}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content - Home Page */}
        {currentPage === 'home' && (
          <>
            {/* Hero Banner */}
            <section className="relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-900 via-red-800 to-orange-900">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
              </div>
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Taste the<br />
                    <span className="text-yellow-300">Tradition</span>
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-orange-100" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Authentic Indian snacks crafted with love and the finest ingredients
                  </p>
                  <button
                    onClick={() => setCurrentPage('products')}
                    className="bg-yellow-400 text-orange-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl">
                    Shop Now
                  </button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { icon: Package, title: 'Fresh Products', desc: 'Made daily' },
                    { icon: Truck, title: 'Free Delivery', desc: 'Orders above ₹999' },
                    { icon: Shield, title: '100% Quality', desc: 'Guaranteed' },
                    { icon: Clock, title: 'Quick Service', desc: '24/7 support' }
                  ].map((feature, idx) => (
                    <div key={idx} className="text-center p-6 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50">
                      <feature.icon className="mx-auto mb-4 text-orange-600" size={40} />
                      <h3 className="font-bold text-lg mb-2 text-orange-900">{feature.title}</h3>
                      <p className="text-sm text-orange-700">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Categories */}
            <section className="py-16 container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
                  Our Categories
                </h2>
                <p className="text-xl text-orange-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Explore our delicious collection
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.filter(c => c.id !== 'all').map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage('products');
                    }}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 p-8 text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <h3 className="text-xl font-bold text-orange-900 mb-2">{category.name}</h3>
                    <p className="text-orange-600 font-semibold">{category.count} Items</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Bestsellers */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
                    Bestsellers
                  </h2>
                  <p className="text-xl text-orange-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Customer favorites you'll love
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.filter(p => p.bestseller).slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative cursor-pointer"
                      onClick={() => openProductDetail(product)}>

                      <span className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Bestseller
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Heart
                          size={20}
                          className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                      </button>

                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="fill-yellow-400 text-yellow-400" size={16} />
                            <span className="text-sm font-bold text-orange-900">{product.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({product.reviews})</span>
                        </div>

                        <h3 className="text-xl font-bold text-orange-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {product.description.substring(0, 60)}...
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                          <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, product.variants[0]);
                          }}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button
                    onClick={() => setCurrentPage('products')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105">
                    View All Products
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Products Page */}
        {currentPage === 'products' && (
          <section className="py-16 container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
                {categories.find(c => c.id === selectedCategory)?.name || 'All Products'}
              </h2>
              <p className="text-xl text-orange-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {filteredProducts.length} delicious items to choose from
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative cursor-pointer"
                  onClick={() => openProductDetail(product)}>

                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.bestseller && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Bestseller
                      </span>
                    )}
                    {product.new && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        New
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Heart
                      size={20}
                      className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>

                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="fill-yellow-400 text-yellow-400" size={16} />
                        <span className="text-sm font-bold text-orange-900">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    <h3 className="text-xl font-bold text-orange-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                      <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, product.variants[0]);
                      }}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500">No products found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all">
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* Product Detail Page */}
        {currentPage === 'product-detail' && selectedProduct && (
          <section className="py-16 container mx-auto px-4">
            <button
              onClick={() => setCurrentPage('products')}
              className="mb-8 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
              ← Back to Products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8">
              <div>
                <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 mb-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.bestseller && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="text-lg font-bold text-orange-900">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-gray-600">({selectedProduct.reviews} reviews)</span>
                </div>

                <h1 className="text-4xl font-bold text-orange-900 mb-4">{selectedProduct.name}</h1>
                <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {selectedProduct.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-orange-600">₹{selectedProduct.price}</span>
                  <span className="text-2xl text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
                  <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-bold">
                    Save {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">Select Weight:</h3>
                  <div className="flex gap-3">
                    {selectedProduct.variants.map(variant => (
                      <button
                        key={variant.id}
                        className="flex-1 px-4 py-3 border-2 border-orange-300 rounded-lg font-semibold text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                        {variant.weight}
                        <div className="text-sm">₹{variant.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ingredients:</p>
                      <p className="font-semibold text-gray-900">{selectedProduct.ingredients}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Shelf Life:</p>
                      <p className="font-semibold text-gray-900">{selectedProduct.shelfLife}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => addToCart(selectedProduct, selectedProduct.variants[0])}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105">
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="p-4 border-2 border-orange-600 rounded-xl hover:bg-orange-50 transition-all">
                    <Heart
                      size={24}
                      className={wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-orange-600'}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cart Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <h2 className="text-2xl font-bold">Shopping Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-xl text-gray-500 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mb-6">Add some delicious namkeen!</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCurrentPage('products');
                    }}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4 bg-orange-50 p-4 rounded-xl">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-orange-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">{item.variant.weight}</p>
                        <p className="text-lg font-bold text-orange-600 mt-1">₹{item.variant.price}</p>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.cartId, -1)}
                            className="p-1 bg-orange-200 rounded hover:bg-orange-300 transition-colors">
                            <Minus size={16} />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, 1)}
                            className="p-1 bg-orange-200 rounded hover:bg-orange-300 transition-colors">
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="ml-auto text-red-600 hover:text-red-700 text-sm font-semibold">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-bold text-orange-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-700">Shipping:</span>
                    <span className={`font-bold ${shippingCost === 0 ? 'text-green-600' : 'text-orange-900'}`}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>
                  {cartTotal < 999 && (
                    <p className="text-sm text-orange-600 bg-orange-100 p-2 rounded-lg">
                      Add ₹{999 - cartTotal} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-2xl border-t pt-3">
                    <span className="font-bold text-orange-900">Total:</span>
                    <span className="font-bold text-orange-600">₹{finalTotal}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showNotificationMessage('Checkout feature coming soon!');
                    setTimeout(() => {
                      setIsCartOpen(false);
                    }, 1500);
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-300">SHREE'S NAMKEEN</h3>
                <p className="text-orange-200 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Authentic Indian snacks made with tradition and love since 1985.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 text-yellow-300">Quick Links</h4>
                <ul className="space-y-2 text-orange-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <li><button onClick={() => setCurrentPage('home')} className="hover:text-yellow-300 transition-colors">Home</button></li>
                  <li><button onClick={() => setCurrentPage('products')} className="hover:text-yellow-300 transition-colors">Our Products</button></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Track Order</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 text-yellow-300">Customer Service</h4>
                <ul className="space-y-2 text-orange-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Shipping Policy</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Return Policy</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-4 text-yellow-300">Contact Info</h4>
                <ul className="space-y-3 text-orange-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <MapPin size={20} className="flex-shrink-0 mt-1" />
                    <span>Mumbai, Maharashtra, India</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone size={20} />
                    <span>+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={20} />
                    <span>info@shreesnamkeen.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">WhatsApp Us</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <p>© 2026 Shree's Namkeen. All rights reserved. Made with ❤️ in India</p>
            </div>
          </div>
        </footer>

        {/* Overlay for cart */}
        {isCartOpen && (
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          ></div>
        )}
      </div>
    </>
  );
};

export default ShreesNamkeenEcommerce;