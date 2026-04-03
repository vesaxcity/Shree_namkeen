import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Heart, Star, Plus, Minus, ChevronRight, Package, Truck, Shield, Clock } from 'lucide-react';

const ShreeNamkeenEcommerce = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Product data
  const categories = [
    { id: 'all', name: 'All Products', icon: '🥘' },
    { id: 'sev', name: 'Sev Varieties', icon: '🌾' },
    { id: 'mixture', name: 'Mixture', icon: '🥗' },
    { id: 'dry-snacks', name: 'Dry Snacks', icon: '🍿' },
    { id: 'namkeen', name: 'Namkeen', icon: '🥜' },
    { id: 'sweets', name: 'Sweets', icon: '🍬' },
    { id: 'seasonal', name: 'Seasonal Specials', icon: '⭐' }
  ];

  const products = [
    {
      id: 1,
      name: 'Ratlami Sev',
      category: 'sev',
      price: 95,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&h=500&fit=crop',
      description: 'Authentic spicy sev with traditional Ratlami flavors',
      rating: 4.8,
      reviews: 124,
      weights: ['250g', '500g', '1kg'],
      bestseller: true,
      new: false
    },
    {
      id: 2,
      name: 'Aloo Bhujia',
      category: 'sev',
      price: 85,
      originalPrice: 100,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
      description: 'Crispy potato-based sev with perfect spice blend',
      rating: 4.7,
      reviews: 98,
      weights: ['250g', '500g', '1kg'],
      bestseller: true,
      new: false
    },
    {
      id: 3,
      name: 'Khatta Meetha',
      category: 'mixture',
      price: 110,
      originalPrice: 140,
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&h=500&fit=crop',
      description: 'Perfect balance of sweet and tangy flavors',
      rating: 4.9,
      reviews: 156,
      weights: ['250g', '500g', '1kg'],
      bestseller: true,
      new: false
    },
    {
      id: 4,
      name: 'Punjabi Tadka Mix',
      category: 'mixture',
      price: 105,
      originalPrice: 130,
      image: 'https://images.unsplash.com/photo-1606850780554-b55ef629aa0a?w=500&h=500&fit=crop',
      description: 'Rich and flavorful Punjabi-style mixture',
      rating: 4.6,
      reviews: 87,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: true
    },
    {
      id: 5,
      name: 'Moong Dal',
      category: 'dry-snacks',
      price: 95,
      originalPrice: 115,
      image: 'https://images.unsplash.com/photo-1596040033229-a0b16e812f9a?w=500&h=500&fit=crop',
      description: 'Crunchy roasted moong dal with mild spices',
      rating: 4.5,
      reviews: 72,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: false
    },
    {
      id: 6,
      name: 'Masala Peanuts',
      category: 'dry-snacks',
      price: 80,
      originalPrice: 95,
      image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=500&h=500&fit=crop',
      description: 'Roasted peanuts coated with spicy masala',
      rating: 4.7,
      reviews: 143,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: false
    },
    {
      id: 7,
      name: 'Boondi',
      category: 'namkeen',
      price: 70,
      originalPrice: 85,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop',
      description: 'Light and crispy boondi pearls',
      rating: 4.4,
      reviews: 65,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: false
    },
    {
      id: 8,
      name: 'Chakli',
      category: 'namkeen',
      price: 90,
      originalPrice: 110,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
      description: 'Traditional spiral-shaped savory snack',
      rating: 4.8,
      reviews: 112,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: true
    },
    {
      id: 9,
      name: 'Kaju Katli',
      category: 'sweets',
      price: 450,
      originalPrice: 520,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop',
      description: 'Premium cashew fudge with silver leaf',
      rating: 5.0,
      reviews: 89,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: false
    },
    {
      id: 10,
      name: 'Soan Papdi',
      category: 'sweets',
      price: 120,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=500&h=500&fit=crop',
      description: 'Flaky and crispy sweet delicacy',
      rating: 4.6,
      reviews: 76,
      weights: ['250g', '500g', '1kg'],
      bestseller: false,
      new: false
    },
    {
      id: 11,
      name: 'Festival Special Mix',
      category: 'seasonal',
      price: 135,
      originalPrice: 160,
      image: 'https://images.unsplash.com/photo-1606850780554-b55ef629aa0a?w=500&h=500&fit=crop',
      description: 'Limited edition festive assortment',
      rating: 4.9,
      reviews: 134,
      weights: ['500g', '1kg'],
      bestseller: true,
      new: true
    },
    {
      id: 12,
      name: 'Diwali Combo Pack',
      category: 'seasonal',
      price: 299,
      originalPrice: 380,
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&h=500&fit=crop',
      description: 'Assorted namkeen perfect for celebrations',
      rating: 5.0,
      reviews: 201,
      weights: ['1kg', '2kg'],
      bestseller: true,
      new: true
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
  const addToCart = (product, weight = '250g') => {
    const cartItem = {
      ...product,
      selectedWeight: weight,
      quantity: 1,
      cartId: `${product.id}-${weight}`
    };
    
    const existingItem = cart.find(item => item.cartId === cartItem.cartId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.cartId === cartItem.cartId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, cartItem]);
    }
    
    showNotificationMessage('Added to cart!');
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
      
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-300 animate-bounce"
             style={{ animation: 'slideIn 0.3s ease-out' }}>
          {notificationMessage}
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
              <a href="mailto:info@shreenamkeen.com" className="flex items-center gap-2 hover:text-orange-200 transition-colors">
                <Mail size={14} />
                <span className="hidden md:inline">info@shreenamkeen.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-orange-200">Free Shipping on Orders Above ₹999</span>
              <div className="flex gap-3">
                <Facebook size={16} className="cursor-pointer hover:scale-110 transition-transform" />
                <Instagram size={16} className="cursor-pointer hover:scale-110 transition-transform" />
                <Twitter size={16} className="cursor-pointer hover:scale-110 transition-transform" />
              </div>
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
              <div className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="text-yellow-300">SHREE</span>
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

            {/* Cart Button */}
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

          {/* Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-8 pb-4 text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/20 ${
                  selectedCategory === category.id ? 'bg-white/30 font-bold' : ''
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
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-white/30 font-bold' : 'hover:bg-white/20'
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

      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900 via-red-800 to-orange-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
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
            <button className="bg-yellow-400 text-orange-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl">
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

      {/* Products Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
            Our Delicious Collection
          </h2>
          <p className="text-xl text-orange-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Handpicked favorites from our kitchen to yours
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
              
              {/* Badges */}
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

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <Heart 
                  size={20} 
                  className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>

              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="text-sm font-bold text-orange-900">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>

                <h3 className="text-xl font-bold text-orange-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Weight Options */}
                <div className="flex gap-2 mb-4">
                  {product.weights.map(weight => (
                    <button
                      key={weight}
                      className="flex-1 px-3 py-2 border-2 border-orange-200 rounded-lg text-sm font-semibold text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                      {weight}
                    </button>
                  ))}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
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
          </div>
        )}
      </section>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <h2 className="text-2xl font-bold">Shopping Cart ({cartCount})</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">Add some delicious namkeen!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 bg-orange-50 p-4 rounded-xl">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.selectedWeight}</p>
                      <p className="text-lg font-bold text-orange-600 mt-1">₹{item.price}</p>
                      
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

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-bold text-orange-900">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="font-bold text-green-600">
                    {cartTotal >= 999 ? 'FREE' : '₹50'}
                  </span>
                </div>
                <div className="flex justify-between text-2xl border-t pt-3">
                  <span className="font-bold text-orange-900">Total:</span>
                  <span className="font-bold text-orange-600">
                    ₹{cartTotal + (cartTotal >= 999 ? 0 : 50)}
                  </span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105">
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
              <h3 className="text-2xl font-bold mb-4 text-yellow-300">SHREE NAMKEEN</h3>
              <p className="text-orange-200 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Authentic Indian snacks made with tradition and love since 1985.
              </p>
              <div className="flex gap-4">
                <Facebook className="cursor-pointer hover:text-yellow-300 transition-colors" />
                <Instagram className="cursor-pointer hover:text-yellow-300 transition-colors" />
                <Twitter className="cursor-pointer hover:text-yellow-300 transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-300">Quick Links</h4>
              <ul className="space-y-2 text-orange-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Our Products</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-300">Customer Service</h4>
              <ul className="space-y-2 text-orange-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Return Policy</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-300">Contact Info</h4>
              <ul className="space-y-3 text-orange-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <MapPin size={20} className="flex-shrink-0 mt-1" />
                  <span>123 Namkeen Street, Food Plaza, Mumbai - 400001</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={20} />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={20} />
                  <span>info@shreenamkeen.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <p>© 2026 Shree Namkeen. All rights reserved. Made with ❤️ in India</p>
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

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@400;600;700&display=swap');
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ShreeNamkeenEcommerce;
