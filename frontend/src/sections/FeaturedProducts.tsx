import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../lib/api';
import type { Product } from '../types';

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

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products/featured?limit=8').then(res => res.data),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-primary-50 dark:bg-dark-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-primary-50 dark:bg-dark-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Featured Products
          </h2>
          <p className="text-red-500">Failed to load products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-primary-50 dark:bg-dark-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-primary-700 dark:text-primary-300 max-w-2xl mx-auto">
            Discover our handpicked selection of premium electronics that combine cutting-edge technology with elegant design.
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product: Product, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            className="px-8 py-4 bg-white dark:bg-dark-800 text-primary-700 dark:text-primary-300 font-semibold rounded-2xl border-2 border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/shop'}
          >
            View All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
