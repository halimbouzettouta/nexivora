// When the backend API is unavailable (static deployment),
// this hook provides fallback data from localStorage

import { useState, useEffect } from 'react'

// Products fallback
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Nexivora City Pro', description: 'Premium foldable electric bike designed for urban commuting. Features a powerful 500W motor and 48V 20Ah lithium battery.', category: 'e-bikes', categoryId: 1, price: '185000', salePrice: '169000', stock: 15, specs: { motor: '500W', battery: '48V 20Ah', range: '65km', speed: '45km/h', weight: '22kg', charging: '6h' }, images: ['ebike-premium'], image: '/product-ebike-premium.jpg', rating: '4.5', reviewCount: 24, slug: 'city-pro' },
  { id: 2, name: 'Nexivora Urban Glide', description: 'Sleek urban commuter scooter with dual suspension, 10-inch pneumatic tires, and smart app connectivity.', category: 'e-scooters', categoryId: 2, price: '125000', salePrice: null, stock: 22, specs: { motor: '350W', battery: '36V 15Ah', range: '45km', speed: '35km/h', weight: '16kg', charging: '5h' }, images: ['escooter-city'], image: '/product-escooter-city.jpg', rating: '4.3', reviewCount: 18, slug: 'urban-glide' },
  { id: 3, name: 'Nexivora Trail Blazer', description: 'Rugged off-road electric scooter built for adventure. Dual 1000W motors, all-terrain tires, and IPX5 water resistance.', category: 'e-scooters', categoryId: 2, price: '285000', salePrice: '259000', stock: 8, specs: { motor: 'Dual 1000W', battery: '52V 28Ah', range: '80km', speed: '65km/h', weight: '35kg', charging: '8h' }, images: ['escooter-offroad'], image: '/product-escooter-offroad.jpg', rating: '4.8', reviewCount: 12, slug: 'trail-blazer' },
  { id: 4, name: 'Nexivora Lite Scooter', description: 'Lightweight and compact electric scooter perfect for short commutes and quick errands around the city.', category: 'e-scooters', categoryId: 2, price: '75000', salePrice: null, stock: 30, specs: { motor: '250W', battery: '36V 10Ah', range: '30km', speed: '25km/h', weight: '12kg', charging: '4h' }, images: ['escooter-lite'], image: '/product-escooter-lite.jpg', rating: '4.1', reviewCount: 35, slug: 'lite-scooter' },
  { id: 5, name: 'Nexivora X1 E-Bike', description: 'High-performance electric mountain bike with full suspension, hydraulic brakes, and a 750W mid-drive motor.', category: 'e-bikes', categoryId: 1, price: '245000', salePrice: '229000', stock: 10, specs: { motor: '750W', battery: '48V 17Ah', range: '70km', speed: '50km/h', weight: '25kg', charging: '7h' }, images: ['ebike-mountain'], image: '/product-ebike-mountain.jpg', rating: '4.7', reviewCount: 15, slug: 'x1-ebike' },
  { id: 6, name: 'Nexivora Cargo Pro', description: 'Heavy-duty electric cargo bike designed for deliveries and transporting goods. 1000W motor with extended frame.', category: 'e-bikes', categoryId: 1, price: '320000', salePrice: '299000', stock: 5, specs: { motor: '1000W', battery: '52V 20Ah', range: '55km', speed: '40km/h', weight: '40kg', charging: '8h' }, images: ['ebike-cargo'], image: '/product-ebike-cargo.jpg', rating: '4.6', reviewCount: 8, slug: 'cargo-pro' },
]

