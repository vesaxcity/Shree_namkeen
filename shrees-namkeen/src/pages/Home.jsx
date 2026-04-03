import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, Shield, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

/**
 * Home — Landing page.
 *
 * Fully self-contained: imports data directly and reads cart/wishlist
 * from context via ProductCard. Uses <Link> for all navigation.
 */
const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Package, title: 'Fresh Products', desc: 'Made daily' },
    { icon: Truck, title: 'Free Delivery', desc: 'Orders above ₹999' },
    { icon: Shield, title: '100% Quality', desc: 'Guaranteed' },
    { icon: Clock, title: 'Quick Service', desc: '24/7 support' },
  ];

  return (
    <>
      {/* ══════════ Hero Banner ══════════ */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900 via-red-800 to-orange-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Taste the
              <br />
              <span className="text-yellow-300">Tradition</span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 text-orange-100"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Authentic Indian snacks crafted with love and the finest
              ingredients
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 text-orange-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ Features Strip ══════════ */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50"
              >
                <feature.icon
                  className="mx-auto mb-4 text-orange-600"
                  size={40}
                />
                <h3 className="font-bold text-lg mb-2 text-orange-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-orange-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ Categories Grid ══════════ */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
            Our Categories
          </h2>
          <p
            className="text-xl text-orange-700"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Explore our delicious collection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories
            .filter((c) => c.id !== 'all')
            .map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/products?category=${category.id}`)}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 p-8 text-center"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-orange-600 font-semibold">
                  {category.count} Items
                </p>
              </button>
            ))}
        </div>
      </section>

      {/* ══════════ Bestsellers ══════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
              Bestsellers
            </h2>
            <p
              className="text-xl text-orange-700"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Customer favorites you'll love
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products
              .filter((p) => p.bestseller)
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
