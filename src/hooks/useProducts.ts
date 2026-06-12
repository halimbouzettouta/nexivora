import { useState, useEffect, useCallback } from 'react'
import { loadProducts, saveProducts, addProduct, updateProduct, deleteProduct, getProductStats, subscribeProducts, type Product } from './productStore'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts)

  // Re-load when storage changes from other tabs/components
  useEffect(() => {
    const handleStorage = () => setProducts(loadProducts())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Subscribe to internal pub/sub
  useEffect(() => {
    const unsub = subscribeProducts(() => setProducts(loadProducts()))
    return () => { unsub() }
  }, [])

  const refresh = useCallback(() => setProducts(loadProducts()), [])

  const add = useCallback((product: Omit<Product, 'id'>) => {
    addProduct(product)
    setProducts(loadProducts())
  }, [])

  const update = useCallback((id: number, changes: Partial<Product>) => {
    updateProduct(id, changes)
    setProducts(loadProducts())
  }, [])

  const remove = useCallback((id: number) => {
    deleteProduct(id)
    setProducts(loadProducts())
  }, [])

  const stats = getProductStats()

  return { products, add, update, remove, refresh, stats, save: saveProducts }
}

export type { Product }
