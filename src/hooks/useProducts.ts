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
  specs?: any
  images?: any
  image?: string
  rating: string
  reviewCount: number
  slug?: string
  status?: string
}

export function useProducts() {
  const utils = trpc.useUtils()

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
    listQuery,
    featuredQuery,
    getById,
    categoriesQuery,
    utils,
  }
}
