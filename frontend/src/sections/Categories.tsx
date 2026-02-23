import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { SpeakerWaveIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { CpuChipIcon, ClockIcon } from '@heroicons/react/24/solid';
import api from '../lib/api';
import type { Category } from '../types';

const categoryIcons = {
  'Audio': SpeakerWaveIcon,
  'Wearables': ClockIcon,
  'Computing': ComputerDesktopIcon,
  'Gaming': CpuChipIcon,
  'Mobile': DevicePhoneMobileIcon,
};

const categoryColors = {
  'Audio': 'from-blue-400 to-blue-600',
  'Wearables': 'from-green-400 to-green-600',
  'Computing': 'from-purple-400 to-purple-600',
  'Gaming': 'from-red-400 to-red-600',
  'Mobile': 'from-yellow-400 to-yellow-600',
};

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const Icon = categoryIcons[category.name as keyof typeof categoryIcons] || ComputerDesktopIcon;
  const colorClass = categoryColors[category.name as keyof typeof categoryColors] || 'from-gray-400 to-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
    >
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full">
        <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100 mb-3">
          {category.name}
        </h3>
        
        <p className="text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
          {category.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-primary-500 dark:text-primary-400 font-medium">
            {category.products_count || 0} Products
          </span>
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
            <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Categories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data),
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
              Shop by Category
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Shop by Category
          </h2>
          <p className="text-red-500">Failed to load categories. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-dark-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-primary-700 dark:text-primary-300 max-w-2xl mx-auto">
            Browse our extensive collection of premium electronics organized by category to find exactly what you're looking for.
          </p>
          <div className="w-24 h-1 bg-primary-500 mx-auto mt-6"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories?.map((category: Category, index: number) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
