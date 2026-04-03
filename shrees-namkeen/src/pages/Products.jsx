import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

/**
 * Products — Filtered product listing page.
 *
 * Reads `category` and `q` from URL search params, filters the product
 * catalog accordingly, and renders a responsive grid of ProductCards.
 * "Clear Filters" resets the search params.
 */
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  /** Resolve the display name for the active category. */
  const categoryName =
    categories.find((c) => c.id === selectedCategory)?.name || 'All Products';

  /** Filter products by category + search query from URL params. */
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /** Reset all filters by clearing URL search params. */
  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <section className="py-16 container mx-auto px-4">
      {/* ── Section Header ── */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-orange-900 mb-4">
          {categoryName}
        </h2>
        <p
          className="text-xl text-orange-700"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {filteredProducts.length} delicious items to choose from
        </p>
      </div>

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ── Empty State ── */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-500">No products found</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;
