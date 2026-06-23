import { useState, useMemo, useCallback } from 'react'
import { trpc } from '@/providers/trpc'

export interface Product {
  id: number
  name: string
  description: string
  category: string
  categoryId?: number
  price: string
  salePrice: string | null
  stock: number
  lowStock?: number
  specs?: any
  images?: any
  image?: string
  rating: number
  reviewCount: number
  slug?: string
  status?: string
  sales?: number
}

const STORAGE_KEY = 'nxv-admin-products'

const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, name: 'Nexivora City Pro', description: 'Premium foldable electric bike for urban commuting. 500W motor, 48V 20Ah battery, 65km range.', category: 'e-bikes', price: '169000', salePrice: null, stock: 12, lowStock: 5, rating: 4.8, reviewCount: 24, slug: 'nexivora-city-pro', status: 'active', sales: 156, image: '/product-ebike-premium.jpg' },
  { id: 2, name: 'Nexivora Urban Glide', description: 'Sleek urban commuter scooter with dual suspension and 10-inch pneumatic tires.', category: 'e-scooters', price: '125000', salePrice: null, stock: 8, lowStock: 5, rating: 4.6, reviewCount: 18, slug: 'nexivora-urban-glide', status: 'active', sales: 89, image: '/product-escooter-urban.jpg' },
  { id: 3, name: 'Nexivora Trail Blazer', description: 'Rugged off-road electric scooter. Dual 1000W motors, all-terrain tires.', category: 'e-scooters', price: '259000', salePrice: '285000', stock: 5, lowStock: 5, rating: 4.9, reviewCount: 12, slug: 'nexivora-trail-blazer', status: 'active', sales: 67, image: '/product-escooter-offroad.jpg' },
  { id: 4, name: 'Nexivora Metro Mini', description: 'Ultra-compact folding e-bike for city dwellers with limited storage.', category: 'e-bikes', price: '95000', salePrice: null, stock: 20, lowStock: 5, rating: 4.5, reviewCount: 31, slug: 'nexivora-metro-mini', status: 'active', sales: 203, image: '/product-ebike-premium.jpg' },
  { id: 5, name: 'Nexivora Speedster X1', description: 'High-performance road e-bike with carbon fiber frame and hydraulic brakes.', category: 'e-bikes', price: '299000', salePrice: '320000', stock: 3, lowStock: 5, rating: 4.7, reviewCount: 8, slug: 'nexivora-speedster-x1', status: 'active', sales: 45, image: '/product-ebike-premium.jpg' },
  { id: 6, name: 'Nexivora Cargo Hauler', description: 'Heavy-duty electric cargo bike with extended frame and 150kg load capacity.', category: 'e-bikes', price: '210000', salePrice: null, stock: 7, lowStock: 5, rating: 4.4, reviewCount: 15, slug: 'nexivora-cargo-hauler', status: 'active', sales: 78, image: '/product-ebike-premium.jpg' },
  { id: 7, name: 'Nexivora Air Helmet', description: 'Ultra-lightweight certified helmet with integrated LED taillight.', category: 'accessories', price: '8500', salePrice: null, stock: 50, lowStock: 10, rating: 4.6, reviewCount: 42, slug: 'nexivora-air-helmet', status: 'active', sales: 312, image: '/product-accessory-helmet.jpg' },
  { id: 8, name: 'Nexivora Smart Lock', description: 'Fingerprint-enabled smart lock with 110dB alarm and GPS tracking.', category: 'accessories', price: '12000', salePrice: null, stock: 35, lowStock: 10, rating: 4.4, reviewCount: 28, slug: 'nexivora-smart-lock', status: 'active', sales: 189, image: '/product-accessory-lock.jpg' },
]

function loadFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return [...FALLBACK_PRODUCTS]
}

function saveToStorage(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function useProducts() {
  const utils = trpc.useUtils()

  // Try API first
  const { data: apiProducts } = trpc.product.list.useQuery(
    { limit: 50 },
    { staleTime: 60_000 }
  )

  // Local state for admin CRUD
  const [localProducts, setLocalProducts] = useState<Product[]>(loadFromStorage)

  // Use API data when available, otherwise localStorage
  const products = useMemo(() => {
    if (apiProducts?.items && apiProducts.items.length > 0) {
      return apiProducts.items.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        category: p.category || 'e-bikes',
        price: String(p.price || 0),
        salePrice: p.salePrice ? String(p.salePrice) : null,
        stock: p.stock || 0,
        lowStock: p.lowStockThreshold || 5,
        rating: parseFloat(p.rating) || 0,
        reviewCount: p.reviewCount || 0,
        slug: p.slug || '',
        status: p.status || 'active',
        sales: 0,
        image: Array.isArray(p.images) ? `/product-${p.images[0]}.jpg` : (p.image || ''),
      }))
    }
    return localProducts
  }, [apiProducts, localProducts])

  const stats = useMemo(() => {
    const active = products.filter(p => p.status === 'active').length
    const lowStock = products.filter(p => (p.stock || 0) <= (p.lowStock || 5)).length
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0)
    return { total: products.length, active, lowStock, totalSales }
  }, [products])

  const add = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now() } as Product
    setLocalProducts(prev => {
      const updated = [...prev, newProduct]
      saveToStorage(updated)
      return updated
    })
  }, [])

  const update = useCallback((id: number, changes: Partial<Product>) => {
    setLocalProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...changes } : p)
      saveToStorage(updated)
      return updated
    })
  }, [])

  const remove = useCallback((id: number) => {
    setLocalProducts(prev => {
      const updated = prev.filter(p => p.id !== id)
      saveToStorage(updated)
      return updated
    })
  }, [])

  // Also keep the query functions for other pages
  const listQuery = (category?: string, search?: string, sortBy?: string) => {
    return trpc.product.list.useQuery(
      { category: category === 'all' ? undefined : category, search, sortBy: sortBy as any, limit: 50 },
      { staleTime: 60_000 }
    )
  }

  const featuredQuery = () => {
    return trpc.product.getFeatured.useQuery(undefined, { staleTime: 60_000 })
  }

  const getById = (id: number) => {
    return trpc.product.getById.useQuery({ id }, { staleTime: 60_000, enabled: !!id })
  }

  const categoriesQuery = () => {
    return trpc.product.categories.useQuery(undefined, { staleTime: 300_000 })
  }

  return {
    products,
    stats,
    add,
    update,
    remove,
    listQuery,
    featuredQuery,
    getById,
    categoriesQuery,
    utils,
  }
}
