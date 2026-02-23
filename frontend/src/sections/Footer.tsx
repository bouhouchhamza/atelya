import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  HeartIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';

const footerLinks = {
  Shop: [
    { name: 'All Products', href: '#' },
    { name: 'Featured', href: '#' },
    { name: 'New Arrivals', href: '#' },
    { name: 'Sale', href: '#' },
  ],
  Categories: [
    { name: 'Audio', href: '#' },
    { name: 'Wearables', href: '#' },
    { name: 'Computing', href: '#' },
    { name: 'Gaming', href: '#' },
    { name: 'Mobile', href: '#' },
  ],
  Support: [
    { name: 'Help Center', href: '#' },
    { name: 'Track Order', href: '#' },
    { name: 'Shipping Info', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Warranty', href: '#' },
  ],
  Company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Contact', href: '#' },
  ],
};

export default function Footer() {
  const settings = useSettings();
  const socialLinks = [
    { icon: ChatBubbleLeftRightIcon, href: settings?.instagram ?? '#', label: 'Instagram' },
    { icon: ShareIcon, href: settings?.facebook ?? '#', label: 'Facebook' },
    { icon: HeartIcon, href: settings?.tiktok ?? '#', label: 'TikTok' },
    { icon: LinkIcon, href: settings?.contact_email ? `mailto:${settings.contact_email}` : '#', label: 'Email' },
  ];

  return (
    <footer className="bg-dark-900 text-primary-100">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-2xl font-bold">{settings?.store_name ?? 'ATELYA'}</span>
              </div>

              <p className="text-primary-400 mb-6 max-w-sm">
                {settings?.seo_description ?? 'Premium electronics for modern living. Discover cutting-edge technology with elegant design.'}
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-primary-400">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{settings?.contact_email ?? 'support@atelya.com'}</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-400">
                  <PhoneIcon className="w-5 h-5" />
                  <span>{settings?.contact_phone ?? '+1 (555) 123-4567'}</span>
                </div>
                <div className="flex items-center space-x-3 text-primary-400">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{settings?.address ?? '123 Tech Street, Silicon Valley, CA 94025'}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-white mb-4">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-primary-400 hover:text-white transition-colors">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-primary-400 text-sm">
              © 2024 {settings?.store_name ?? 'ATELYA Electronics'}. All rights reserved.
            </motion.p>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center text-primary-400 hover:text-white hover:bg-primary-600 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-primary-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-primary-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-primary-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
