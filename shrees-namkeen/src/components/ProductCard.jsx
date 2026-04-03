import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * ProductCard — Reusable product card.
 *
 * Reads cart/wishlist actions from context. Navigation to detail page
 * uses <Link> instead of an onClick handler. All existing Tailwind
 * classes are preserved exactly.
 *
 * @param {Object} props
 * @param {Object} props.product - Full product data object.
 */
const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const discountPercent = Math.round(
    (1 - product.price / product.originalPrice) * 100
  );

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative cursor-pointer block"
    >
      {/* ── Badges ── */}
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

      {/* ── Wishlist Heart ── */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Heart
          size={20}
          className={
            wishlist.includes(product.id)
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400'
          }
        />
      </button>

      {/* ── Product Image ── */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* ── Card Body ── */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={16} />
            <span className="text-sm font-bold text-orange-900">
              {product.rating}
            </span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-orange-900 mb-2">
          {product.name}
        </h3>
        <p
          className="text-sm text-gray-600 mb-4 line-clamp-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-orange-600">
            ₹{product.price}
          </span>
          <span className="text-lg text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, product.variants[0]);
          }}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
