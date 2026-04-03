import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Search, Phone, Mail,
  User, LogOut, Home as HomeIcon,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';

/**
 * Header — Sticky site header.
 *
 * Consumes cart/auth from context. Uses react-router <Link> and
 * useNavigate for all navigation. Search uses local state with a
 * 500ms debounce before pushing ?q= to the URL.
 */
const Header = () => {
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const debounceRef = useRef(null);

  // Keep local search state in sync when URL params change externally
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  /**
   * Debounced search: waits 500ms after the user stops typing,
   * then navigates to /products?q=term (preserving category param).
   */
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value.trim()) {
        params.set('q', value.trim());
      } else {
        params.delete('q');
      }
      navigate(`/products?${params.toString()}`);
    }, 500);
  };

  /** Submit search on Enter key. */
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const params = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      } else {
        params.delete('q');
      }
      navigate(`/products?${params.toString()}`);
    }
  };

  /** Navigate to products with a specific category filter. */
  const goToCategory = (categoryId) => {
    const params = new URLSearchParams();
    if (categoryId !== 'all') params.set('category', categoryId);
    navigate(`/products?${params.toString()}`);
  };

  /** Check if a category nav item should be highlighted. */
  const isCategoryActive = (categoryId) => {
    if (!location.pathname.startsWith('/products')) return false;
    const currentCat = searchParams.get('category') || 'all';
    return currentCat === categoryId;
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white shadow-2xl">
      <div className="container mx-auto px-4">
        {/* ── Top Contact Bar ── */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-orange-500/30">
          <div className="flex items-center gap-6">
            <a
              href="tel:+919140410003"
              className="flex items-center gap-2 hover:text-orange-200 transition-colors"
            >
              <Phone size={14} />
              <span className="hidden md:inline">+91 91404 10003</span>
            </a>
            <a
              href="mailto:info@shreesnamkeen.com"
              className="flex items-center gap-2 hover:text-orange-200 transition-colors"
            >
              <Mail size={14} />
              <span className="hidden md:inline">info@shreesnamkeen.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-orange-200">
              Free Shipping on Orders Above ₹999
            </span>
          </div>
        </div>

        {/* ── Main Header Row ── */}
        <div className="flex items-center justify-between py-4">
          {/* Logo + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-orange-700 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              to="/"
              className="text-3xl md:text-4xl font-bold tracking-tight cursor-pointer"
            >
              <span className="text-yellow-300">SHREE's</span>
              <span className="text-white"> NAMKEEN</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for delicious namkeen..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-orange-400/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Cart & Auth Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                  <User size={24} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-t-lg"
                  >
                    My Account
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-gray-700 hover:bg-orange-50"
                  >
                    My Orders
                  </a>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all text-sm font-semibold"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-orange-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Desktop Navigation ── */}
        <nav
          className="hidden lg:flex items-center justify-center gap-8 pb-4 text-base"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/20 ${
              location.pathname === '/' ? 'bg-white/30 font-bold' : ''
            }`}
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => goToCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-white/20 ${
                isCategoryActive(category.id)
                  ? 'bg-white/30 font-bold'
                  : ''
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Mobile Menu ── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-orange-700 border-t border-orange-500/30">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-orange-400/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            {/* Mobile Nav Links */}
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                <HomeIcon size={18} />
                <span>Home</span>
              </Link>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    goToCategory(category.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isCategoryActive(category.id)
                      ? 'bg-white/30 font-bold'
                      : 'hover:bg-white/20'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
