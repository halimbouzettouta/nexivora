import { trpc } from '@/providers/trpc'

export function useApiProducts() {
  const utils = trpc.useUtils()

  const listQuery = (category?: string, search?: string) => {
    return trpc.product.list.useQuery(
      { category, search, limit: 50 },
      { staleTime: 60_000 }
    )
  }

  const featuredQuery = () => {
    return trpc.product.getFeatured.useQuery(undefined, { staleTime: 60_000 })
  }

  const getById = (id: number) => {
    return trpc.product.getById.useQuery({ id }, { staleTime: 60_000 })
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