// Articles fallback
const FALLBACK_ARTICLES = [
  { id: 1, slug: 'choosing-your-first-e-bike', title: 'Choosing Your First E-Bike: A Complete Guide', excerpt: 'Everything you need to know before buying your first electric bike. From motor types to battery range, we cover it all.', category: 'Guides', readTime: 8, date: '2025-05-15', publishedAt: '2025-05-15', featuredImage: '/article-guide.jpg', content: 'Electric bikes are transforming how people commute...' },
  { id: 2, slug: 'battery-care-tips', title: 'E-Bike Battery Care: Extend Your Range', excerpt: 'Simple maintenance tips to double your battery lifespan and maximize range on every ride.', category: 'Maintenance', readTime: 5, date: '2025-05-10', publishedAt: '2025-05-10', featuredImage: '/article-battery.jpg', content: 'Your e-bike battery is the most expensive component...' },
  { id: 3, slug: 'electric-mobility-revolution', title: "Electric Mobility Revolution", excerpt: 'How electric bikes and scooters are changing urban transportation across cities around the world.', category: 'Industry News', readTime: 6, date: '2025-04-28', publishedAt: '2025-04-28', featuredImage: '/article-industry.jpg', content: 'From cities worldwide, electric two-wheelers are becoming...' },
  { id: 4, slug: 'understanding-your-motor', title: 'Understanding Your E-Bike Motor', excerpt: 'A deep dive into how electric bike motors work and what to look for when choosing one.', category: 'Technology', readTime: 7, date: '2025-04-20', publishedAt: '2025-04-20', featuredImage: '/article-motor.jpg', content: 'The motor is the heart of your e-bike...' },
  { id: 5, slug: 'safety-gear-essentials', title: 'Safety Gear Every Rider Needs', excerpt: 'The essential protective equipment you should never ride without, from helmets to lights.', category: 'Safety', readTime: 4, date: '2025-04-12', publishedAt: '2025-04-12', featuredImage: '/article-safety.jpg', content: 'Safety should never be compromised...' },
  { id: 6, slug: 'charging-best-practices', title: 'Best Charging Practices for E-Scooters', excerpt: 'How to properly charge your electric scooter for maximum battery life and performance.', category: 'Maintenance', readTime: 5, date: '2025-03-30', publishedAt: '2025-03-30', featuredImage: '/article-charging.jpg', content: 'Proper charging habits are the key...' },
]

// Dealers fallback
const FALLBACK_DEALERS = [
  { id: 1, name: 'Nexivora Algiers Center', city: 'Algiers', region: 'Center', address: '123 Boulevard Mohamed VI, Algiers', phone: '0234-567-890', hours: 'Sat-Thu 9AM-6PM', latitude: '36.7538', longitude: '3.0588' },
  { id: 2, name: 'Nexivora Oran Showroom', city: 'Oran', region: 'West', address: '45 Avenue Emir Abdelkader, Oran', phone: '0412-345-678', hours: 'Sat-Thu 9AM-7PM', latitude: '35.6971', longitude: '-0.6308' },
  { id: 3, name: 'Nexivora Constantine', city: 'Constantine', region: 'East', address: '78 Rue Ahmed Bey, Constantine', phone: '0315-678-901', hours: 'Sat-Thu 8:30AM-5:30PM', latitude: '36.3650', longitude: '6.6147' },
  { id: 4, name: 'Nexivora Annaba', city: 'Annaba', region: 'East', address: '12 Boulevard Colonel Amirouche, Annaba', phone: '0238-901-234', hours: 'Sat-Thu 9AM-6PM', latitude: '36.9044', longitude: '7.7564' },
  { id: 5, name: 'Nexivora Blida', city: 'Blida', region: 'Center', address: '34 Route de Soumaa, Blida', phone: '0235-456-789', hours: 'Sat-Thu 9AM-6PM', latitude: '36.4738', longitude: '2.8324' },
  { id: 6, name: 'Nexivora Setif', city: 'Setif', region: 'East', address: '56 Avenue du 1er Novembre, Setif', phone: '0236-789-012', hours: 'Sat-Thu 8:30AM-5:30PM', latitude: '36.1911', longitude: '5.4137' },
  { id: 7, name: 'Nexivora Tlemcen', city: 'Tlemcen', region: 'West', address: '89 Rue de la Grande Mosque, Tlemcen', phone: '0243-567-890', hours: 'Sat-Thu 9AM-6PM', latitude: '34.8828', longitude: '-1.3167' },
  { id: 8, name: 'Nexivora Batna', city: 'Batna', region: 'East', address: '23 Avenue des Freres Bouadou, Batna', phone: '0233-456-789', hours: 'Sat-Thu 9AM-6PM', latitude: '35.5559', longitude: '6.1741' },
]

export function useFallbackData() {
  const [apiAvailable, setApiAvailable] = useState(true)

  useEffect(() => {
    // Check if API is available
    fetch('/api/trpc/product.list')
      .then(() => setApiAvailable(true))
      .catch(() => setApiAvailable(false))
  }, [])

  return {
    apiAvailable,
    products: FALLBACK_PRODUCTS,
    articles: FALLBACK_ARTICLES,
    dealers: FALLBACK_DEALERS,
    getProductById: (id: number) => FALLBACK_PRODUCTS.find(p => p.id === id) || null,
    getArticleBySlug: (slug: string) => FALLBACK_ARTICLES.find(a => a.slug === slug) || null,
    getFeaturedProducts: () => FALLBACK_PRODUCTS.slice(0, 3),
  }
}
