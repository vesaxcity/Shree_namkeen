import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

/**
 * ProductDetail — Full-page view for a single product.
 *
 * Reads the product ID from URL params via useParams(), looks it up
 * in the products array, and renders the detail view. Cart/wishlist
 * actions come from CartContext.
 */
const ProductDetail = () => {
  const { id } = useParams();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <section className="py-32 text-center">
        <h1 className="text-4xl font-bold text-orange-900 mb-4">
          Product Not Found
        </h1>
        <Link
          to="/products"
          className="text-orange-600 hover:text-orange-700 font-semibold"
        >
          ← Back to Products
        </Link>
      </section>
    );
  }

  const discountPercent = Math.round(
    (1 - product.price / product.originalPrice) * 100
  );

  return (
    <section className="py-16 container mx-auto px-4">
      {/* ── Back Button ── */}
      <Link
        to="/products"
        className="mb-8 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8">
        {/* ── Image ── */}
        <div>
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.bestseller && (
              <span className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                Bestseller
              </span>
            )}
          </div>
        </div>

        {/* ── Details ── */}
        <div>
          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
              <span className="text-lg font-bold text-orange-900">
                {product.rating}
              </span>
            </div>
            <span className="text-gray-600">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-4xl font-bold text-orange-900 mb-4">
            {product.name}
          </h1>
          <p
            className="text-lg text-gray-700 mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {product.description}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-orange-600">
              ₹{product.price}
            </span>
            <span className="text-2xl text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-bold">
              Save {discountPercent}%
            </span>
          </div>

          {/* Variant Selector */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-gray-900">
              Select Weight:
            </h3>
            <div className="flex gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  className="flex-1 px-4 py-3 border-2 border-orange-300 rounded-lg font-semibold text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all"
                >
                  {variant.weight}
                  <div className="text-sm">₹{variant.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients & Shelf Life */}
          <div className="bg-orange-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ingredients:</p>
                <p className="font-semibold text-gray-900">
                  {product.ingredients}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Shelf Life:</p>
                <p className="font-semibold text-gray-900">
                  {product.shelfLife}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => addToCart(product, product.variants[0])}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-4 border-2 border-orange-600 rounded-xl hover:bg-orange-50 transition-all"
            >
              <Heart
                size={24}
                className={
                  wishlist.includes(product.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-orange-600'
                }
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
