import type { Settings } from './types/settings';

export const fallbackPublicSettings: Settings = {
  store_name: 'ATELYA',
  store_logo_url: null,
  favicon_url: null,
  primary_color: '#8B7355',
  secondary_color: null,
  hero_title: 'ATELYA',
  hero_subtitle: 'Premium electronics for modern life.',
  hero_cta_primary_text: 'Shop Now',
  hero_cta_primary_url: '/shop',
  hero_cta_secondary_text: 'Learn More',
  hero_cta_secondary_url: '/shop',
  contact_email: 'support@atelya.test',
  contact_phone: null,
  address: null,
  instagram: null,
  facebook: null,
  tiktok: null,
  shipping_enabled: true,
  shipping_flat_rate: null,
  tax_rate: null,
  currency: 'MAD',
  maintenance_mode: false,
  seo_title: null,
  seo_description: null,
};

export const fallbackAdminSettings = {
  store_name: 'ATELYA',
  primary_color: '#8B7355',
  currency: 'MAD',
  maintenance_mode: false,
  contact_email: '',
  hero_title: 'ATELYA',
  hero_subtitle: '',
};
