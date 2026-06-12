// Central Product Store - shared between Admin and Store
// Uses localStorage for persistence + pub/sub for reactive updates

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  salePrice?: string
  category: string
  stock: number
  lowStock: number
  status: 'active' | 'draft' | 'archived'
  rating: number
  sales: number
  reviewCount: number
  image?: string
  specs?: Record<string, string>
}

const STORAGE_KEY = 'eride_products_v2'
const LISTENERS = new Set<() => void>()

function notify() {
  LISTENERS.forEach((fn) => fn())
}

export function subscribeProducts(listener: () => void): () => void {
  LISTENERS.add(listener)
  return () => { LISTENERS.delete(listener) }
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'E-Ride City Pro', slug: 'e-ride-city-pro', description: 'Premium electric bike for city commuting with 80km range.', price: '185000', salePrice: '169000', category: 'e-bikes', stock: 15, lowStock: 5, status: 'active', rating: 4.8, sales: 142, reviewCount: 124, image: '/product-ebike-premium.jpg', specs: { Range: '80km', Speed: '45km/h', Battery: '48V 15Ah' } },
  { id: 2, name: 'E-Ride Urban Glide', slug: 'e-ride-urban-glide', description: 'Lightweight foldable e-scooter for urban mobility.', price: '125000', salePrice: '112500', category: 'e-scooters', stock: 22, lowStock: 5, status: 'active', rating: 4.6, sales: 98, reviewCount: 89, image: '/product-escooter-city.jpg', specs: { Range: '45km', Speed: '35km/h', Weight: '16kg' } },
  { id: 3, name: 'E-Ride Trail Blazer', slug: 'e-ride-trail-blazer', description: 'Off-road electric scooter with dual suspension.', price: '259000', salePrice: '259000', category: 'e-scooters', stock: 3, lowStock: 5, status: 'active', rating: 4.9, sales: 67, reviewCount: 67, image: '/product-escooter-offroad.jpg', specs: { Range: '60km', Speed: '55km/h', Motor: '2000W' } },
  { id: 4, name: 'E-Ride Mountain X', slug: 'e-ride-mountain-x', description: 'Full-suspension electric mountain bike.', price: '320000', salePrice: '289000', category: 'e-bikes', stock: 6, lowStock: 5, status: 'active', rating: 4.7, sales: 45, reviewCount: 45, image: '/product-ebike-mountain.jpg', specs: { Range: '100km', Speed: '50km/h', Motor: '1000W' } },
  { id: 5, name: 'E-Ride Air Helmet', slug: 'e-ride-air-helmet', description: 'Lightweight ventilated helmet with LED light.', price: '8500', category: 'accessories', stock: 50, lowStock: 10, status: 'active', rating: 4.5, sales: 312, reviewCount: 210, image: '/product-accessory-helmet.jpg', specs: { Weight: '280g', Sizes: 'M/L/XL', LED: 'Yes' } },
  { id: 6, name: 'E-Ride Smart Lock', slug: 'e-ride-smart-lock', description: 'Fingerprint & Bluetooth smart lock.', price: '12000', salePrice: '9900', category: 'accessories', stock: 35, lowStock: 8, status: 'active', rating: 4.4, sales: 189, reviewCount: 156, image: '/product-accessory-lock.jpg', specs: { Type: 'Fingerprint', Battery: '1yr', Alarm: '110dB' } },
]

// --- Load ---
export function loadProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  // First time: save defaults then return them
  saveProducts(DEFAULT_PRODUCTS)
  return DEFAULT_PRODUCTS
}

// --- Save ---
export function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    notify()
  } catch { /* ignore */ }
}

// --- Get all ---
export function getProducts(): Product[] {
  return loadProducts()
}

// --- Get by ID ---
export function getProductById(id: number): Product | undefined {
  return loadProducts().find((p) => p.id === id)
}

// --- Add ---
export function addProduct(product: Omit<Product, 'id'>) {
  const products = loadProducts()
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0)
  const newProduct: Product = { ...product, id: maxId + 1 }
  const updated = [...products, newProduct]
  saveProducts(updated)
  return newProduct
}

// --- Update ---
export function updateProduct(id: number, changes: Partial<Product>) {
  const products = loadProducts()
  const updated = products.map((p) => p.id === id ? { ...p, ...changes } : p)
  saveProducts(updated)
}

// --- Delete ---
export function deleteProduct(id: number) {
  const products = loadProducts()
  const updated = products.filter((p) => p.id !== id)
  saveProducts(updated)
}

// --- Filter ---
export function getProductsByCategory(category: string): Product[] {
  const products = loadProducts()
  if (category === 'all') return products
  return products.filter((p) => p.category === category)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return loadProducts().filter((p) =>
    p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  )
}

// --- Stats ---
export function getProductStats() {
  const products = loadProducts()
  return {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    lowStock: products.filter((p) => p.stock <= p.lowStock).length,
    totalSales: products.reduce((s, p) => s + p.sales, 0),
  }
}

// --- Featured ---
export function getFeaturedProducts(): Product[] {
  return loadProducts().filter((p) => p.status === 'active')
}
