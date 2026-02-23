import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../lib/api';
import type { Product, Category, ProductFilters } from '../types';

function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-700">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.featured && (
          <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-primary-600 dark:text-primary-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-900 dark:text-primary-100">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIconSolid
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-primary-600 dark:text-primary-400 ml-1">(4.5)</span>
          </div>
        </div>
        
        <motion.button
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data),
  });

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get('/products', { params: filters }).then(res => res.data),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFilters(prev => ({
      ...prev,
      category_id: categoryId === prev.category_id ? undefined : categoryId
    }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort, direction: 'asc' }));
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-900">
      {/* Header */}
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-primary-200 dark:border-dark-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">Shop</h1>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-primary-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">Filters</h2>
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-400" />
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-medium text-primary-900 dark:text-primary-100 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories?.map((category: Category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category_id === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-primary-700 dark:text-primary-300">{category.name}</span>
                      <span className="text-sm text-primary-400">({category.products_count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium text-primary-900 dark:text-primary-100 mb-4">Sort By</h3>
                <select
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-primary-200 dark:border-dark-600 bg-white dark:bg-dark-700 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="created_at">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load products. Please try again later.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-primary-600 dark:text-primary-400">
                    Showing {productsData?.data?.length || 0} products
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData?.data?.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {productsData?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-primary-600 dark:text-primary-400">No products found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
