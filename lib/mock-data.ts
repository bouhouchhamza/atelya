import {
  Product,
  Category,
  Customer,
  Order,
  Address,
  WishlistItem,
  PublicSettings,
  AdminStats,
  AnalyticsSummary,
} from "@/types";

export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Audio", slug: "audio", description: "Studio-grade sound engineering.", image: "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=800&auto=format&fit=crop" },
  { id: "c2", name: "Displays", slug: "displays", description: "Immersive 4K and OLED panels.", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop" },
  { id: "c3", name: "Peripherals", slug: "peripherals", description: "Precision tools for creators and engineers.", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop" },
  { id: "c4", name: "Accessories", slug: "accessories", description: "Power, connectivity, and organization.", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Aura One ANC Headphones",
    slug: "aura-one-anc-headphones",
    shortDescription: "Reference-grade wireless audio with adaptive noise cancellation.",
    description: "Crafted from aerospace-grade aluminum and memory foam, the Aura One offers an uncompromised listening experience. Features 50mm beryllium drivers, 40 hours of battery life, and spatial audio support.",
    price: 399.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    categoryId: "c1",
    categoryName: "Audio",
    featured: true,
    stock: 85,
    benefits: ["Beryllium Drivers", "Adaptive ANC", "40h Battery", "Multipoint Bluetooth"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "ProDisplay X32 OLED",
    slug: "prodisplay-x32-oled",
    shortDescription: "32-inch 4K OLED reference monitor.",
    description: "Perfect infinite contrast, 99% DCI-P3 color gamut, and 120Hz refresh rate. Calibrated out of the box for accurate color grading and immersive coding sessions.",
    price: 1299.0,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    categoryId: "c2",
    categoryName: "Displays",
    featured: true,
    stock: 12,
    benefits: ["4K OLED", "120Hz Refresh", "99% DCI-P3", "Thunderbolt 4 Hub"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Aura Type-C Mechanical Keyboard",
    slug: "aura-type-c-keyboard",
    shortDescription: "Hot-swappable 75% mechanical keyboard engineered for heavy typing.",
    description: "Machined from a solid block of aluminum. Features gasket mounting, pre-lubed custom linear switches, and double-shot PBT keycaps. The ultimate typing instrument.",
    price: 195.0,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    categoryId: "c3",
    categoryName: "Peripherals",
    featured: true,
    stock: 45,
    benefits: ["Hot-Swappable", "Aluminum Case", "Gasket Mounted", "QMK/VIA Support"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Core Dock Thunderbolt 4",
    slug: "core-dock-tb4",
    shortDescription: "One cable to power your whole desk.",
    description: "Delivers 100W of power, connects dual 4K monitors, and offers 10Gbps data speeds. Wrapped in a sleek anodized chassis that complements premium workstations.",
    price: 249.0,
    image: "https://images.unsplash.com/photo-1621360841013-c76831f1628f?q=80&w=800&auto=format&fit=crop",
    categoryId: "c4",
    categoryName: "Accessories",
    featured: false,
    stock: 200,
    benefits: ["100W Power Delivery", "Dual 4K Support", "4x Thunderbolt Ports", "Gigabit Ethernet"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p5",
    name: "Master Flow Ergonomic Mouse",
    slug: "master-flow-mouse",
    shortDescription: "Engineered for endless productivity.",
    description: "A sculpted shape that rests your hand naturally. Features a MagSpeed electromagnetic scroll wheel, 8000 DPI sensor tracking on glass, and custom app profiles.",
    price: 99.0,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    categoryId: "c3",
    categoryName: "Peripherals",
    featured: true,
    stock: 150,
    benefits: ["MagSpeed Wheel", "Track-on-Glass Sensor", "USB-C Charge"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p6",
    name: "Aura Studio Webcam 4K",
    slug: "aura-studio-webcam-4k",
    shortDescription: "DSLR-like quality in a premium webcam.",
    description: "A large Sony STARVIS sensor combined with an f/1.8 lens delivers uncompressed 4K video. Look incredible in every meeting, even in low light.",
    price: 179.0,
    image: "https://images.unsplash.com/photo-1557053910-b1d5c2be6609?q=80&w=800&auto=format&fit=crop",
    categoryId: "c3",
    categoryName: "Peripherals",
    featured: false,
    stock: 0,
    benefits: ["4K HDR", "f/1.8 Lens", "AI Auto-framing", "Privacy Shutter"],
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "usr1", name: "Alex Mercer", email: "alex@example.com", phone: "+1 555-0192", role: "customer", totalSpent: 789.00, orderCount: 2 },
  { id: "usr2", name: "Sarah Chen", email: "admin@aura.com", phone: "+1 555-0193", role: "admin", totalSpent: 0, orderCount: 0 },
];

export const MOCK_ADDRESSES: Address[] = [
  { id: "add1", label: "Home", fullName: "Alex Mercer", phone: "+1 555-0192", city: "New York", country: "USA", line1: "123 Minimalist St", postalCode: "10001", isDefault: true }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_1001", orderNumber: "ORD-1001", customerId: "usr1", customerName: "Alex Mercer",
    items: [{ id: "oi1", productId: "p1", name: "Aura One ANC Headphones", price: 399.0, quantity: 1, image: MOCK_PRODUCTS[0].image }],
    subtotal: 399.0, shipping: 0, total: 399.0, status: "delivered", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), address: MOCK_ADDRESSES[0]
  },
  {
    id: "ord_1002", orderNumber: "ORD-1002", customerId: "usr1", customerName: "Alex Mercer",
    items: [{ id: "oi2", productId: "p3", name: "Aura Type-C Mechanical Keyboard", price: 195.0, quantity: 2, image: MOCK_PRODUCTS[2].image }],
    subtotal: 390.0, shipping: 0, total: 390.0, status: "processing", createdAt: new Date().toISOString(), address: MOCK_ADDRESSES[0]
  }
];

export const MOCK_WISHLIST: WishlistItem[] = [
  { id: "w1", productId: "p2" },
  { id: "w2", productId: "p5" }
];

export const MOCK_SETTINGS: PublicSettings = {
  storeName: "AURA",
  heroTitle: "ELEVATE YOUR WORKSPACE.",
  heroSubtitle: "Premium electronics designed for clarity, performance, and modern creators.",
  supportEmail: "concierge@aura.com",
  currency: "USD",
  brandTagline: "Built for purists. Engineered for creators."
};

export const MOCK_ADMIN_STATS: AdminStats = {
  totalRevenue: 28450.00,
  totalOrders: 64,
  totalCustomers: 89,
  totalProducts: 6,
  activeProducts: 5,
  lowStockAlerts: 1
};

export const MOCK_ANALYTICS: AnalyticsSummary = {
  visits: 18400,
  conversionRate: 4.1,
  salesByMonth: [
    { month: "Jan", revenue: 15400 },
    { month: "Feb", revenue: 19200 },
    { month: "Mar", revenue: 28450 }
  ],
  topProducts: [
    { id: "p1", name: "Aura One ANC Headphones", salesCount: 85, revenue: 85 * 399 },
    { id: "p3", name: "Aura Type-C Keyboard", salesCount: 42, revenue: 42 * 195 }
  ]
};
